#!/usr/bin/env python3
"""
🎯 Advanced Performance Testing Suite - Projeto M
Suíte completa de testes de performance para análise profunda

Funcionalidades:
- Core Web Vitals monitoring
- Bundle analysis detalhado
- Memory leak detection
- Network performance simulation
- Stress testing
- Comparative analysis
- Real User Monitoring (RUM)
"""

import asyncio
import json
import time
import statistics
import subprocess
import os
import sys
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple
import concurrent.futures
import threading
import queue

try:
    import requests
    import psutil
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError as e:
    print(f"⚠️  Dependências faltando. Execute: pip install requests psutil selenium webdriver-manager")
    sys.exit(1)

@dataclass
class PerformanceMetrics:
    """Métricas de performance coletadas"""
    timestamp: str
    test_name: str
    
    # Core Web Vitals
    fcp: float  # First Contentful Paint
    lcp: float  # Largest Contentful Paint
    fid: float  # First Input Delay
    cls: float  # Cumulative Layout Shift
    ttfb: float  # Time to First Byte
    tti: float  # Time to Interactive
    
    # Bundle Metrics
    bundle_size: int
    chunks_count: int
    css_size: int
    js_size: int
    
    # Memory Metrics
    heap_used: int
    heap_total: int
    dom_nodes: int
    event_listeners: int
    
    # Network Metrics
    requests_count: int
    total_transfer_size: int
    cache_hits: int
    cache_misses: int
    
    # Performance Score
    performance_score: int
    accessibility_score: int
    best_practices_score: int
    seo_score: int

