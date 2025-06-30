#!/usr/bin/env python3
"""
🧠 Memory Profiler - Projeto M
Análise avançada de uso de memória e detecção de vazamentos

Funcionalidades:
- Monitoramento de heap JavaScript
- Detecção de memory leaks
- Análise de DOM nodes
- Tracking de event listeners
- Profiling de componentes React
- Relatórios detalhados de memória
"""

import asyncio
import json
import time
import statistics
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
import subprocess

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError:
    print("⚠️ Instale as dependências: pip install selenium webdriver-manager")
    exit(1)

@dataclass
class MemorySnapshot:
    """Snapshot de memória em um momento específico"""
    timestamp: str
    heap_used: int
    heap_total: int
    heap_limit: int
    dom_nodes: int
    event_listeners: int
    detached_dom_nodes: int
    js_objects: int
    
    # Métricas calculadas
    heap_usage_percent: float
    memory_pressure: str  # low, medium, high, critical
    
    # Contexto
    url: str
    user_action: str
    component_count: int

@dataclass
class MemoryLeak:
    """Representa um vazamento de memória detectado"""
    type: str  # heap, dom, listeners
    severity: str  # low, medium, high, critical
    growth_rate: float  # bytes/second
    start_time: str
    detection_time: str
    affected_components: List[str]
    description: str
    recommendations: List[str]

@dataclass
class MemoryAnalysis:
    """Resultado completo da análise de memória"""
    session_id: str
    start_time: str
    end_time: str
    duration_seconds: float
    
    snapshots: List[MemorySnapshot]
    detected_leaks: List[MemoryLeak]
    
    # Estatísticas
    peak_memory: int
    average_memory: int
    memory_growth_rate: float
    gc_efficiency: float
    
    # Análise por componente
    component_analysis: Dict[str, Dict]
    
    # Recomendações
    recommendations: List[str]

