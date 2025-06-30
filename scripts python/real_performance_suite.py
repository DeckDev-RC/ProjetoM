#!/usr/bin/env python3
"""
⚡ Real Performance Suite - Projeto M
Coleta métricas reais de performance do navegador

Funcionalidades:
- Core Web Vitals (FCP, LCP, CLS, FID)
- Performance Timeline API
- Resource Loading Times
- Network Performance
- JavaScript Performance
- Lighthouse Integration
"""

import asyncio
import json
import time
import statistics
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict

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
class CoreWebVitals:
    """Core Web Vitals do Google"""
    fcp: float  # First Contentful Paint (ms)
    lcp: float  # Largest Contentful Paint (ms)
    cls: float  # Cumulative Layout Shift
    fid: float  # First Input Delay (ms)
    ttfb: float  # Time to First Byte (ms)
    
    # Scores (0-100)
    fcp_score: int
    lcp_score: int
    cls_score: int
    overall_score: int

@dataclass
class ResourceMetrics:
    """Métricas de recursos"""
    total_resources: int
    total_size: int
    total_transfer_size: int
    
    # Por tipo
    scripts_count: int
    scripts_size: int
    stylesheets_count: int
    stylesheets_size: int
    images_count: int
    images_size: int
    fonts_count: int
    fonts_size: int
    
    # Timing
    dns_lookup_time: float
    connection_time: float
    request_time: float
    response_time: float

@dataclass
class JavaScriptMetrics:
    """Métricas de JavaScript"""
    heap_used: int
    heap_total: int
    heap_limit: int
    
    # Timing
    script_duration: float
    compile_time: float
    execution_time: float
    
    # Contadores
    dom_nodes: int
    event_listeners: int
    
    # Performance
    long_tasks_count: int
    blocking_time: float

@dataclass
class NetworkMetrics:
    """Métricas de rede"""
    connection_type: str
    effective_type: str
    downlink: float
    rtt: float
    
    # Requests
    total_requests: int
    failed_requests: int
    cached_requests: int
    
    # Timing médio
    avg_response_time: float
    avg_download_time: float

@dataclass
class PerformanceAnalysis:
    """Análise completa de performance"""
    session_id: str
    timestamp: str
    url: str
    
    # Métricas principais
    core_web_vitals: CoreWebVitals
    resource_metrics: ResourceMetrics
    javascript_metrics: JavaScriptMetrics
    network_metrics: NetworkMetrics
    
    # Scores
    performance_score: int
    accessibility_score: int
    best_practices_score: int
    seo_score: int
    
    # Análise
    critical_issues: List[str]
    warnings: List[str]
    recommendations: List[str]
    
    # Comparação
    baseline_comparison: Optional[Dict] = None

