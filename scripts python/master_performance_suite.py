#!/usr/bin/env python3
"""
🎯 Master Performance Suite - Projeto M
Orquestrador principal de todos os testes de performance

Funcionalidades:
- Execução coordenada de todos os testes
- Relatórios consolidados
- Comparação histórica
- Alertas automáticos
- Dashboard integration
- CI/CD integration
"""

import asyncio
import json
import os
import sys
import time
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import argparse

# Importar outros módulos da suíte
try:
    from bundle_analyzer import BundleAnalyzer
    from memory_profiler import MemoryProfiler
    from stress_tester import StressTester
    from real_performance_suite import RealPerformanceSuite
except ImportError as e:
    print(f"⚠️ Erro ao importar módulos: {e}")
    print("Certifique-se de que todos os scripts estão no mesmo diretório")

@dataclass
class TestConfiguration:
    """Configuração dos testes"""
    # Testes a executar
    run_bundle_analysis: bool = True
    run_memory_profiling: bool = True
    run_stress_testing: bool = True
    run_performance_suite: bool = True
    
    # Configurações específicas
    memory_duration_minutes: int = 3
    stress_max_users: int = 20
    stress_duration_minutes: int = 3
    performance_network_tests: bool = True
    
    # Configurações gerais
    base_url: str = "http://localhost:8080"
    output_dir: str = "performance_reports"
    generate_dashboard: bool = True
    send_alerts: bool = False

@dataclass
class TestResult:
    """Resultado de um teste individual"""
    test_name: str
    status: str  # success, failed, skipped
    start_time: str
    end_time: str
    duration_seconds: float
    data: Optional[Dict] = None
    error_message: Optional[str] = None

@dataclass
class ConsolidatedReport:
    """Relatório consolidado de todos os testes"""
    session_id: str
    timestamp: str
    configuration: TestConfiguration
    
    # Resultados dos testes
    test_results: List[TestResult]
    
    # Métricas consolidadas
    overall_performance_score: float
    critical_issues: List[str]
    warnings: List[str]
    recommendations: List[str]
    
    # Status geral
    overall_status: str  # excellent, good, warning, critical
    
    # Comparação histórica
    historical_comparison: Optional[Dict] = None