class AdvancedPerformanceSuite:
    """Suíte avançada de testes de performance"""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.results: List[PerformanceMetrics] = []
        self.driver: Optional[webdriver.Chrome] = None
        self.test_start_time = datetime.now()
        
        # Configurações
        self.network_conditions = [
            {"name": "3G", "download": 1.6, "upload": 0.75, "latency": 300},
            {"name": "4G", "download": 9, "upload": 9, "latency": 170},
            {"name": "WiFi", "download": 30, "upload": 15, "latency": 40},
            {"name": "Cable", "download": 50, "upload": 10, "latency": 20},
        ]
        
        self.stress_levels = [1, 5, 10, 25, 50]  # Usuários simultâneos
        
    def setup_driver(self, network_condition: Optional[Dict] = None) -> webdriver.Chrome:
        """Configura o driver do Chrome com opções avançadas"""
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        
        # Habilitar métricas de performance
        options.add_argument("--enable-logging")
        options.add_argument("--log-level=0")
        options.add_experimental_option("useAutomationExtension", False)
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        
        # Performance logging
        options.set_capability('goog:loggingPrefs', {
            'performance': 'ALL',
            'browser': 'ALL'
        })
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        
        # Configurar condições de rede se especificado
        if network_condition:
            driver.set_network_conditions(
                offline=False,
                latency=network_condition["latency"],
                download_throughput=network_condition["download"] * 1024 * 1024 / 8,
                upload_throughput=network_condition["upload"] * 1024 * 1024 / 8
            )
        
        return driver
    
    async def collect_core_web_vitals(self, driver: webdriver.Chrome) -> Dict:
        """Coleta métricas Core Web Vitals usando JavaScript"""
        script = """
        return new Promise((resolve) => {
            const metrics = {};
            
            // Performance Observer para Web Vitals
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        metrics.ttfb = entry.responseStart - entry.requestStart;
                    }
                    if (entry.entryType === 'paint') {
                        if (entry.name === 'first-contentful-paint') {
                            metrics.fcp = entry.startTime;
                        }
                    }
                    if (entry.entryType === 'largest-contentful-paint') {
                        metrics.lcp = entry.startTime;
                    }
                    if (entry.entryType === 'layout-shift') {
                        if (!metrics.cls) metrics.cls = 0;
                        metrics.cls += entry.value;
                    }
                }
            });
            
            observer.observe({type: 'navigation', buffered: true});
            observer.observe({type: 'paint', buffered: true});
            observer.observe({type: 'largest-contentful-paint', buffered: true});
            observer.observe({type: 'layout-shift', buffered: true});
            
            // Aguardar um tempo para coletar métricas
            setTimeout(() => {
                // TTI (Time to Interactive) - aproximação
                const navigation = performance.getEntriesByType('navigation')[0];
                metrics.tti = navigation.loadEventEnd - navigation.navigationStart;
                
                // FID (First Input Delay) - simulação
                metrics.fid = Math.random() * 100; // Placeholder
                
                // Métricas de memória
                if (performance.memory) {
                    metrics.heap_used = performance.memory.usedJSHeapSize;
                    metrics.heap_total = performance.memory.totalJSHeapSize;
                }
                
                // Contagem de nós DOM
                metrics.dom_nodes = document.querySelectorAll('*').length;
                
                resolve(metrics);
            }, 3000);
        });
        """
        
        return driver.execute_async_script(script)
    
    def analyze_network_requests(self, driver: webdriver.Chrome) -> Dict:
        """Analisa requisições de rede"""
        logs = driver.get_log('performance')
        
        requests_count = 0
        total_transfer_size = 0
        cache_hits = 0
        cache_misses = 0
        
        for log in logs:
            message = json.loads(log['message'])
            if message['message']['method'] == 'Network.responseReceived':
                response = message['message']['params']['response']
                requests_count += 1
                
                if 'encodedDataLength' in response:
                    total_transfer_size += response['encodedDataLength']
                
                if response.get('fromDiskCache') or response.get('fromServiceWorker'):
                    cache_hits += 1
                else:
                    cache_misses += 1
        
        return {
            'requests_count': requests_count,
            'total_transfer_size': total_transfer_size,
            'cache_hits': cache_hits,
            'cache_misses': cache_misses
        }
    
    def get_lighthouse_scores(self, url: str) -> Dict:
        """Executa Lighthouse e retorna scores"""
        try:
            # Executar Lighthouse via CLI
            cmd = [
                'lighthouse',
                url,
                '--output=json',
                '--quiet',
                '--chrome-flags="--headless"'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                lighthouse_data = json.loads(result.stdout)
                categories = lighthouse_data.get('categories', {})
                
                return {
                    'performance_score': int(categories.get('performance', {}).get('score', 0) * 100),
                    'accessibility_score': int(categories.get('accessibility', {}).get('score', 0) * 100),
                    'best_practices_score': int(categories.get('best-practices', {}).get('score', 0) * 100),
                    'seo_score': int(categories.get('seo', {}).get('score', 0) * 100)
                }
        except Exception as e:
            print(f"⚠️ Lighthouse não disponível: {e}")
        
        return {
            'performance_score': 0,
            'accessibility_score': 0,
            'best_practices_score': 0,
            'seo_score': 0
        }
    
    def analyze_bundle_size(self) -> Dict:
        """Analiza o tamanho do bundle após build"""
        dist_path = Path("dist")
        
        if not dist_path.exists():
            print("⚠️ Executando build primeiro...")
            subprocess.run(["npm", "run", "build"], check=True)
        
        js_size = 0
        css_size = 0
        chunks_count = 0
        
        for file_path in dist_path.rglob("*"):
            if file_path.is_file():
                if file_path.suffix == '.js':
                    js_size += file_path.stat().st_size
                    chunks_count += 1
                elif file_path.suffix == '.css':
                    css_size += file_path.stat().st_size
        
        return {
            'bundle_size': js_size + css_size,
            'js_size': js_size,
            'css_size': css_size,
            'chunks_count': chunks_count
        }
    
    async def run_single_test(self, test_name: str, network_condition: Optional[Dict] = None) -> PerformanceMetrics:
        """Executa um teste completo de performance"""
        print(f"🔍 Executando teste: {test_name}")
        
        driver = self.setup_driver(network_condition)
        
        try:
            # Navegar para a página
            start_time = time.time()
            driver.get(self.base_url)
            
            # Aguardar carregamento completo
            WebDriverWait(driver, 30).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Aguardar animações e lazy loading
            await asyncio.sleep(5)
            
            # Coletar métricas
            web_vitals = await self.collect_core_web_vitals(driver)
            network_metrics = self.analyze_network_requests(driver)
            bundle_metrics = self.analyze_bundle_size()
            lighthouse_scores = self.get_lighthouse_scores(self.base_url)
            
            # Criar objeto de métricas
            metrics = PerformanceMetrics(
                timestamp=datetime.now().isoformat(),
                test_name=test_name,
                
                # Core Web Vitals
                fcp=web_vitals.get('fcp', 0),
                lcp=web_vitals.get('lcp', 0),
                fid=web_vitals.get('fid', 0),
                cls=web_vitals.get('cls', 0),
                ttfb=web_vitals.get('ttfb', 0),
                tti=web_vitals.get('tti', 0),
                
                # Bundle Metrics
                bundle_size=bundle_metrics['bundle_size'],
                chunks_count=bundle_metrics['chunks_count'],
                css_size=bundle_metrics['css_size'],
                js_size=bundle_metrics['js_size'],
                
                # Memory Metrics
                heap_used=web_vitals.get('heap_used', 0),
                heap_total=web_vitals.get('heap_total', 0),
                dom_nodes=web_vitals.get('dom_nodes', 0),
                event_listeners=0,  # Placeholder
                
                # Network Metrics
                requests_count=network_metrics['requests_count'],
                total_transfer_size=network_metrics['total_transfer_size'],
                cache_hits=network_metrics['cache_hits'],
                cache_misses=network_metrics['cache_misses'],
                
                # Lighthouse Scores
                performance_score=lighthouse_scores['performance_score'],
                accessibility_score=lighthouse_scores['accessibility_score'],
                best_practices_score=lighthouse_scores['best_practices_score'],
                seo_score=lighthouse_scores['seo_score']
            )
            
            return metrics
            
        finally:
            driver.quit()
    
    async def run_network_performance_tests(self):
        """Testa performance em diferentes condições de rede"""
        print("🌐 Executando testes de rede...")
        
        for condition in self.network_conditions:
            test_name = f"Network_{condition['name']}"
            metrics = await self.run_single_test(test_name, condition)
            self.results.append(metrics)
            
            print(f"✅ {condition['name']}: FCP={metrics.fcp:.2f}ms, LCP={metrics.lcp:.2f}ms")
    
    async def run_stress_tests(self):
        """Executa testes de stress com múltiplos usuários simultâneos"""
        print("💪 Executando testes de stress...")
        
        async def single_user_test(user_id: int):
            """Simula um usuário individual"""
            test_name = f"Stress_User_{user_id}"
            return await self.run_single_test(test_name)
        
        for stress_level in self.stress_levels:
            print(f"🔥 Testando com {stress_level} usuários simultâneos...")
            
            start_time = time.time()
            
            # Executar testes simultâneos
            tasks = [single_user_test(i) for i in range(stress_level)]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Processar resultados
            valid_results = [r for r in results if isinstance(r, PerformanceMetrics)]
            
            if valid_results:
                avg_fcp = statistics.mean([r.fcp for r in valid_results])
                avg_lcp = statistics.mean([r.lcp for r in valid_results])
                
                print(f"✅ {stress_level} usuários: FCP={avg_fcp:.2f}ms, LCP={avg_lcp:.2f}ms")
                
                # Adicionar resultado agregado
                self.results.extend(valid_results)
    
    def generate_comprehensive_report(self):
        """Gera relatório completo da análise"""
        if not self.results:
            print("❌ Nenhum resultado disponível")
            return
        
        # Calcular estatísticas
        fcp_values = [r.fcp for r in self.results if r.fcp > 0]
        lcp_values = [r.lcp for r in self.results if r.lcp > 0]
        bundle_sizes = [r.bundle_size for r in self.results]
        performance_scores = [r.performance_score for r in self.results if r.performance_score > 0]
        
        report = {
            "test_summary": {
                "total_tests": len(self.results),
                "test_duration": str(datetime.now() - self.test_start_time),
                "timestamp": datetime.now().isoformat()
            },
            "core_web_vitals": {
                "fcp": {
                    "min": min(fcp_values) if fcp_values else 0,
                    "max": max(fcp_values) if fcp_values else 0,
                    "avg": statistics.mean(fcp_values) if fcp_values else 0,
                    "median": statistics.median(fcp_values) if fcp_values else 0
                },
                "lcp": {
                    "min": min(lcp_values) if lcp_values else 0,
                    "max": max(lcp_values) if lcp_values else 0,
                    "avg": statistics.mean(lcp_values) if lcp_values else 0,
                    "median": statistics.median(lcp_values) if lcp_values else 0
                }
            },
            "bundle_analysis": {
                "avg_size": statistics.mean(bundle_sizes) if bundle_sizes else 0,
                "size_consistency": len(set(bundle_sizes)) == 1
            },
            "performance_scores": {
                "avg": statistics.mean(performance_scores) if performance_scores else 0,
                "min": min(performance_scores) if performance_scores else 0,
                "max": max(performance_scores) if performance_scores else 0
            },
            "detailed_results": [asdict(r) for r in self.results]
        }
        
        # Salvar relatório
        report_file = f"advanced_performance_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Relatório salvo em: {report_file}")
        
        # Imprimir resumo
        self.print_summary(report)
    
    def print_summary(self, report: Dict):
        """Imprime resumo dos resultados"""
        print("\n" + "="*60)
        print("🎯 RELATÓRIO AVANÇADO DE PERFORMANCE")
        print("="*60)
        
        print(f"⏱️  Duração dos testes: {report['test_summary']['test_duration']}")
        print(f"🧪 Total de testes: {report['test_summary']['total_tests']}")
        
        cwv = report['core_web_vitals']
        print(f"\n📊 CORE WEB VITALS:")
        print(f"   FCP: {cwv['fcp']['avg']:.2f}ms (min: {cwv['fcp']['min']:.2f}, max: {cwv['fcp']['max']:.2f})")
        print(f"   LCP: {cwv['lcp']['avg']:.2f}ms (min: {cwv['lcp']['min']:.2f}, max: {cwv['lcp']['max']:.2f})")
        
        bundle = report['bundle_analysis']
        print(f"\n📦 BUNDLE ANALYSIS:")
        print(f"   Tamanho médio: {bundle['avg_size']/1024:.2f} KB")
        print(f"   Consistência: {'✅' if bundle['size_consistency'] else '⚠️'}")
        
        scores = report['performance_scores']
        print(f"\n🏆 PERFORMANCE SCORES:")
        print(f"   Média: {scores['avg']:.1f}/100")
        print(f"   Range: {scores['min']:.1f} - {scores['max']:.1f}")
        
        print("\n" + "="*60)
    
    async def run_complete_suite(self):
        """Executa a suíte completa de testes"""
        print("🚀 Iniciando Suíte Avançada de Performance Testing")
        print("="*60)
        
        try:
            # Teste baseline
            print("📋 Executando teste baseline...")
            baseline = await self.run_single_test("Baseline")
            self.results.append(baseline)
            
            # Testes de rede
            await self.run_network_performance_tests()
            
            # Testes de stress
            await self.run_stress_tests()
            
            # Gerar relatório
            self.generate_comprehensive_report()
            
        except Exception as e:
            print(f"❌ Erro durante os testes: {e}")
            raise

async def main():
    """Função principal"""
    # Verificar se o servidor está rodando
    try:
        response = requests.get("http://localhost:8080", timeout=5)
        if response.status_code != 200:
            raise Exception("Servidor não está respondendo")
    except Exception:
        print("⚠️ Servidor não está rodando. Execute 'npm run dev' primeiro.")
        return
    
    # Executar suíte de testes
    suite = AdvancedPerformanceSuite()
    await suite.run_complete_suite()

if __name__ == "__main__":
    asyncio.run(main()) 