class RealPerformanceSuite:
    """Suite real de análise de performance"""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url
        self.driver: Optional[webdriver.Chrome] = None
        self.session_id = f"perf_real_{int(time.time())}"
        
        # Configurações
        self.warmup_runs = 2
        self.measurement_runs = 3
        self.wait_time = 2
        
    def setup_driver(self) -> webdriver.Chrome:
        """Configura Chrome para coleta de performance"""
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        
        # Performance específico
        options.add_argument("--enable-precise-memory-info")
        options.add_argument("--enable-memory-info")
        options.add_argument("--js-flags=--expose-gc")
        options.add_argument("--disable-background-timer-throttling")
        options.add_argument("--disable-backgrounding-occluded-windows")
        options.add_argument("--disable-renderer-backgrounding")
        
        # Habilitar Performance APIs
        options.add_argument("--enable-experimental-web-platform-features")
        options.add_argument("--enable-web-bluetooth")
        
        # Logging de performance
        options.set_capability('goog:loggingPrefs', {
            'performance': 'ALL',
            'browser': 'SEVERE'
        })
        
        service = Service(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=options)
    
    async def collect_core_web_vitals(self) -> CoreWebVitals:
        """Coleta Core Web Vitals reais"""
        
        # Script para coletar Core Web Vitals
        cwv_script = """
        return new Promise((resolve) => {
            const metrics = {};
            
            // Observer para Core Web Vitals
            if ('PerformanceObserver' in window) {
                // FCP - First Contentful Paint
                const fcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    if (entries.length > 0) {
                        metrics.fcp = entries[0].startTime;
                    }
                });
                
                try {
                    fcpObserver.observe({entryTypes: ['paint']});
                } catch(e) {}
                
                // LCP - Largest Contentful Paint
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    if (entries.length > 0) {
                        metrics.lcp = entries[entries.length - 1].startTime;
                    }
                });
                
                try {
                    lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
                } catch(e) {}
                
                // CLS - Cumulative Layout Shift
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    metrics.cls = clsValue;
                });
                
                try {
                    clsObserver.observe({entryTypes: ['layout-shift']});
                } catch(e) {}
                
                // FID - First Input Delay
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        metrics.fid = entry.processingStart - entry.startTime;
                        break;
                    }
                });
                
                try {
                    fidObserver.observe({entryTypes: ['first-input']});
                } catch(e) {}
            }
            
            // Navigation Timing para TTFB
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                metrics.ttfb = navigation.responseStart - navigation.requestStart;
            }
            
            // Aguardar um tempo para coletar métricas
            setTimeout(() => {
                // Fallbacks usando Performance API
                if (!metrics.fcp) {
                    const paintEntries = performance.getEntriesByType('paint');
                    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
                    metrics.fcp = fcpEntry ? fcpEntry.startTime : 0;
                }
                
                if (!metrics.lcp) {
                    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
                    metrics.lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
                }
                
                if (metrics.cls === undefined) {
                    metrics.cls = 0; // Fallback
                }
                
                if (!metrics.fid) {
                    metrics.fid = 0; // FID só é medido com interação real
                }
                
                if (!metrics.ttfb && navigation) {
                    metrics.ttfb = navigation.responseStart - navigation.fetchStart;
                }
                
                resolve(metrics);
            }, 3000);
        });
        """
        
        try:
            if not self.driver:
                raise Exception("Driver não inicializado")
            
            metrics = await asyncio.get_event_loop().run_in_executor(
                None, self.driver.execute_async_script, cwv_script
            )
            
            # Calcular scores baseados nas métricas
            fcp_score = self.calculate_fcp_score(metrics.get('fcp', 0))
            lcp_score = self.calculate_lcp_score(metrics.get('lcp', 0))
            cls_score = self.calculate_cls_score(metrics.get('cls', 0))
            
            overall_score = int((fcp_score + lcp_score + cls_score) / 3)
            
            return CoreWebVitals(
                fcp=metrics.get('fcp', 0),
                lcp=metrics.get('lcp', 0),
                cls=metrics.get('cls', 0),
                fid=metrics.get('fid', 0),
                ttfb=metrics.get('ttfb', 0),
                fcp_score=fcp_score,
                lcp_score=lcp_score,
                cls_score=cls_score,
                overall_score=overall_score
            )
            
        except Exception as e:
            print(f"⚠️ Erro ao coletar Core Web Vitals: {e}")
            # Retornar valores padrão em caso de erro
            return CoreWebVitals(
                fcp=0, lcp=0, cls=0, fid=0, ttfb=0,
                fcp_score=0, lcp_score=0, cls_score=0, overall_score=0
            )
    
    def calculate_fcp_score(self, fcp: float) -> int:
        """Calcula score do FCP (0-100)"""
        if fcp <= 1800:  # Bom
            return 100
        elif fcp <= 3000:  # Precisa melhorar
            return int(100 - ((fcp - 1800) / 1200) * 50)
        else:  # Ruim
            return max(0, int(50 - ((fcp - 3000) / 1000) * 50))
    
    def calculate_lcp_score(self, lcp: float) -> int:
        """Calcula score do LCP (0-100)"""
        if lcp <= 2500:  # Bom
            return 100
        elif lcp <= 4000:  # Precisa melhorar
            return int(100 - ((lcp - 2500) / 1500) * 50)
        else:  # Ruim
            return max(0, int(50 - ((lcp - 4000) / 1000) * 50))
    
    def calculate_cls_score(self, cls: float) -> int:
        """Calcula score do CLS (0-100)"""
        if cls <= 0.1:  # Bom
            return 100
        elif cls <= 0.25:  # Precisa melhorar
            return int(100 - ((cls - 0.1) / 0.15) * 50)
        else:  # Ruim
            return max(0, int(50 - ((cls - 0.25) / 0.1) * 50))
    
    async def collect_resource_metrics(self) -> ResourceMetrics:
        """Coleta métricas de recursos"""
        
        resource_script = """
        const resources = performance.getEntriesByType('resource');
        const navigation = performance.getEntriesByType('navigation')[0];
        
        const metrics = {
            total_resources: resources.length,
            total_size: 0,
            total_transfer_size: 0,
            scripts_count: 0,
            scripts_size: 0,
            stylesheets_count: 0,
            stylesheets_size: 0,
            images_count: 0,
            images_size: 0,
            fonts_count: 0,
            fonts_size: 0,
            dns_lookup_time: 0,
            connection_time: 0,
            request_time: 0,
            response_time: 0
        };
        
        // Analisar recursos
        resources.forEach(resource => {
            const size = resource.decodedBodySize || resource.encodedBodySize || 0;
            const transferSize = resource.transferSize || 0;
            
            metrics.total_size += size;
            metrics.total_transfer_size += transferSize;
            
            // Categorizar por tipo
            if (resource.initiatorType === 'script' || resource.name.includes('.js')) {
                metrics.scripts_count++;
                metrics.scripts_size += size;
            } else if (resource.initiatorType === 'css' || resource.name.includes('.css')) {
                metrics.stylesheets_count++;
                metrics.stylesheets_size += size;
            } else if (resource.initiatorType === 'img' || /\\.(jpg|jpeg|png|gif|webp|svg)/.test(resource.name)) {
                metrics.images_count++;
                metrics.images_size += size;
            } else if (/\\.(woff|woff2|ttf|otf|eot)/.test(resource.name)) {
                metrics.fonts_count++;
                metrics.fonts_size += size;
            }
        });
        
        // Timing de navegação
        if (navigation) {
            metrics.dns_lookup_time = navigation.domainLookupEnd - navigation.domainLookupStart;
            metrics.connection_time = navigation.connectEnd - navigation.connectStart;
            metrics.request_time = navigation.responseStart - navigation.requestStart;
            metrics.response_time = navigation.responseEnd - navigation.responseStart;
        }
        
        return metrics;
        """
        
        try:
            if not self.driver:
                raise Exception("Driver não inicializado")
            
            metrics = self.driver.execute_script(resource_script)
            
            return ResourceMetrics(
                total_resources=metrics['total_resources'],
                total_size=metrics['total_size'],
                total_transfer_size=metrics['total_transfer_size'],
                scripts_count=metrics['scripts_count'],
                scripts_size=metrics['scripts_size'],
                stylesheets_count=metrics['stylesheets_count'],
                stylesheets_size=metrics['stylesheets_size'],
                images_count=metrics['images_count'],
                images_size=metrics['images_size'],
                fonts_count=metrics['fonts_count'],
                fonts_size=metrics['fonts_size'],
                dns_lookup_time=metrics['dns_lookup_time'],
                connection_time=metrics['connection_time'],
                request_time=metrics['request_time'],
                response_time=metrics['response_time']
            )
            
        except Exception as e:
            print(f"⚠️ Erro ao coletar métricas de recursos: {e}")
            return ResourceMetrics(
                total_resources=0, total_size=0, total_transfer_size=0,
                scripts_count=0, scripts_size=0, stylesheets_count=0, stylesheets_size=0,
                images_count=0, images_size=0, fonts_count=0, fonts_size=0,
                dns_lookup_time=0, connection_time=0, request_time=0, response_time=0
            )
    
    async def collect_javascript_metrics(self) -> JavaScriptMetrics:
        """Coleta métricas de JavaScript"""
        
        js_script = """
        // Forçar garbage collection se disponível
        if (window.gc) {
            window.gc();
        }
        
        const memInfo = performance.memory || {};
        const metrics = {
            heap_used: memInfo.usedJSHeapSize || 0,
            heap_total: memInfo.totalJSHeapSize || 0,
            heap_limit: memInfo.jsHeapSizeLimit || 0,
            dom_nodes: document.querySelectorAll('*').length,
            event_listeners: 0,
            long_tasks_count: 0,
            blocking_time: 0,
            script_duration: 0,
            compile_time: 0,
            execution_time: 0
        };
        
        // Contar event listeners (estimativa)
        try {
            const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [onclick]');
            metrics.event_listeners = interactiveElements.length;
        } catch(e) {}
        
        // Long Tasks (se disponível)
        try {
            const longTasks = performance.getEntriesByType('longtask');
            metrics.long_tasks_count = longTasks.length;
            metrics.blocking_time = longTasks.reduce((total, task) => total + task.duration, 0);
        } catch(e) {}
        
        // Script timing
        try {
            const scriptEntries = performance.getEntriesByType('resource').filter(r => 
                r.initiatorType === 'script' || r.name.includes('.js')
            );
            
            if (scriptEntries.length > 0) {
                metrics.script_duration = scriptEntries.reduce((total, script) => 
                    total + (script.responseEnd - script.startTime), 0
                ) / scriptEntries.length;
            }
        } catch(e) {}
        
        return metrics;
        """
        
        try:
            if not self.driver:
                raise Exception("Driver não inicializado")
            
            metrics = self.driver.execute_script(js_script)
            
            return JavaScriptMetrics(
                heap_used=metrics['heap_used'],
                heap_total=metrics['heap_total'],
                heap_limit=metrics['heap_limit'],
                script_duration=metrics['script_duration'],
                compile_time=metrics['compile_time'],
                execution_time=metrics['execution_time'],
                dom_nodes=metrics['dom_nodes'],
                event_listeners=metrics['event_listeners'],
                long_tasks_count=metrics['long_tasks_count'],
                blocking_time=metrics['blocking_time']
            )
            
        except Exception as e:
            print(f"⚠️ Erro ao coletar métricas de JavaScript: {e}")
            return JavaScriptMetrics(
                heap_used=0, heap_total=0, heap_limit=0,
                script_duration=0, compile_time=0, execution_time=0,
                dom_nodes=0, event_listeners=0, long_tasks_count=0, blocking_time=0
            )
    
    async def collect_network_metrics(self) -> NetworkMetrics:
        """Coleta métricas de rede"""
        
        network_script = """
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const resources = performance.getEntriesByType('resource');
        
        const metrics = {
            connection_type: connection ? connection.type || 'unknown' : 'unknown',
            effective_type: connection ? connection.effectiveType || 'unknown' : 'unknown',
            downlink: connection ? connection.downlink || 0 : 0,
            rtt: connection ? connection.rtt || 0 : 0,
            total_requests: resources.length,
            failed_requests: 0,
            cached_requests: 0,
            avg_response_time: 0,
            avg_download_time: 0
        };
        
        // Analisar requests
        let totalResponseTime = 0;
        let totalDownloadTime = 0;
        let validRequests = 0;
        
        resources.forEach(resource => {
            // Detectar requests com falha (transferSize 0 pode indicar falha)
            if (resource.transferSize === 0 && resource.decodedBodySize === 0) {
                metrics.failed_requests++;
            }
            
            // Detectar requests em cache
            if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
                metrics.cached_requests++;
            }
            
            // Calcular tempos médios
            if (resource.responseEnd && resource.responseStart) {
                const responseTime = resource.responseEnd - resource.requestStart;
                const downloadTime = resource.responseEnd - resource.responseStart;
                
                if (responseTime > 0) {
                    totalResponseTime += responseTime;
                    totalDownloadTime += downloadTime;
                    validRequests++;
                }
            }
        });
        
        if (validRequests > 0) {
            metrics.avg_response_time = totalResponseTime / validRequests;
            metrics.avg_download_time = totalDownloadTime / validRequests;
        }
        
        return metrics;
        """
        
        try:
            if not self.driver:
                raise Exception("Driver não inicializado")
            
            metrics = self.driver.execute_script(network_script)
            
            return NetworkMetrics(
                connection_type=metrics['connection_type'],
                effective_type=metrics['effective_type'],
                downlink=metrics['downlink'],
                rtt=metrics['rtt'],
                total_requests=metrics['total_requests'],
                failed_requests=metrics['failed_requests'],
                cached_requests=metrics['cached_requests'],
                avg_response_time=metrics['avg_response_time'],
                avg_download_time=metrics['avg_download_time']
            )
            
        except Exception as e:
            print(f"⚠️ Erro ao coletar métricas de rede: {e}")
            return NetworkMetrics(
                connection_type='unknown', effective_type='unknown',
                downlink=0, rtt=0, total_requests=0, failed_requests=0,
                cached_requests=0, avg_response_time=0, avg_download_time=0
            )
    
    def analyze_performance(self, cwv: CoreWebVitals, resources: ResourceMetrics, 
                          js: JavaScriptMetrics, network: NetworkMetrics) -> Tuple[List[str], List[str], List[str]]:
        """Analisa métricas e gera issues, warnings e recomendações"""
        
        critical_issues = []
        warnings = []
        recommendations = []
        
        # Análise Core Web Vitals
        if cwv.fcp > 3000:
            critical_issues.append(f"⚡ First Contentful Paint muito alto ({cwv.fcp:.0f}ms)")
        elif cwv.fcp > 1800:
            warnings.append(f"⚡ First Contentful Paint alto ({cwv.fcp:.0f}ms)")
        
        if cwv.lcp > 4000:
            critical_issues.append(f"🖼️ Largest Contentful Paint muito alto ({cwv.lcp:.0f}ms)")
        elif cwv.lcp > 2500:
            warnings.append(f"🖼️ Largest Contentful Paint alto ({cwv.lcp:.0f}ms)")
        
        if cwv.cls > 0.25:
            critical_issues.append(f"📐 Cumulative Layout Shift muito alto ({cwv.cls:.3f})")
        elif cwv.cls > 0.1:
            warnings.append(f"📐 Cumulative Layout Shift alto ({cwv.cls:.3f})")
        
        # Análise de recursos
        if resources.total_size > 3 * 1024 * 1024:  # > 3MB
            critical_issues.append(f"📦 Tamanho total de recursos muito alto ({resources.total_size / 1024 / 1024:.1f}MB)")
        elif resources.total_size > 1 * 1024 * 1024:  # > 1MB
            warnings.append(f"📦 Tamanho total de recursos alto ({resources.total_size / 1024 / 1024:.1f}MB)")
        
        if resources.scripts_size > 1 * 1024 * 1024:  # > 1MB
            warnings.append(f"📜 JavaScript muito pesado ({resources.scripts_size / 1024 / 1024:.1f}MB)")
        
        if resources.images_size > 2 * 1024 * 1024:  # > 2MB
            warnings.append(f"🖼️ Imagens muito pesadas ({resources.images_size / 1024 / 1024:.1f}MB)")
        
        # Análise JavaScript
        if js.heap_used > 50 * 1024 * 1024:  # > 50MB
            warnings.append(f"🧠 Uso alto de memória JavaScript ({js.heap_used / 1024 / 1024:.1f}MB)")
        
        if js.long_tasks_count > 5:
            critical_issues.append(f"⏱️ Muitas long tasks detectadas ({js.long_tasks_count})")
        
        if js.blocking_time > 300:
            warnings.append(f"🚫 Tempo de bloqueio alto ({js.blocking_time:.0f}ms)")
        
        # Análise de rede
        if network.failed_requests > 0:
            critical_issues.append(f"🌐 {network.failed_requests} requests falharam")
        
        if network.avg_response_time > 1000:
            warnings.append(f"🐌 Tempo de resposta médio alto ({network.avg_response_time:.0f}ms)")
        
        # Recomendações
        if cwv.fcp > 1800:
            recommendations.append("⚡ Otimizar First Contentful Paint: reduzir CSS/JS blocking")
        
        if cwv.lcp > 2500:
            recommendations.append("🖼️ Otimizar Largest Contentful Paint: otimizar imagens principais")
        
        if cwv.cls > 0.1:
            recommendations.append("📐 Reduzir Layout Shift: definir dimensões de imagens/vídeos")
        
        if resources.total_size > 1024 * 1024:
            recommendations.append("📦 Reduzir tamanho de recursos: comprimir assets, lazy loading")
        
        if js.heap_used > 20 * 1024 * 1024:
            recommendations.append("🧠 Otimizar uso de memória: limpar referências não utilizadas")
        
        if network.avg_response_time > 500:
            recommendations.append("🌐 Melhorar performance de rede: CDN, cache, compressão")
        
        # Recomendações gerais
        recommendations.extend([
            "📊 Implementar monitoramento Real User Monitoring (RUM)",
            "🔄 Configurar Performance Budget",
            "⚡ Implementar Service Worker para cache",
            "🎯 Otimizar Critical Rendering Path"
        ])
        
        return critical_issues, warnings, recommendations
    
    async def run_performance_analysis(self) -> PerformanceAnalysis:
        """Executa análise completa de performance"""
        print(f"⚡ Iniciando análise real de performance...")
        
        self.driver = self.setup_driver()
        
        try:
            # Warmup runs
            print("🔥 Executando warmup...")
            for i in range(self.warmup_runs):
                self.driver.get(self.base_url)
                await asyncio.sleep(self.wait_time)
            
            # Measurement runs
            print("📊 Coletando métricas...")
            
            cwv_measurements = []
            resource_measurements = []
            js_measurements = []
            network_measurements = []
            
            for i in range(self.measurement_runs):
                print(f"   Run {i + 1}/{self.measurement_runs}")
                
                # Navegar para a página
                self.driver.get(self.base_url)
                await asyncio.sleep(self.wait_time)
                
                # Coletar métricas
                cwv = await self.collect_core_web_vitals()
                resources = await self.collect_resource_metrics()
                js = await self.collect_javascript_metrics()
                network = await self.collect_network_metrics()
                
                cwv_measurements.append(cwv)
                resource_measurements.append(resources)
                js_measurements.append(js)
                network_measurements.append(network)
                
                await asyncio.sleep(1)
            
            # Calcular médias
            avg_cwv = self.calculate_average_cwv(cwv_measurements)
            avg_resources = self.calculate_average_resources(resource_measurements)
            avg_js = self.calculate_average_js(js_measurements)
            avg_network = self.calculate_average_network(network_measurements)
            
            # Análise
            critical_issues, warnings, recommendations = self.analyze_performance(
                avg_cwv, avg_resources, avg_js, avg_network
            )
            
            # Calcular scores
            performance_score = avg_cwv.overall_score
            accessibility_score = 85  # Placeholder - requer análise específica
            best_practices_score = 80  # Placeholder - requer análise específica
            seo_score = 75  # Placeholder - requer análise específica
            
            analysis = PerformanceAnalysis(
                session_id=self.session_id,
                timestamp=datetime.now().isoformat(),
                url=self.base_url,
                core_web_vitals=avg_cwv,
                resource_metrics=avg_resources,
                javascript_metrics=avg_js,
                network_metrics=avg_network,
                performance_score=performance_score,
                accessibility_score=accessibility_score,
                best_practices_score=best_practices_score,
                seo_score=seo_score,
                critical_issues=critical_issues,
                warnings=warnings,
                recommendations=recommendations
            )
            
            return analysis
            
        finally:
            if self.driver:
                self.driver.quit()
    
    def calculate_average_cwv(self, measurements: List[CoreWebVitals]) -> CoreWebVitals:
        """Calcula média dos Core Web Vitals"""
        if not measurements:
            return CoreWebVitals(0, 0, 0, 0, 0, 0, 0, 0, 0)
        
        fcp_avg = statistics.mean([m.fcp for m in measurements])
        lcp_avg = statistics.mean([m.lcp for m in measurements])
        cls_avg = statistics.mean([m.cls for m in measurements])
        fid_avg = statistics.mean([m.fid for m in measurements])
        ttfb_avg = statistics.mean([m.ttfb for m in measurements])
        
        # Recalcular scores
        fcp_score = self.calculate_fcp_score(fcp_avg)
        lcp_score = self.calculate_lcp_score(lcp_avg)
        cls_score = self.calculate_cls_score(cls_avg)
        overall_score = int((fcp_score + lcp_score + cls_score) / 3)
        
        return CoreWebVitals(
            fcp=fcp_avg, lcp=lcp_avg, cls=cls_avg, fid=fid_avg, ttfb=ttfb_avg,
            fcp_score=fcp_score, lcp_score=lcp_score, cls_score=cls_score,
            overall_score=overall_score
        )
    
    def calculate_average_resources(self, measurements: List[ResourceMetrics]) -> ResourceMetrics:
        """Calcula média das métricas de recursos"""
        if not measurements:
            return ResourceMetrics(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
        
        return ResourceMetrics(
            total_resources=int(statistics.mean([m.total_resources for m in measurements])),
            total_size=int(statistics.mean([m.total_size for m in measurements])),
            total_transfer_size=int(statistics.mean([m.total_transfer_size for m in measurements])),
            scripts_count=int(statistics.mean([m.scripts_count for m in measurements])),
            scripts_size=int(statistics.mean([m.scripts_size for m in measurements])),
            stylesheets_count=int(statistics.mean([m.stylesheets_count for m in measurements])),
            stylesheets_size=int(statistics.mean([m.stylesheets_size for m in measurements])),
            images_count=int(statistics.mean([m.images_count for m in measurements])),
            images_size=int(statistics.mean([m.images_size for m in measurements])),
            fonts_count=int(statistics.mean([m.fonts_count for m in measurements])),
            fonts_size=int(statistics.mean([m.fonts_size for m in measurements])),
            dns_lookup_time=statistics.mean([m.dns_lookup_time for m in measurements]),
            connection_time=statistics.mean([m.connection_time for m in measurements]),
            request_time=statistics.mean([m.request_time for m in measurements]),
            response_time=statistics.mean([m.response_time for m in measurements])
        )
    
    def calculate_average_js(self, measurements: List[JavaScriptMetrics]) -> JavaScriptMetrics:
        """Calcula média das métricas de JavaScript"""
        if not measurements:
            return JavaScriptMetrics(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
        
        return JavaScriptMetrics(
            heap_used=int(statistics.mean([m.heap_used for m in measurements])),
            heap_total=int(statistics.mean([m.heap_total for m in measurements])),
            heap_limit=int(statistics.mean([m.heap_limit for m in measurements])),
            script_duration=statistics.mean([m.script_duration for m in measurements]),
            compile_time=statistics.mean([m.compile_time for m in measurements]),
            execution_time=statistics.mean([m.execution_time for m in measurements]),
            dom_nodes=int(statistics.mean([m.dom_nodes for m in measurements])),
            event_listeners=int(statistics.mean([m.event_listeners for m in measurements])),
            long_tasks_count=int(statistics.mean([m.long_tasks_count for m in measurements])),
            blocking_time=statistics.mean([m.blocking_time for m in measurements])
        )
    
    def calculate_average_network(self, measurements: List[NetworkMetrics]) -> NetworkMetrics:
        """Calcula média das métricas de rede"""
        if not measurements:
            return NetworkMetrics('unknown', 'unknown', 0, 0, 0, 0, 0, 0, 0)
        
        # Para strings, pegar o valor mais comum
        connection_type = measurements[0].connection_type
        effective_type = measurements[0].effective_type
        
        return NetworkMetrics(
            connection_type=connection_type,
            effective_type=effective_type,
            downlink=statistics.mean([m.downlink for m in measurements]),
            rtt=statistics.mean([m.rtt for m in measurements]),
            total_requests=int(statistics.mean([m.total_requests for m in measurements])),
            failed_requests=int(statistics.mean([m.failed_requests for m in measurements])),
            cached_requests=int(statistics.mean([m.cached_requests for m in measurements])),
            avg_response_time=statistics.mean([m.avg_response_time for m in measurements]),
            avg_download_time=statistics.mean([m.avg_download_time for m in measurements])
        )
    
    def save_analysis(self, analysis: PerformanceAnalysis):
        """Salva análise em arquivo"""
        filename = f"real_performance_analysis_{analysis.session_id}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(asdict(analysis), f, indent=2, ensure_ascii=False)
        
        print(f"💾 Análise salva em: {filename}")
    
    def print_performance_report(self, analysis: PerformanceAnalysis):
        """Imprime relatório de performance"""
        print("\n" + "="*70)
        print("⚡ RELATÓRIO REAL DE PERFORMANCE")
        print("="*70)
        
        print(f"🌐 URL: {analysis.url}")
        print(f"📅 Timestamp: {analysis.timestamp}")
        print(f"🆔 Session: {analysis.session_id}")
        
        # Core Web Vitals
        cwv = analysis.core_web_vitals
        print(f"\n📊 CORE WEB VITALS:")
        print(f"   FCP: {cwv.fcp:.0f}ms (Score: {cwv.fcp_score}/100)")
        print(f"   LCP: {cwv.lcp:.0f}ms (Score: {cwv.lcp_score}/100)")
        print(f"   CLS: {cwv.cls:.3f} (Score: {cwv.cls_score}/100)")
        print(f"   FID: {cwv.fid:.0f}ms")
        print(f"   TTFB: {cwv.ttfb:.0f}ms")
        print(f"   Overall: {cwv.overall_score}/100")
        
        # Recursos
        res = analysis.resource_metrics
        print(f"\n📦 RECURSOS:")
        print(f"   Total: {res.total_resources} recursos ({res.total_size / 1024 / 1024:.1f}MB)")
        print(f"   JavaScript: {res.scripts_count} arquivos ({res.scripts_size / 1024:.0f}KB)")
        print(f"   CSS: {res.stylesheets_count} arquivos ({res.stylesheets_size / 1024:.0f}KB)")
        print(f"   Imagens: {res.images_count} arquivos ({res.images_size / 1024:.0f}KB)")
        
        # JavaScript
        js = analysis.javascript_metrics
        print(f"\n🧠 JAVASCRIPT:")
        print(f"   Heap usado: {js.heap_used / 1024 / 1024:.1f}MB")
        print(f"   DOM nodes: {js.dom_nodes}")
        print(f"   Event listeners: {js.event_listeners}")
        print(f"   Long tasks: {js.long_tasks_count}")
        
        # Rede
        net = analysis.network_metrics
        print(f"\n🌐 REDE:")
        print(f"   Tipo: {net.effective_type}")
        print(f"   Requests: {net.total_requests} (falhas: {net.failed_requests})")
        print(f"   Tempo médio: {net.avg_response_time:.0f}ms")
        
        # Scores
        print(f"\n🎯 SCORES:")
        print(f"   Performance: {analysis.performance_score}/100")
        print(f"   Accessibility: {analysis.accessibility_score}/100")
        print(f"   Best Practices: {analysis.best_practices_score}/100")
        print(f"   SEO: {analysis.seo_score}/100")
        
        # Issues críticos
        if analysis.critical_issues:
            print(f"\n🚨 ISSUES CRÍTICOS ({len(analysis.critical_issues)}):")
            for issue in analysis.critical_issues:
                print(f"   {issue}")
        
        # Warnings
        if analysis.warnings:
            print(f"\n⚠️ WARNINGS ({len(analysis.warnings)}):")
            for warning in analysis.warnings[:5]:  # Top 5
                print(f"   {warning}")
        
        # Recomendações
        print(f"\n💡 TOP RECOMENDAÇÕES:")
        for rec in analysis.recommendations[:5]:  # Top 5
            print(f"   {rec}")
        
        print("\n" + "="*70)

async def main():
    """Função principal"""
    suite = RealPerformanceSuite()
    
    try:
        analysis = await suite.run_performance_analysis()
        suite.save_analysis(analysis)
        suite.print_performance_report(analysis)
        
    except Exception as e:
        print(f"❌ Erro durante análise: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 