class MasterPerformanceSuite:
    """Suíte principal de performance testing"""
    
    def __init__(self, config: TestConfiguration):
        self.config = config
        self.session_id = f"perf_suite_{int(time.time())}"
        self.test_results: List[TestResult] = []
        self.start_time = datetime.now()
        
        # Criar diretório de output
        self.output_dir = Path(config.output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        print(f"🎯 Master Performance Suite iniciada")
        print(f"📁 Relatórios serão salvos em: {self.output_dir}")
        print(f"🆔 Session ID: {self.session_id}")
    
    async def run_all_tests(self) -> Optional[ConsolidatedReport]:
        """Executa todos os testes configurados"""
        print("\n" + "="*70)
        print("🚀 INICIANDO SUÍTE COMPLETA DE PERFORMANCE")
        print("="*70)
        
        # Verificar se o servidor está rodando
        if not await self.check_server():
            print("❌ Servidor não está rodando. Execute 'npm run dev' primeiro.")
            return None
        
        # Executar testes na ordem otimizada
        test_sequence = [
            ("Bundle Analysis", self.run_bundle_analysis),
            ("Memory Profiling", self.run_memory_profiling),
            ("Performance Suite", self.run_performance_suite),
            ("Stress Testing", self.run_stress_testing)
        ]
        
        for test_name, test_func in test_sequence:
            if self.should_run_test(test_name):
                await self.execute_test(test_name, test_func)
            else:
                self.add_skipped_test(test_name)
        
        # Gerar relatório consolidado
        report = await self.generate_consolidated_report()
        
        # Salvar resultados
        await self.save_results(report)
        
        # Gerar dashboard se configurado
        if self.config.generate_dashboard:
            await self.generate_dashboard(report)
        
        # Enviar alertas se configurado
        if self.config.send_alerts:
            await self.send_alerts(report)
        
        # Imprimir resumo final
        self.print_final_summary(report)
        
        return report
    
    async def check_server(self) -> bool:
        """Verifica se o servidor está rodando"""
        try:
            import aiohttp
            timeout = aiohttp.ClientTimeout(total=5)
            async with aiohttp.ClientSession() as session:
                async with session.get(self.config.base_url, timeout=timeout) as response:
                    return response.status == 200
        except:
            return False
    
    def should_run_test(self, test_name: str) -> bool:
        """Verifica se um teste deve ser executado"""
        test_map = {
            "Bundle Analysis": self.config.run_bundle_analysis,
            "Memory Profiling": self.config.run_memory_profiling,
            "Performance Suite": self.config.run_performance_suite,
            "Stress Testing": self.config.run_stress_testing
        }
        return test_map.get(test_name, False)
    
    async def execute_test(self, test_name: str, test_func):
        """Executa um teste individual com tratamento de erro"""
        print(f"\n🔍 Iniciando: {test_name}")
        start_time = datetime.now()
        
        try:
            # Executar teste com timeout
            result_data = await asyncio.wait_for(test_func(), timeout=600)  # 10 minutos timeout
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            test_result = TestResult(
                test_name=test_name,
                status="success",
                start_time=start_time.isoformat(),
                end_time=end_time.isoformat(),
                duration_seconds=duration,
                data=result_data
            )
            
            self.test_results.append(test_result)
            print(f"✅ {test_name} concluído em {duration:.1f}s")
            
        except asyncio.TimeoutError:
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            test_result = TestResult(
                test_name=test_name,
                status="failed",
                start_time=start_time.isoformat(),
                end_time=end_time.isoformat(),
                duration_seconds=duration,
                error_message=f"Timeout após {duration:.1f}s"
            )
            
            self.test_results.append(test_result)
            print(f"⏰ {test_name} timeout após {duration:.1f}s")
            
        except asyncio.CancelledError:
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            test_result = TestResult(
                test_name=test_name,
                status="cancelled",
                start_time=start_time.isoformat(),
                end_time=end_time.isoformat(),
                duration_seconds=duration,
                error_message="Teste cancelado pelo usuário"
            )
            
            self.test_results.append(test_result)
            print(f"⏹️ {test_name} cancelado após {duration:.1f}s")
            raise  # Re-raise para interromper a suíte
            
        except Exception as e:
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            test_result = TestResult(
                test_name=test_name,
                status="failed",
                start_time=start_time.isoformat(),
                end_time=end_time.isoformat(),
                duration_seconds=duration,
                error_message=str(e)
            )
            
            self.test_results.append(test_result)
            print(f"❌ {test_name} falhou: {e}")
            
            # Se for um erro crítico, interromper a suíte
            if "selenium" in str(e).lower() or "webdriver" in str(e).lower():
                print("🚨 Erro crítico de WebDriver detectado. Interrompendo suíte.")
                raise
    
    def add_skipped_test(self, test_name: str):
        """Adiciona um teste como pulado"""
        test_result = TestResult(
            test_name=test_name,
            status="skipped",
            start_time=datetime.now().isoformat(),
            end_time=datetime.now().isoformat(),
            duration_seconds=0
        )
        self.test_results.append(test_result)
        print(f"⏭️ {test_name} pulado")
    
    async def run_bundle_analysis(self) -> Dict:
        """Executa análise do bundle"""
        analyzer = BundleAnalyzer()
        analysis = analyzer.analyze()
        
        return {
            "total_size": analysis.total_size,
            "gzipped_size": analysis.total_gzipped_size,
            "chunks_count": analysis.chunks_count,
            "optimization_suggestions": analysis.optimization_suggestions,
            "performance_impact": analysis.performance_impact
        }
    
    async def run_memory_profiling(self) -> Dict:
        """Executa profiling de memória"""
        profiler = MemoryProfiler(self.config.base_url)
        analysis = await profiler.run_memory_profiling(self.config.memory_duration_minutes)
        
        return {
            "peak_memory": analysis.peak_memory,
            "average_memory": analysis.average_memory,
            "memory_growth_rate": analysis.memory_growth_rate,
            "detected_leaks": len(analysis.detected_leaks),
            "recommendations": analysis.recommendations
        }
    
    async def run_performance_suite(self) -> Dict:
        """Executa suíte real de performance"""
        print("⚡ Executando Real Performance Suite...")
        
        real_suite = RealPerformanceSuite(self.config.base_url)
        analysis = await real_suite.run_performance_analysis()
        
        return {
            "fcp_avg": analysis.core_web_vitals.fcp,
            "lcp_avg": analysis.core_web_vitals.lcp,
            "cls_avg": analysis.core_web_vitals.cls,
            "fid_avg": analysis.core_web_vitals.fid,
            "ttfb_avg": analysis.core_web_vitals.ttfb,
            "performance_score": analysis.performance_score,
            "accessibility_score": analysis.accessibility_score,
            "best_practices_score": analysis.best_practices_score,
            "seo_score": analysis.seo_score,
            "total_resources": analysis.resource_metrics.total_resources,
            "total_size_mb": analysis.resource_metrics.total_size / 1024 / 1024,
            "scripts_size_kb": analysis.resource_metrics.scripts_size / 1024,
            "images_size_kb": analysis.resource_metrics.images_size / 1024,
            "heap_used_mb": analysis.javascript_metrics.heap_used / 1024 / 1024,
            "dom_nodes": analysis.javascript_metrics.dom_nodes,
            "long_tasks": analysis.javascript_metrics.long_tasks_count,
            "avg_response_time": analysis.network_metrics.avg_response_time,
            "failed_requests": analysis.network_metrics.failed_requests,
            "critical_issues": len(analysis.critical_issues),
            "warnings": len(analysis.warnings),
            "network_tests_completed": True
        }
    
    async def run_stress_testing(self) -> Dict:
        """Executa testes de stress"""
        tester = StressTester(self.config.base_url)
        
        stress_config = {
            'max_users': self.config.stress_max_users,
            'ramp_up_minutes': 1,
            'test_duration_minutes': self.config.stress_duration_minutes,
            'think_time_range': (1, 3),
            'request_timeout': 30
        }
        
        result = await tester.run_stress_test(stress_config)
        
        return {
            "max_users": result.max_concurrent_users,
            "throughput": result.throughput,
            "error_rate": result.error_rate,
            "avg_response_time": sum(result.response_times) / len(result.response_times) if result.response_times else 0,
            "failure_points": len(result.failure_points)
        }
    
    async def generate_consolidated_report(self) -> ConsolidatedReport:
        """Gera relatório consolidado"""
        print("\n📊 Gerando relatório consolidado...")
        
        # Calcular score geral de performance
        overall_score = self.calculate_overall_score()
        
        # Identificar issues críticos
        critical_issues = self.identify_critical_issues()
        
        # Gerar warnings
        warnings = self.generate_warnings()
        
        # Consolidar recomendações
        recommendations = self.consolidate_recommendations()
        
        # Determinar status geral
        overall_status = self.determine_overall_status(overall_score, critical_issues)
        
        # Comparação histórica
        historical_comparison = await self.load_historical_comparison()
        
        report = ConsolidatedReport(
            session_id=self.session_id,
            timestamp=datetime.now().isoformat(),
            configuration=self.config,
            test_results=self.test_results,
            overall_performance_score=overall_score,
            critical_issues=critical_issues,
            warnings=warnings,
            recommendations=recommendations,
            historical_comparison=historical_comparison,
            overall_status=overall_status
        )
        
        return report
    
    def calculate_overall_score(self) -> float:
        """Calcula score geral de performance"""
        scores = []
        
        for result in self.test_results:
            if result.status == "success" and result.data:
                if result.test_name == "Bundle Analysis":
                    # Score baseado no tamanho do bundle
                    bundle_score = max(0, 100 - (result.data["total_size"] / 1024 / 10))
                    scores.append(bundle_score)
                
                elif result.test_name == "Memory Profiling":
                    # Score baseado no uso de memória
                    memory_score = max(0, 100 - (result.data["average_memory"] * 2))
                    scores.append(memory_score)
                
                elif result.test_name == "Performance Suite":
                    # Score direto do performance suite
                    scores.append(result.data.get("performance_score", 0))
                
                elif result.test_name == "Stress Testing":
                    # Score baseado na taxa de erro
                    stress_score = max(0, 100 - (result.data["error_rate"] * 10))
                    scores.append(stress_score)
        
        return sum(scores) / len(scores) if scores else 0
    
    def identify_critical_issues(self) -> List[str]:
        """Identifica issues críticos"""
        issues = []
        
        for result in self.test_results:
            if result.status == "failed":
                issues.append(f"❌ {result.test_name} falhou: {result.error_message}")
            
            elif result.status == "success" and result.data:
                if result.test_name == "Bundle Analysis":
                    if result.data["total_size"] > 1024 * 1024:  # > 1MB
                        issues.append("📦 Bundle muito grande (>1MB)")
                
                elif result.test_name == "Memory Profiling":
                    if result.data["detected_leaks"] > 0:
                        issues.append(f"🧠 {result.data['detected_leaks']} vazamentos de memória detectados")
                
                elif result.test_name == "Stress Testing":
                    if result.data["error_rate"] > 10:
                        issues.append(f"💪 Taxa de erro alta no stress test ({result.data['error_rate']:.1f}%)")
        
        return issues
    
    def generate_warnings(self) -> List[str]:
        """Gera warnings baseados nos resultados"""
        warnings = []
        
        for result in self.test_results:
            if result.status == "success" and result.data:
                if result.test_name == "Bundle Analysis":
                    if result.data["total_size"] > 500 * 1024:  # > 500KB
                        warnings.append("📦 Bundle grande (>500KB) - considere otimizações")
                
                elif result.test_name == "Memory Profiling":
                    if result.data["memory_growth_rate"] > 1024 * 1024:  # > 1MB/min
                        warnings.append("🧠 Taxa de crescimento de memória alta")
                
                elif result.test_name == "Performance Suite":
                    if result.data["fcp_avg"] > 2000:
                        warnings.append("⚡ First Contentful Paint alto (>2s)")
                
                elif result.test_name == "Stress Testing":
                    if result.data["error_rate"] > 5:
                        warnings.append(f"💪 Taxa de erro moderada ({result.data['error_rate']:.1f}%)")
        
        return warnings
    
    def consolidate_recommendations(self) -> List[str]:
        """Consolida recomendações de todos os testes"""
        recommendations = set()
        
        # Recomendações baseadas nos resultados
        for result in self.test_results:
            if result.status == "success" and result.data:
                if result.test_name == "Bundle Analysis":
                    recommendations.update(result.data.get("optimization_suggestions", []))
                
                elif result.test_name == "Memory Profiling":
                    recommendations.update(result.data.get("recommendations", []))
        
        # Recomendações gerais
        recommendations.add("📊 Implementar monitoramento contínuo de performance")
        recommendations.add("🔄 Executar testes de regressão regularmente")
        recommendations.add("📈 Definir métricas e SLAs baseados nos resultados")
        
        return list(recommendations)
    
    def determine_overall_status(self, score: float, critical_issues: List[str]) -> str:
        """Determina status geral"""
        if critical_issues:
            return "critical"
        elif score >= 85:
            return "excellent"
        elif score >= 70:
            return "good"
        else:
            return "warning"
    
    async def load_historical_comparison(self) -> Optional[Dict]:
        """Carrega dados históricos para comparação"""
        try:
            history_files = list(self.output_dir.glob("consolidated_report_*.json"))
            if not history_files:
                return None
            
            # Pegar o relatório mais recente
            latest_file = sorted(history_files)[-1]
            
            with open(latest_file, 'r', encoding='utf-8') as f:
                previous_data = json.load(f)
            
            return {
                "previous_score": previous_data.get("overall_performance_score", 0),
                "score_change": self.calculate_overall_score() - previous_data.get("overall_performance_score", 0),
                "previous_timestamp": previous_data.get("timestamp", "")
            }
        
        except Exception:
            return None
    
    async def save_results(self, report: ConsolidatedReport):
        """Salva todos os resultados"""
        print("\n💾 Salvando resultados...")
        
        # Salvar relatório consolidado
        consolidated_file = self.output_dir / f"consolidated_report_{self.session_id}.json"
        with open(consolidated_file, 'w', encoding='utf-8') as f:
            json.dump(asdict(report), f, indent=2, ensure_ascii=False)
        
        # Salvar resultados individuais
        for result in self.test_results:
            if result.status == "success" and result.data:
                individual_file = self.output_dir / f"{result.test_name.lower().replace(' ', '_')}_{self.session_id}.json"
                with open(individual_file, 'w', encoding='utf-8') as f:
                    json.dump(result.data, f, indent=2, ensure_ascii=False)
        
        print(f"📁 Resultados salvos em: {self.output_dir}")
    
    async def generate_dashboard(self, report: ConsolidatedReport):
        """Gera dashboard HTML"""
        print("🎨 Gerando dashboard...")
        
        # Copiar template do dashboard
        dashboard_template = Path("performance_dashboard.html")
        dashboard_output = self.output_dir / f"dashboard_{self.session_id}.html"
        
        if dashboard_template.exists():
            import shutil
            shutil.copy(dashboard_template, dashboard_output)
            print(f"📊 Dashboard disponível em: {dashboard_output}")
        else:
            print("⚠️ Template do dashboard não encontrado")
    
    async def send_alerts(self, report: ConsolidatedReport):
        """Envia alertas baseados nos resultados"""
        if report.overall_status in ["critical", "warning"]:
            print(f"🚨 ALERTA: Status {report.overall_status}")
            print(f"📊 Score: {report.overall_performance_score:.1f}")
            
            if report.critical_issues:
                print("❌ Issues críticos:")
                for issue in report.critical_issues:
                    print(f"   {issue}")
    
    def print_final_summary(self, report: ConsolidatedReport):
        """Imprime resumo final"""
        print("\n" + "="*70)
        print("🎯 RESUMO FINAL DA SUÍTE DE PERFORMANCE")
        print("="*70)
        
        print(f"🆔 Session ID: {report.session_id}")
        print(f"⏱️ Duração total: {(datetime.now() - self.start_time).total_seconds():.1f}s")
        print(f"📊 Score geral: {report.overall_performance_score:.1f}/100")
        print(f"🎖️ Status: {report.overall_status.upper()}")
        
        # Resumo dos testes
        successful_tests = [r for r in report.test_results if r.status == "success"]
        failed_tests = [r for r in report.test_results if r.status == "failed"]
        skipped_tests = [r for r in report.test_results if r.status == "skipped"]
        
        print(f"\n📋 TESTES EXECUTADOS:")
        print(f"   ✅ Sucessos: {len(successful_tests)}")
        print(f"   ❌ Falhas: {len(failed_tests)}")
        print(f"   ⏭️ Pulados: {len(skipped_tests)}")
        
        # Issues críticos
        if report.critical_issues:
            print(f"\n🚨 ISSUES CRÍTICOS ({len(report.critical_issues)}):")
            for issue in report.critical_issues:
                print(f"   {issue}")
        
        # Warnings
        if report.warnings:
            print(f"\n⚠️ WARNINGS ({len(report.warnings)}):")
            for warning in report.warnings[:3]:  # Mostrar apenas os primeiros 3
                print(f"   {warning}")
        
        # Comparação histórica
        if report.historical_comparison:
            change = report.historical_comparison["score_change"]
            print(f"\n📈 COMPARAÇÃO HISTÓRICA:")
            print(f"   Score anterior: {report.historical_comparison['previous_score']:.1f}")
            print(f"   Mudança: {change:+.1f} pontos")
        
        # Top recomendações
        print(f"\n💡 TOP RECOMENDAÇÕES:")
        for rec in report.recommendations[:3]:
            print(f"   {rec}")
        
        print("\n" + "="*70)
        
        # Status final
        status_emoji = {
            "excellent": "🏆",
            "good": "✅",
            "warning": "⚠️",
            "critical": "🚨"
        }
        
        print(f"{status_emoji.get(report.overall_status, '❓')} STATUS FINAL: {report.overall_status.upper()}")
        print("="*70)

def create_default_config() -> TestConfiguration:
    """Cria configuração padrão"""
    return TestConfiguration(
        run_bundle_analysis=True,
        run_memory_profiling=True,
        run_stress_testing=True,
        run_performance_suite=True,  # Agora habilitado com implementação real
        memory_duration_minutes=2,
        stress_max_users=15,
        stress_duration_minutes=2,
        performance_network_tests=True,
        base_url="http://localhost:8080",
        output_dir="performance_reports",
        generate_dashboard=True,
        send_alerts=True
    )

def parse_arguments():
    """Parse argumentos da linha de comando"""
    parser = argparse.ArgumentParser(description="Master Performance Suite - Projeto M")
    
    parser.add_argument("--url", default="http://localhost:8080", help="URL base para testes")
    parser.add_argument("--output", default="performance_reports", help="Diretório de output")
    parser.add_argument("--memory-duration", type=int, default=2, help="Duração do memory profiling (minutos)")
    parser.add_argument("--stress-users", type=int, default=15, help="Número máximo de usuários no stress test")
    parser.add_argument("--stress-duration", type=int, default=2, help="Duração do stress test (minutos)")
    
    # Flags para habilitar/desabilitar testes
    parser.add_argument("--no-bundle", action="store_true", help="Pular bundle analysis")
    parser.add_argument("--no-memory", action="store_true", help="Pular memory profiling")
    parser.add_argument("--no-stress", action="store_true", help="Pular stress testing")
    parser.add_argument("--no-dashboard", action="store_true", help="Não gerar dashboard")
    parser.add_argument("--no-alerts", action="store_true", help="Não enviar alertas")
    
    return parser.parse_args()

async def main():
    """Função principal"""
    args = parse_arguments()
    
    # Criar configuração baseada nos argumentos
    config = TestConfiguration(
        run_bundle_analysis=not args.no_bundle,
        run_memory_profiling=not args.no_memory,
        run_stress_testing=not args.no_stress,
        run_performance_suite=True,  # Sempre habilitado agora
        memory_duration_minutes=args.memory_duration,
        stress_max_users=args.stress_users,
        stress_duration_minutes=args.stress_duration,
        base_url=args.url,
        output_dir=args.output,
        generate_dashboard=not args.no_dashboard,
        send_alerts=not args.no_alerts
    )
    
    # Executar suíte
    suite = MasterPerformanceSuite(config)
    
    try:
        report = await suite.run_all_tests()
        
        if report:
            print(f"\n🎉 Suíte completa! Verifique os resultados em: {config.output_dir}")
            return 0 if report.overall_status in ["excellent", "good"] else 1
        else:
            print("\n❌ Falha na execução da suíte")
            return 1
            
    except KeyboardInterrupt:
        print("\n⏹️ Suíte interrompida pelo usuário")
        
        # Tentar gerar relatório parcial se possível
        if suite.test_results:
            try:
                print("📊 Gerando relatório parcial...")
                partial_report = await suite.generate_consolidated_report()
                await suite.save_results(partial_report)
                print(f"💾 Relatório parcial salvo em: {config.output_dir}")
            except Exception as e:
                print(f"⚠️ Erro ao salvar relatório parcial: {e}")
        
        return 130
        
    except asyncio.CancelledError:
        print("\n⏹️ Suíte cancelada")
        
        # Tentar gerar relatório parcial se possível
        if suite.test_results:
            try:
                print("📊 Gerando relatório parcial...")
                partial_report = await suite.generate_consolidated_report()
                await suite.save_results(partial_report)
                print(f"💾 Relatório parcial salvo em: {config.output_dir}")
            except Exception as e:
                print(f"⚠️ Erro ao salvar relatório parcial: {e}")
        
        return 130
        
    except Exception as e:
        print(f"\n💥 Erro inesperado: {e}")
        
        # Tentar gerar relatório de erro se possível
        if suite.test_results:
            try:
                print("📊 Gerando relatório de erro...")
                error_report = await suite.generate_consolidated_report()
                await suite.save_results(error_report)
                print(f"💾 Relatório de erro salvo em: {config.output_dir}")
            except Exception as save_error:
                print(f"⚠️ Erro ao salvar relatório de erro: {save_error}")
        
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main()) 