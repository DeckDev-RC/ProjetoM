#!/usr/bin/env python3
"""
💪 Stress Tester - Projeto M
Testes de stress e carga para análise de performance sob pressão

Funcionalidades:
- Simulação de múltiplos usuários simultâneos
- Testes de carga progressiva
- Análise de degradação de performance
- Monitoramento de recursos do sistema
- Detecção de pontos de falha
- Relatórios detalhados de stress
"""

import asyncio
import aiohttp
import time
import psutil
import json
import statistics
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Callable, Any
from dataclasses import dataclass, asdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import queue
import random

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.common.action_chains import ActionChains
except ImportError:
    print("⚠️ Instale as dependências: pip install selenium webdriver-manager aiohttp psutil")
    exit(1)

@dataclass
class UserSession:
    """Representa uma sessão de usuário durante o teste"""
    user_id: int
    start_time: str
    end_time: Optional[str]
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_response_time: float
    errors: List[str]
    actions_performed: List[str]

@dataclass
class SystemMetrics:
    """Métricas do sistema durante o teste"""
    timestamp: str
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    disk_io_read: int
    disk_io_write: int
    network_sent: int
    network_recv: int
    active_connections: int

@dataclass
class StressTestResult:
    """Resultado completo do teste de stress"""
    test_id: str
    start_time: str
    end_time: str
    duration_seconds: float
    
    # Configuração do teste
    max_concurrent_users: int
    ramp_up_time: int
    test_duration: int
    
    # Resultados por usuário
    user_sessions: List[UserSession]
    
    # Métricas do sistema
    system_metrics: List[SystemMetrics]
    
    # Análise de performance
    response_times: List[float]
    throughput: float  # requests per second
    error_rate: float  # percentage
    
    # Pontos de falha
    failure_points: List[Dict]
    
    # Análise de degradação
    performance_degradation: Dict[str, Any]
    
    # Recomendações
    recommendations: List[str]