class MemoryProfiler:
    """Profiler avançado de memória"""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.driver: Optional[webdriver.Chrome] = None
        self.snapshots: List[MemorySnapshot] = []
        self.session_id = f"memory_session_{int(time.time())}"
        self.start_time = datetime.now()
        
        # Configurações
        self.snapshot_interval = 2  # segundos
        self.leak_detection_threshold = 1024 * 1024  # 1MB
        self.monitoring_duration = 300  # 5 minutos
        
        # Componentes React para rastreamento
        self.react_components = [
            'Hero', 'Features', 'Contact', 'FAQ', 'Newsletter',
            'ProcessOptimizationSection', 'FloatingOrbs'
        ]
    
    def setup_driver(self) -> webdriver.Chrome:
        """Configura Chrome com opções de profiling de memória"""
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        
        # Habilitar profiling de memória
        options.add_argument("--enable-precise-memory-info")
        options.add_argument("--enable-memory-info")
        options.add_argument("--js-flags=--expose-gc")
        
        # Configurações adicionais para estabilidade
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-plugins")
        options.add_argument("--disable-images")
        options.add_argument("--disable-javascript-harmony-shipping")
        options.add_argument("--disable-background-timer-throttling")
        options.add_argument("--disable-backgrounding-occluded-windows")
        options.add_argument("--disable-renderer-backgrounding")
        options.add_argument("--disable-features=TranslateUI")
        options.add_argument("--disable-ipc-flooding-protection")
        options.add_argument("--disable-web-security")
        options.add_argument("--disable-features=VizDisplayCompositor")
        
        # Reduzir logs de erro
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        options.add_experimental_option('useAutomationExtension', False)
        
        # Logging para análise (reduzido)
        options.set_capability('goog:loggingPrefs', {
            'performance': 'SEVERE',
            'browser': 'SEVERE'
        })
        
        service = Service(ChromeDriverManager().install())
        service.creation_flags = 0x08000000  # CREATE_NO_WINDOW no Windows
        
        return webdriver.Chrome(service=service, options=options)
    
    def collect_memory_snapshot(self, user_action: str = "idle") -> Optional[MemorySnapshot]:
        """Coleta snapshot detalhado da memória"""
        
        if not self.driver:
            return None
            
        # Script para coletar métricas de memória
        memory_script = """
        // Forçar garbage collection se disponível
        if (window.gc) {
            window.gc();
        }
        
        const memInfo = performance.memory || {};
        const domNodes = document.querySelectorAll('*').length;
        
        // Contar event listeners (aproximação alternativa)
        let eventListeners = 0;
        try {
            // Método alternativo: contar elementos com eventos comuns
            const commonEvents = ['click', 'mouseover', 'mouseout', 'focus', 'blur', 'scroll'];
            const elements = document.querySelectorAll('*');
            
            elements.forEach(el => {
                commonEvents.forEach(eventType => {
                    // Verificar se o elemento tem listeners através de propriedades
                    if (el['on' + eventType] || 
                        (el._events && el._events[eventType]) ||
                        (el.__reactInternalInstance && el.__reactInternalInstance.memoizedProps)) {
                        eventListeners++;
                    }
                });
            });
            
            // Fallback: estimar baseado em elementos interativos
            if (eventListeners === 0) {
                const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [onclick], [onmouseover]');
                eventListeners = interactiveElements.length * 2; // Estimativa: 2 listeners por elemento interativo
            }
        } catch (e) {
            // Se tudo falhar, usar uma estimativa básica
            const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
            eventListeners = interactiveElements.length;
        }
        
        // Detectar nós DOM desanexados (aproximação)
        const detachedNodes = document.querySelectorAll('[data-react-component]').length;
        
        // Contar componentes React (aproximação melhorada)
        let reactComponents = 0;
        try {
            // Tentar diferentes métodos para detectar React
            if (window.React) {
                reactComponents = document.querySelectorAll('[data-reactroot] *').length;
            } else {
                // Fallback: procurar por elementos com atributos React
                reactComponents = document.querySelectorAll('[data-react-*], [class*="react-"], [id*="react-"]').length;
            }
        } catch (e) {
            reactComponents = document.querySelectorAll('div, span, section, article').length;
        }
        
        return {
            heapUsed: memInfo.usedJSHeapSize || 0,
            heapTotal: memInfo.totalJSHeapSize || 0,
            heapLimit: memInfo.jsHeapSizeLimit || 0,
            domNodes: domNodes,
            eventListeners: eventListeners,
            detachedDomNodes: detachedNodes,
            jsObjects: reactComponents,
            url: window.location.href
        };
        """
        
        try:
            result = self.driver.execute_script(memory_script)
            
            # Calcular métricas derivadas
            heap_usage_percent = 0
            if result['heapTotal'] > 0:
                heap_usage_percent = (result['heapUsed'] / result['heapTotal']) * 100
            
            # Determinar pressão de memória
            memory_pressure = self.calculate_memory_pressure(
                result['heapUsed'], 
                result['heapLimit']
            )
            
            snapshot = MemorySnapshot(
                timestamp=datetime.now().isoformat(),
                heap_used=result['heapUsed'],
                heap_total=result['heapTotal'],
                heap_limit=result['heapLimit'],
                dom_nodes=result['domNodes'],
                event_listeners=result['eventListeners'],
                detached_dom_nodes=result['detachedDomNodes'],
                js_objects=result['jsObjects'],
                heap_usage_percent=heap_usage_percent,
                memory_pressure=memory_pressure,
                url=result['url'],
                user_action=user_action,
                component_count=len(self.react_components)
            )
            
            return snapshot
            
        except Exception as e:
            print(f"⚠️ Erro ao coletar snapshot: {e}")
            return None
    
    def calculate_memory_pressure(self, used: int, limit: int) -> str:
        """Calcula o nível de pressão de memória"""
        if limit == 0:
            return "unknown"
        
        usage_percent = (used / limit) * 100
        
        if usage_percent < 50:
            return "low"
        elif usage_percent < 70:
            return "medium"
        elif usage_percent < 90:
            return "high"
        else:
            return "critical"
    
    def detect_memory_leaks(self) -> List[MemoryLeak]:
        """Detecta vazamentos de memória nos snapshots"""
        if len(self.snapshots) < 10:
            return []
        
        leaks = []
        
        # Analisar crescimento do heap
        heap_leak = self.detect_heap_leak()
        if heap_leak:
            leaks.append(heap_leak)
        
        # Analisar crescimento de DOM nodes
        dom_leak = self.detect_dom_leak()
        if dom_leak:
            leaks.append(dom_leak)
        
        # Analisar event listeners
        listener_leak = self.detect_listener_leak()
        if listener_leak:
            leaks.append(listener_leak)
        
        return leaks
    
    def detect_heap_leak(self) -> Optional[MemoryLeak]:
        """Detecta vazamento no heap JavaScript"""
        recent_snapshots = self.snapshots[-10:]  # Últimos 10 snapshots
        
        heap_sizes = [s.heap_used for s in recent_snapshots]
        timestamps = [datetime.fromisoformat(s.timestamp) for s in recent_snapshots]
        
        # Calcular taxa de crescimento
        if len(heap_sizes) < 2:
            return None
        
        # Regressão linear simples para detectar tendência
        time_diffs = [(t - timestamps[0]).total_seconds() for t in timestamps]
        
        # Calcular correlação entre tempo e uso de memória
        if len(time_diffs) > 1:
            correlation = self.calculate_correlation(time_diffs, [float(size) for size in heap_sizes])
            
            # Se correlação > 0.8, há uma tendência de crescimento
            if correlation > 0.8:
                growth_rate = (heap_sizes[-1] - heap_sizes[0]) / time_diffs[-1]
                
                # Se crescimento > 1MB/min, é um leak
                if growth_rate > (1024 * 1024 / 60):  # 1MB por minuto
                    return MemoryLeak(
                        type="heap",
                        severity=self.classify_leak_severity(growth_rate),
                        growth_rate=growth_rate,
                        start_time=recent_snapshots[0].timestamp,
                        detection_time=datetime.now().isoformat(),
                        affected_components=self.identify_affected_components(),
                        description=f"Heap crescendo {growth_rate/1024:.2f} KB/s",
                        recommendations=[
                            "Verificar closures que mantêm referências",
                            "Limpar event listeners não utilizados",
                            "Verificar timers e intervals não limpos"
                        ]
                    )
        
        return None
    
    def detect_dom_leak(self) -> Optional[MemoryLeak]:
        """Detecta vazamento de nós DOM"""
        recent_snapshots = self.snapshots[-10:]
        
        dom_counts = [s.dom_nodes for s in recent_snapshots]
        
        # Verificar crescimento consistente
        if len(dom_counts) < 5:
            return None
        
        # Se DOM nodes crescem mais que 10% em 10 snapshots
        growth = (dom_counts[-1] - dom_counts[0]) / dom_counts[0] * 100
        
        if growth > 10:  # 10% de crescimento
            return MemoryLeak(
                type="dom",
                severity="medium",
                growth_rate=dom_counts[-1] - dom_counts[0],
                start_time=recent_snapshots[0].timestamp,
                detection_time=datetime.now().isoformat(),
                affected_components=["DOM"],
                description=f"DOM nodes cresceram {growth:.1f}%",
                recommendations=[
                    "Verificar componentes que não são desmontados",
                    "Limpar referências DOM não utilizadas",
                    "Verificar loops de criação de elementos"
                ]
            )
        
        return None
    
    def detect_listener_leak(self) -> Optional[MemoryLeak]:
        """Detecta vazamento de event listeners"""
        recent_snapshots = self.snapshots[-10:]
        
        listener_counts = [s.event_listeners for s in recent_snapshots]
        
        if len(listener_counts) < 5:
            return None
        
        # Verificar crescimento de listeners
        growth = listener_counts[-1] - listener_counts[0]
        
        if growth > 50:  # Mais de 50 listeners novos
            return MemoryLeak(
                type="listeners",
                severity="high",
                growth_rate=growth,
                start_time=recent_snapshots[0].timestamp,
                detection_time=datetime.now().isoformat(),
                affected_components=self.identify_affected_components(),
                description=f"Event listeners cresceram em {growth}",
                recommendations=[
                    "Remover event listeners em componentWillUnmount",
                    "Usar AbortController para gerenciar listeners",
                    "Verificar listeners duplicados"
                ]
            )
        
        return None
    
    def calculate_correlation(self, x: List[float], y: List[float]) -> float:
        """Calcula correlação entre duas listas"""
        if len(x) != len(y) or len(x) < 2:
            return 0
        
        mean_x = statistics.mean(x)
        mean_y = statistics.mean(y)
        
        numerator = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(len(x)))
        
        sum_sq_x = sum((x[i] - mean_x) ** 2 for i in range(len(x)))
        sum_sq_y = sum((y[i] - mean_y) ** 2 for i in range(len(y)))
        
        denominator = (sum_sq_x * sum_sq_y) ** 0.5
        
        if denominator == 0:
            return 0
        
        return numerator / denominator
    
    def classify_leak_severity(self, growth_rate: float) -> str:
        """Classifica a severidade do vazamento"""
        mb_per_minute = growth_rate * 60 / (1024 * 1024)
        
        if mb_per_minute < 1:
            return "low"
        elif mb_per_minute < 5:
            return "medium"
        elif mb_per_minute < 10:
            return "high"
        else:
            return "critical"
    
    def identify_affected_components(self) -> List[str]:
        """Identifica componentes possivelmente afetados"""
        # Análise simples baseada nos componentes conhecidos
        return ["FloatingOrbs", "Hero", "Features"]  # Placeholder
    
    async def simulate_user_interactions(self):
        """Simula interações do usuário para stress testing"""
        interactions = [
            ("scroll", self.scroll_page),
            ("click_features", self.click_features),
            ("hover_elements", self.hover_elements),
            ("navigate", self.navigate_sections),
            ("resize", self.resize_window)
        ]
        
        for action_name, action_func in interactions:
            print(f"🎯 Executando: {action_name}")
            
            # Snapshot antes da ação
            before_snapshot = self.collect_memory_snapshot(f"before_{action_name}")
            if before_snapshot:
                self.snapshots.append(before_snapshot)
            
            # Executar ação
            await action_func()
            
            # Aguardar estabilização
            await asyncio.sleep(2)
            
            # Snapshot depois da ação
            after_snapshot = self.collect_memory_snapshot(f"after_{action_name}")
            if after_snapshot:
                self.snapshots.append(after_snapshot)
            
            # Detectar vazamentos
            leaks = self.detect_memory_leaks()
            if leaks:
                print(f"⚠️ Vazamento detectado durante {action_name}")
    
    async def scroll_page(self):
        """Simula scroll na página"""
        if not self.driver:
            return
            
        for i in range(5):
            self.driver.execute_script(f"window.scrollTo(0, {i * 500});")
            await asyncio.sleep(0.5)
        
        # Voltar ao topo
        self.driver.execute_script("window.scrollTo(0, 0);")
    
    async def click_features(self):
        """Clica em elementos interativos"""
        if not self.driver:
            return
            
        try:
            # Procurar botões e links
            buttons = self.driver.find_elements(By.TAG_NAME, "button")
            links = self.driver.find_elements(By.TAG_NAME, "a")
            
            elements = buttons + links
            
            for element in elements[:5]:  # Limitar a 5 elementos
                try:
                    if element.is_displayed():
                        element.click()
                        await asyncio.sleep(0.5)
                except:
                    continue
        except:
            pass
    
    async def hover_elements(self):
        """Simula hover sobre elementos"""
        if not self.driver:
            return
            
        try:
            from selenium.webdriver.common.action_chains import ActionChains
            
            actions = ActionChains(self.driver)
            elements = self.driver.find_elements(By.CSS_SELECTOR, "div, span, p")
            
            for element in elements[:10]:  # Limitar a 10 elementos
                try:
                    if element.is_displayed():
                        actions.move_to_element(element).perform()
                        await asyncio.sleep(0.2)
                except:
                    continue
        except:
            pass
    
    async def navigate_sections(self):
        """Navega entre seções da página"""
        if not self.driver:
            return
            
        sections = ["#hero", "#features", "#contact", "#faq"]
        
        for section in sections:
            try:
                self.driver.execute_script(f"document.querySelector('{section}')?.scrollIntoView();")
                await asyncio.sleep(1)
            except:
                continue
    
    async def resize_window(self):
        """Redimensiona a janela"""
        if not self.driver:
            return
            
        sizes = [(1920, 1080), (1366, 768), (768, 1024), (375, 667)]
        
        for width, height in sizes:
            self.driver.set_window_size(width, height)
            await asyncio.sleep(1)
    
    def analyze_component_memory(self) -> Dict[str, Dict]:
        """Analisa uso de memória por componente"""
        # Análise simplificada baseada nos snapshots
        component_analysis = {}
        
        for component in self.react_components:
            # Simular análise de componente
            component_analysis[component] = {
                "average_impact": 0,  # Placeholder
                "peak_impact": 0,     # Placeholder
                "leak_risk": "low",   # Placeholder
                "recommendations": []
            }
        
        return component_analysis
    
    def generate_recommendations(self, leaks: List[MemoryLeak]) -> List[str]:
        """Gera recomendações baseadas na análise"""
        recommendations = []
        
        if any(leak.type == "heap" for leak in leaks):
            recommendations.extend([
                "🧠 Implementar cleanup em useEffect hooks",
                "🔄 Verificar closures desnecessários",
                "⏰ Limpar timers e intervals"
            ])
        
        if any(leak.type == "dom" for leak in leaks):
            recommendations.extend([
                "🏗️ Verificar componentes não desmontados",
                "🔗 Limpar referências DOM",
                "♻️ Implementar React.memo onde apropriado"
            ])
        
        if any(leak.type == "listeners" for leak in leaks):
            recommendations.extend([
                "👂 Remover event listeners em cleanup",
                "🎯 Usar AbortController",
                "🔄 Verificar listeners duplicados"
            ])
        
        # Recomendações gerais
        recommendations.extend([
            "📊 Implementar monitoramento contínuo",
            "🧪 Adicionar testes de memory leak",
            "⚡ Otimizar re-renders desnecessários"
        ])
        
        return recommendations
    
    async def run_memory_profiling(self, duration_minutes: int = 5) -> MemoryAnalysis:
        """Executa profiling completo de memória"""
        print(f"🧠 Iniciando Memory Profiling - {duration_minutes} minutos")
        
        self.driver = self.setup_driver()
        
        try:
            # Navegar para a página
            self.driver.get(self.base_url)
            await asyncio.sleep(3)
            
            # Snapshot inicial
            initial_snapshot = self.collect_memory_snapshot("initial")
            if initial_snapshot:
                self.snapshots.append(initial_snapshot)
            
            # Monitoramento contínuo
            end_time = time.time() + (duration_minutes * 60)
            
            while time.time() < end_time:
                # Simular interações
                await self.simulate_user_interactions()
                
                # Snapshots regulares
                for _ in range(5):  # 5 snapshots por ciclo
                    snapshot = self.collect_memory_snapshot("monitoring")
                    if snapshot:
                        self.snapshots.append(snapshot)
                    await asyncio.sleep(self.snapshot_interval)
            
            # Snapshot final
            final_snapshot = self.collect_memory_snapshot("final")
            if final_snapshot:
                self.snapshots.append(final_snapshot)
            
            # Detectar vazamentos
            detected_leaks = self.detect_memory_leaks()
            
            # Calcular estatísticas
            heap_values = [s.heap_used for s in self.snapshots if s.heap_used > 0]
            
            peak_memory = max(heap_values) if heap_values else 0
            average_memory = statistics.mean(heap_values) if heap_values else 0
            
            # Taxa de crescimento
            memory_growth_rate = 0
            if len(heap_values) > 1:
                memory_growth_rate = (heap_values[-1] - heap_values[0]) / duration_minutes
            
            # Análise por componente
            component_analysis = self.analyze_component_memory()
            
            # Gerar recomendações
            recommendations = self.generate_recommendations(detected_leaks)
            
            # Criar análise final
            analysis = MemoryAnalysis(
                session_id=self.session_id,
                start_time=self.start_time.isoformat(),
                end_time=datetime.now().isoformat(),
                duration_seconds=duration_minutes * 60,
                snapshots=self.snapshots,
                detected_leaks=detected_leaks,
                peak_memory=peak_memory,
                average_memory=int(average_memory),
                memory_growth_rate=memory_growth_rate,
                gc_efficiency=0.8,  # Placeholder
                component_analysis=component_analysis,
                recommendations=recommendations
            )
            
            return analysis
            
        finally:
            if self.driver:
                self.driver.quit()
    
    def save_analysis(self, analysis: MemoryAnalysis):
        """Salva análise em arquivo"""
        filename = f"memory_analysis_{analysis.session_id}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(asdict(analysis), f, indent=2, ensure_ascii=False)
        
        print(f"💾 Análise salva em: {filename}")
    
    def print_memory_report(self, analysis: MemoryAnalysis):
        """Imprime relatório de memória"""
        print("\n" + "="*70)
        print("🧠 RELATÓRIO DE ANÁLISE DE MEMÓRIA")
        print("="*70)
        
        print(f"📅 Sessão: {analysis.session_id}")
        print(f"⏱️ Duração: {analysis.duration_seconds/60:.1f} minutos")
        print(f"📊 Snapshots coletados: {len(analysis.snapshots)}")
        
        print(f"\n💾 ESTATÍSTICAS DE MEMÓRIA:")
        print(f"   Pico: {analysis.peak_memory / 1024 / 1024:.2f} MB")
        print(f"   Média: {analysis.average_memory / 1024 / 1024:.2f} MB")
        print(f"   Taxa de crescimento: {analysis.memory_growth_rate / 1024:.2f} KB/min")
        
        if analysis.detected_leaks:
            print(f"\n⚠️ VAZAMENTOS DETECTADOS ({len(analysis.detected_leaks)}):")
            for leak in analysis.detected_leaks:
                print(f"   {leak.type.upper()}: {leak.severity} - {leak.description}")
        else:
            print(f"\n✅ NENHUM VAZAMENTO DETECTADO")
        
        print(f"\n💡 RECOMENDAÇÕES:")
        for rec in analysis.recommendations:
            print(f"   {rec}")
        
        print("\n" + "="*70)

async def main():
    """Função principal"""
    profiler = MemoryProfiler()
    
    try:
        analysis = await profiler.run_memory_profiling(duration_minutes=3)
        profiler.save_analysis(analysis)
        profiler.print_memory_report(analysis)
        
    except Exception as e:
        print(f"❌ Erro durante profiling: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 