class StressTester:
    """Testador de stress avançado"""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.test_id = f"stress_test_{int(time.time())}"
        self.user_sessions: List[UserSession] = []
        self.system_metrics: List[SystemMetrics] = []
        self.response_times: List[float] = []
        
        # Configurações padrão
        self.default_config = {
            'max_users': 50,
            'ramp_up_minutes': 2,
            'test_duration_minutes': 5,
            'think_time_range': (1, 5),  # segundos entre ações
            'request_timeout': 30
        }
        
        # Ações que os usuários virtuais podem realizar
        self.user_actions = [
            ('load_page', self.action_load_page),
            ('scroll_page', self.action_scroll_page),
            ('click_elements', self.action_click_elements),
            ('hover_elements', self.action_hover_elements),
            ('resize_window', self.action_resize_window),
            ('navigate_sections', self.action_navigate_sections)
        ]
    
    def collect_system_metrics(self) -> Optional[SystemMetrics]:
        """Coleta métricas do sistema"""
        try:
            # CPU e Memória
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            # Disk I/O
            disk_io = psutil.disk_io_counters()
            
            # Network I/O
            network_io = psutil.net_io_counters()
            
            # Conexões ativas
            connections = len(psutil.net_connections())
            
            return SystemMetrics(
                timestamp=datetime.now().isoformat(),
                cpu_percent=cpu_percent,
                memory_percent=memory.percent,
                memory_used_mb=memory.used / 1024 / 1024,
                disk_io_read=disk_io.read_bytes if disk_io else 0,
                disk_io_write=disk_io.write_bytes if disk_io else 0,
                network_sent=network_io.bytes_sent if network_io else 0,
                network_recv=network_io.bytes_recv if network_io else 0,
                active_connections=connections
            )
        except Exception as e:
            print(f"⚠️ Erro ao coletar métricas do sistema: {e}")
            return None
    
    def setup_driver(self) -> webdriver.Chrome:
        """Configura Chrome para teste de stress"""
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-logging")
        options.add_argument("--disable-web-security")
        options.add_argument("--window-size=1366,768")
        
        # Reduzir overhead
        options.add_argument("--disable-images")
        options.add_argument("--disable-javascript")  # Para alguns testes
        
        service = Service(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=options)
    
    async def simulate_user(self, user_id: int, config: Dict) -> UserSession:
        """Simula um usuário individual"""
        session = UserSession(
            user_id=user_id,
            start_time=datetime.now().isoformat(),
            end_time=None,
            total_requests=0,
            successful_requests=0,
            failed_requests=0,
            average_response_time=0,
            errors=[],
            actions_performed=[]
        )
        
        driver = None
        response_times = []
        
        try:
            driver = self.setup_driver()
            
            # Duração da sessão do usuário
            session_duration = config['test_duration_minutes'] * 60
            session_end_time = time.time() + session_duration
            
            while time.time() < session_end_time:
                # Escolher ação aleatória
                action_name, action_func = random.choice(self.user_actions)
                
                try:
                    start_time = time.time()
                    await action_func(driver, user_id)
                    end_time = time.time()
                    
                    response_time = end_time - start_time
                    response_times.append(response_time)
                    
                    session.total_requests += 1
                    session.successful_requests += 1
                    session.actions_performed.append(action_name)
                    
                except Exception as e:
                    session.failed_requests += 1
                    session.errors.append(f"{action_name}: {str(e)}")
                
                # Think time (pausa entre ações)
                think_time = random.uniform(*config['think_time_range'])
                await asyncio.sleep(think_time)
            
            # Calcular métricas da sessão
            if response_times:
                session.average_response_time = statistics.mean(response_times)
                self.response_times.extend(response_times)
            
            session.end_time = datetime.now().isoformat()
            
        except Exception as e:
            session.errors.append(f"Session error: {str(e)}")
        
        finally:
            if driver:
                try:
                    driver.quit()
                except:
                    pass
        
        return session
    
    # Ações que os usuários virtuais podem realizar
    async def action_load_page(self, driver: webdriver.Chrome, user_id: int):
        """Carrega a página principal"""
        driver.get(self.base_url)
        WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
    
    async def action_scroll_page(self, driver: webdriver.Chrome, user_id: int):
        """Faz scroll na página"""
        # Scroll para baixo
        for i in range(random.randint(3, 8)):
            scroll_position = random.randint(300, 800)
            driver.execute_script(f"window.scrollBy(0, {scroll_position});")
            await asyncio.sleep(0.5)
        
        # Voltar ao topo
        driver.execute_script("window.scrollTo(0, 0);")
    
    async def action_click_elements(self, driver: webdriver.Chrome, user_id: int):
        """Clica em elementos interativos"""
        try:
            clickable_elements = driver.find_elements(By.CSS_SELECTOR, "button, a, [role='button']")
            
            if clickable_elements:
                element = random.choice(clickable_elements)
                if element.is_displayed() and element.is_enabled():
                    driver.execute_script("arguments[0].click();", element)
                    await asyncio.sleep(1)
        except:
            pass
    
    async def action_hover_elements(self, driver: webdriver.Chrome, user_id: int):
        """Faz hover sobre elementos"""
        try:
            actions = ActionChains(driver)
            elements = driver.find_elements(By.CSS_SELECTOR, "div, span, img")
            
            for _ in range(random.randint(3, 6)):
                if elements:
                    element = random.choice(elements)
                    if element.is_displayed():
                        actions.move_to_element(element).perform()
                        await asyncio.sleep(0.3)
        except:
            pass
    
    async def action_resize_window(self, driver: webdriver.Chrome, user_id: int):
        """Redimensiona a janela"""
        sizes = [(1920, 1080), (1366, 768), (768, 1024), (375, 667)]
        width, height = random.choice(sizes)
        driver.set_window_size(width, height)
        await asyncio.sleep(1)
    
    async def action_navigate_sections(self, driver: webdriver.Chrome, user_id: int):
        """Navega entre seções"""
        sections = ["#hero", "#features", "#contact", "#faq"]
        section = random.choice(sections)
        
        try:
            driver.execute_script(f"document.querySelector('{section}')?.scrollIntoView();")
            await asyncio.sleep(2)
        except:
            pass
    
    async def monitor_system_resources(self, duration_minutes: int):
        """Monitora recursos do sistema durante o teste"""
        print("📊 Iniciando monitoramento de recursos...")
        
        end_time = time.time() + (duration_minutes * 60)
        
        while time.time() < end_time:
            metrics = self.collect_system_metrics()
            if metrics:
                self.system_metrics.append(metrics)
            
            await asyncio.sleep(5)  # Coletar a cada 5 segundos
    
    async def run_stress_test(self, config: Optional[Dict] = None) -> StressTestResult:
        """Executa teste de stress completo"""
        if config is None:
            config = self.default_config
        
        print(f"💪 Iniciando Stress Test - {config['max_users']} usuários")
        print(f"📈 Ramp-up: {config['ramp_up_minutes']} min, Duração: {config['test_duration_minutes']} min")
        
        start_time = datetime.now()
        
        # Iniciar monitoramento de recursos
        monitor_task = asyncio.create_task(
            self.monitor_system_resources(
                config['ramp_up_minutes'] + config['test_duration_minutes'] + 2
            )
        )
        
        # Calcular intervalo de ramp-up
        ramp_up_interval = (config['ramp_up_minutes'] * 60) / config['max_users']
        
        # Lista de tarefas de usuários
        user_tasks = []
        
        try:
            # Fase de Ramp-up - adicionar usuários gradualmente
            print("🚀 Fase de Ramp-up...")
            for user_id in range(config['max_users']):
                # Criar tarefa de usuário
                user_task = asyncio.create_task(
                    self.simulate_user(user_id, config)
                )
                user_tasks.append(user_task)
                
                print(f"👤 Usuário {user_id + 1} iniciado ({len(user_tasks)} ativos)")
                
                # Aguardar intervalo de ramp-up
                if user_id < config['max_users'] - 1:
                    await asyncio.sleep(ramp_up_interval)
            
            print(f"🎯 Todos os {config['max_users']} usuários ativos!")
            
            # Aguardar conclusão de todos os usuários
            print("⏳ Aguardando conclusão dos testes...")
            completed_sessions = await asyncio.gather(*user_tasks, return_exceptions=True)
            
            # Processar resultados
            valid_sessions = [
                session for session in completed_sessions 
                if isinstance(session, UserSession)
            ]
            
            self.user_sessions = valid_sessions
            
            # Parar monitoramento
            monitor_task.cancel()
            
        except Exception as e:
            print(f"❌ Erro durante teste de stress: {e}")
            # Cancelar tarefas pendentes
            for task in user_tasks:
                task.cancel()
            monitor_task.cancel()
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        # Analisar resultados
        analysis_result = self.analyze_results(start_time, end_time, duration, config)
        
        return analysis_result
    
    def analyze_results(self, start_time: datetime, end_time: datetime, 
                       duration: float, config: Dict) -> StressTestResult:
        """Analisa os resultados do teste"""
        
        # Calcular métricas gerais
        total_requests = sum(session.total_requests for session in self.user_sessions)
        successful_requests = sum(session.successful_requests for session in self.user_sessions)
        failed_requests = sum(session.failed_requests for session in self.user_sessions)
        
        throughput = total_requests / duration if duration > 0 else 0
        error_rate = (failed_requests / total_requests * 100) if total_requests > 0 else 0
        
        # Detectar pontos de falha
        failure_points = self.detect_failure_points()
        
        # Analisar degradação de performance
        performance_degradation = self.analyze_performance_degradation()
        
        # Gerar recomendações
        recommendations = self.generate_stress_recommendations(error_rate, throughput, failure_points)
        
        return StressTestResult(
            test_id=self.test_id,
            start_time=start_time.isoformat(),
            end_time=end_time.isoformat(),
            duration_seconds=duration,
            max_concurrent_users=config['max_users'],
            ramp_up_time=config['ramp_up_minutes'],
            test_duration=config['test_duration_minutes'],
            user_sessions=self.user_sessions,
            system_metrics=self.system_metrics,
            response_times=self.response_times,
            throughput=throughput,
            error_rate=error_rate,
            failure_points=failure_points,
            performance_degradation=performance_degradation,
            recommendations=recommendations
        )
    
    def detect_failure_points(self) -> List[Dict]:
        """Detecta pontos de falha durante o teste"""
        failure_points = []
        
        # Analisar picos de erro
        if self.user_sessions:
            error_rates_by_time = {}
            
            for session in self.user_sessions:
                if session.failed_requests > 0:
                    start_time = datetime.fromisoformat(session.start_time)
                    minute_key = start_time.strftime("%H:%M")
                    
                    if minute_key not in error_rates_by_time:
                        error_rates_by_time[minute_key] = {'errors': 0, 'total': 0}
                    
                    error_rates_by_time[minute_key]['errors'] += session.failed_requests
                    error_rates_by_time[minute_key]['total'] += session.total_requests
            
            # Identificar picos de erro
            for time_key, data in error_rates_by_time.items():
                if data['total'] > 0:
                    error_rate = (data['errors'] / data['total']) * 100
                    if error_rate > 20:  # Mais de 20% de erro
                        failure_points.append({
                            'time': time_key,
                            'type': 'high_error_rate',
                            'error_rate': error_rate,
                            'description': f"Taxa de erro de {error_rate:.1f}% às {time_key}"
                        })
        
        # Analisar recursos do sistema
        if self.system_metrics:
            for metric in self.system_metrics:
                if metric.cpu_percent > 90:
                    failure_points.append({
                        'time': metric.timestamp,
                        'type': 'high_cpu',
                        'value': metric.cpu_percent,
                        'description': f"CPU em {metric.cpu_percent:.1f}%"
                    })
                
                if metric.memory_percent > 90:
                    failure_points.append({
                        'time': metric.timestamp,
                        'type': 'high_memory',
                        'value': metric.memory_percent,
                        'description': f"Memória em {metric.memory_percent:.1f}%"
                    })
        
        return failure_points
    
    def analyze_performance_degradation(self) -> Dict[str, Any]:
        """Analisa degradação de performance ao longo do tempo"""
        if len(self.response_times) < 10:
            return {}
        
        # Dividir tempos de resposta em períodos
        chunk_size = len(self.response_times) // 5
        chunks = [
            self.response_times[i:i + chunk_size] 
            for i in range(0, len(self.response_times), chunk_size)
        ]
        
        # Calcular médias por período
        period_averages = [statistics.mean(chunk) for chunk in chunks if chunk]
        
        if len(period_averages) < 2:
            return {}
        
        # Calcular degradação
        initial_performance = period_averages[0]
        final_performance = period_averages[-1]
        
        degradation_percent = ((final_performance - initial_performance) / initial_performance) * 100
        
        return {
            'initial_avg_response_time': initial_performance,
            'final_avg_response_time': final_performance,
            'degradation_percent': degradation_percent,
            'performance_trend': 'degrading' if degradation_percent > 10 else 'stable'
        }
    
    def generate_stress_recommendations(self, error_rate: float, throughput: float, 
                                      failure_points: List[Dict]) -> List[str]:
        """Gera recomendações baseadas no teste de stress"""
        recommendations = []
        
        # Baseado na taxa de erro
        if error_rate > 10:
            recommendations.append("🚨 Taxa de erro alta (>10%). Verificar estabilidade do servidor.")
        elif error_rate > 5:
            recommendations.append("⚠️ Taxa de erro moderada (>5%). Monitorar logs de erro.")
        else:
            recommendations.append("✅ Taxa de erro aceitável (<5%).")
        
        # Baseado no throughput
        if throughput < 1:
            recommendations.append("🐌 Throughput muito baixo (<1 req/s). Otimizar performance.")
        elif throughput < 10:
            recommendations.append("📈 Throughput pode ser melhorado (<10 req/s).")
        else:
            recommendations.append("🚀 Throughput adequado (>10 req/s).")
        
        # Baseado nos pontos de falha
        cpu_failures = [fp for fp in failure_points if fp['type'] == 'high_cpu']
        if cpu_failures:
            recommendations.append("💻 CPU sobrecarregada. Considerar scaling horizontal.")
        
        memory_failures = [fp for fp in failure_points if fp['type'] == 'high_memory']
        if memory_failures:
            recommendations.append("🧠 Memória insuficiente. Aumentar recursos ou otimizar uso.")
        
        # Recomendações gerais
        recommendations.extend([
            "📊 Implementar monitoramento contínuo de performance",
            "🔄 Configurar auto-scaling baseado em métricas",
            "🎯 Definir SLAs baseados nos resultados dos testes",
            "⚡ Otimizar componentes com maior impacto na performance"
        ])
        
        return recommendations
    
    def save_results(self, result: StressTestResult):
        """Salva resultados do teste"""
        filename = f"stress_test_results_{result.test_id}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(asdict(result), f, indent=2, ensure_ascii=False)
        
        print(f"💾 Resultados salvos em: {filename}")
    
    def print_stress_report(self, result: StressTestResult):
        """Imprime relatório do teste de stress"""
        print("\n" + "="*70)
        print("💪 RELATÓRIO DE TESTE DE STRESS")
        print("="*70)
        
        print(f"🆔 Test ID: {result.test_id}")
        print(f"⏱️ Duração: {result.duration_seconds/60:.1f} minutos")
        print(f"👥 Usuários simultâneos: {result.max_concurrent_users}")
        print(f"📈 Ramp-up: {result.ramp_up_time} minutos")
        
        print(f"\n📊 MÉTRICAS GERAIS:")
        print(f"   Throughput: {result.throughput:.2f} req/s")
        print(f"   Taxa de erro: {result.error_rate:.2f}%")
        print(f"   Sessões completadas: {len(result.user_sessions)}")
        
        if result.response_times:
            print(f"   Tempo de resposta médio: {statistics.mean(result.response_times):.2f}s")
            print(f"   Tempo de resposta mediano: {statistics.median(result.response_times):.2f}s")
            print(f"   Tempo de resposta máximo: {max(result.response_times):.2f}s")
        
        # Análise de degradação
        if result.performance_degradation:
            deg = result.performance_degradation
            print(f"\n📉 DEGRADAÇÃO DE PERFORMANCE:")
            print(f"   Performance inicial: {deg['initial_avg_response_time']:.2f}s")
            print(f"   Performance final: {deg['final_avg_response_time']:.2f}s")
            print(f"   Degradação: {deg['degradation_percent']:+.1f}%")
            print(f"   Tendência: {deg['performance_trend']}")
        
        # Pontos de falha
        if result.failure_points:
            print(f"\n🚨 PONTOS DE FALHA ({len(result.failure_points)}):")
            for fp in result.failure_points[:5]:  # Mostrar apenas os primeiros 5
                print(f"   {fp['type']}: {fp['description']}")
        else:
            print(f"\n✅ NENHUM PONTO DE FALHA CRÍTICO DETECTADO")
        
        # Recursos do sistema
        if result.system_metrics:
            cpu_values = [m.cpu_percent for m in result.system_metrics]
            memory_values = [m.memory_percent for m in result.system_metrics]
            
            print(f"\n💻 RECURSOS DO SISTEMA:")
            print(f"   CPU médio: {statistics.mean(cpu_values):.1f}%")
            print(f"   CPU máximo: {max(cpu_values):.1f}%")
            print(f"   Memória média: {statistics.mean(memory_values):.1f}%")
            print(f"   Memória máxima: {max(memory_values):.1f}%")
        
        # Recomendações
        print(f"\n💡 RECOMENDAÇÕES:")
        for rec in result.recommendations:
            print(f"   {rec}")
        
        print("\n" + "="*70)

async def main():
    """Função principal"""
    tester = StressTester()
    
    # Configuração do teste
    config = {
        'max_users': 20,
        'ramp_up_minutes': 1,
        'test_duration_minutes': 3,
        'think_time_range': (1, 3),
        'request_timeout': 30
    }
    
    try:
        result = await tester.run_stress_test(config)
        tester.save_results(result)
        tester.print_stress_report(result)
        
    except Exception as e:
        print(f"❌ Erro durante teste de stress: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 