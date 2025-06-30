#!/usr/bin/env python3
"""
📚 Exemplo de Uso - Suíte de Performance Testing
Demonstra como usar cada ferramenta da suíte de forma prática

Este script mostra exemplos reais de como executar cada teste
e interpretar os resultados.
"""

import asyncio
import json
import time
from pathlib import Path
from datetime import datetime

# Importar ferramentas da suíte
from bundle_analyzer import BundleAnalyzer
from memory_profiler import MemoryProfiler
from stress_tester import StressTester
from master_performance_suite import MasterPerformanceSuite, TestConfiguration

class PerformanceTestingExample:
    """Classe de exemplo para demonstrar uso da suíte"""
    
    def __init__(self):
        self.base_url = "http://localhost:8080"
        self.results = {}
    
    def print_section(self, title: str):
        """Imprime cabeçalho de seção"""
        print("\n" + "="*60)
        print(f"🎯 {title}")
        print("="*60)
    
    def example_bundle_analysis(self):
        """Exemplo: Análise do Bundle"""
        self.print_section("EXEMPLO 1: Bundle Analysis")
        
        print("📦 Analisando o bundle de produção...")
        print("Comando: python bundle_analyzer.py")
        print()
        
        try:
            # Criar analisador
            analyzer = BundleAnalyzer()
            
            # Executar análise
            analysis = analyzer.analyze()
            
            # Mostrar resultados principais
            print("✅ Análise concluída!")
            print(f"📊 Total de arquivos: {len(analysis.files)}")
            print(f"💾 Tamanho total: {analysis.total_size / 1024:.2f} KB")
            print(f"🗜️ Comprimido: {analysis.total_gzipped_size / 1024:.2f} KB")
            print(f"📦 Chunks: {analysis.chunks_count}")
            
            # Sugestões de otimização
            if analysis.optimization_suggestions:
                print("\n💡 Principais sugestões:")
                for suggestion in analysis.optimization_suggestions[:3]:
                    print(f"   • {suggestion}")
            
            # Salvar resultado
            self.results['bundle'] = {
                'total_size': analysis.total_size,
                'chunks': analysis.chunks_count,
                'suggestions': len(analysis.optimization_suggestions)
            }
            
        except Exception as e:
            print(f"❌ Erro na análise do bundle: {e}")
    
    async def example_memory_profiling(self):
        """Exemplo: Memory Profiling"""
        self.print_section("EXEMPLO 2: Memory Profiling")
        
        print("🧠 Executando profiling de memória...")
        print("Comando: python memory_profiler.py")
        print("⏱️ Duração: 2 minutos (reduzido para exemplo)")
        print()
        
        try:
            # Criar profiler
            profiler = MemoryProfiler(self.base_url)
            
            # Executar profiling (duração reduzida para exemplo)
            analysis = await profiler.run_memory_profiling(duration_minutes=2)
            
            # Mostrar resultados
            print("✅ Profiling concluído!")
            print(f"📊 Snapshots coletados: {len(analysis.snapshots)}")
            print(f"💾 Pico de memória: {analysis.peak_memory / 1024 / 1024:.2f} MB")
            print(f"📈 Média de memória: {analysis.average_memory / 1024 / 1024:.2f} MB")
            print(f"🔍 Vazamentos detectados: {len(analysis.detected_leaks)}")
            
            # Alertas de vazamento
            if analysis.detected_leaks:
                print("\n⚠️ Vazamentos detectados:")
                for leak in analysis.detected_leaks:
                    print(f"   • {leak.type}: {leak.description}")
            else:
                print("\n✅ Nenhum vazamento detectado!")
            
            # Salvar resultado
            self.results['memory'] = {
                'peak_memory_mb': analysis.peak_memory / 1024 / 1024,
                'leaks_detected': len(analysis.detected_leaks),
                'snapshots': len(analysis.snapshots)
            }
            
        except Exception as e:
            print(f"❌ Erro no memory profiling: {e}")
    
    async def example_stress_testing(self):
        """Exemplo: Stress Testing"""
        self.print_section("EXEMPLO 3: Stress Testing")
        
        print("💪 Executando teste de stress...")
        print("Comando: python stress_tester.py")
        print("👥 Usuários: 15 (reduzido para exemplo)")
        print("⏱️ Duração: 2 minutos")
        print()
        
        try:
            # Criar tester
            tester = StressTester(self.base_url)
            
            # Configuração reduzida para exemplo
            config = {
                'max_users': 15,
                'ramp_up_minutes': 1,
                'test_duration_minutes': 2,
                'think_time_range': (1, 3),
                'request_timeout': 30
            }
            
            # Executar teste
            result = await tester.run_stress_test(config)
            
            # Mostrar resultados
            print("✅ Stress test concluído!")
            print(f"👥 Usuários simultâneos: {result.max_concurrent_users}")
            print(f"🚀 Throughput: {result.throughput:.2f} req/s")
            print(f"❌ Taxa de erro: {result.error_rate:.2f}%")
            
            if result.response_times:
                avg_response = sum(result.response_times) / len(result.response_times)
                print(f"⏱️ Tempo de resposta médio: {avg_response:.2f}s")
            
            # Alertas de problemas
            if result.failure_points:
                print(f"\n⚠️ Pontos de falha detectados: {len(result.failure_points)}")
                for fp in result.failure_points[:2]:
                    print(f"   • {fp['description']}")
            else:
                print("\n✅ Nenhum ponto de falha crítico!")
            
            # Salvar resultado
            self.results['stress'] = {
                'throughput': result.throughput,
                'error_rate': result.error_rate,
                'failure_points': len(result.failure_points)
            }
            
        except Exception as e:
            print(f"❌ Erro no stress testing: {e}")
    
    async def example_master_suite(self):
        """Exemplo: Master Performance Suite"""
        self.print_section("EXEMPLO 4: Master Performance Suite")
        
        print("🎯 Executando suíte completa...")
        print("Comando: python master_performance_suite.py")
        print("📋 Todos os testes integrados")
        print()
        
        try:
            # Configuração customizada
            config = TestConfiguration(
                run_bundle_analysis=True,
                run_memory_profiling=True,
                run_stress_testing=True,
                run_performance_suite=False,  # Desabilitado para exemplo
                memory_duration_minutes=1,    # Reduzido
                stress_max_users=10,          # Reduzido
                stress_duration_minutes=1,    # Reduzido
                base_url=self.base_url,
                output_dir="example_reports",
                generate_dashboard=True,
                send_alerts=False
            )
            
            # Executar suíte
            suite = MasterPerformanceSuite(config)
            report = await suite.run_all_tests()
            
            if report:
                print("✅ Suíte completa concluída!")
                print(f"📊 Score geral: {report.overall_performance_score:.1f}/100")
                print(f"🎖️ Status: {report.overall_status.upper()}")
                print(f"🧪 Testes executados: {len(report.test_results)}")
                
                # Issues críticos
                if report.critical_issues:
                    print(f"\n🚨 Issues críticos: {len(report.critical_issues)}")
                    for issue in report.critical_issues[:2]:
                        print(f"   • {issue}")
                
                # Top recomendações
                if report.recommendations:
                    print(f"\n💡 Top recomendações:")
                    for rec in report.recommendations[:3]:
                        print(f"   • {rec}")
                
                # Salvar resultado
                self.results['master_suite'] = {
                    'overall_score': report.overall_performance_score,
                    'status': report.overall_status,
                    'critical_issues': len(report.critical_issues)
                }
            
        except Exception as e:
            print(f"❌ Erro na master suite: {e}")
    
    def example_interpreting_results(self):
        """Exemplo: Como interpretar os resultados"""
        self.print_section("EXEMPLO 5: Interpretando Resultados")
        
        print("📊 Como interpretar os resultados dos testes:")
        print()
        
        # Bundle Analysis
        if 'bundle' in self.results:
            bundle = self.results['bundle']
            print("📦 BUNDLE ANALYSIS:")
            
            size_kb = bundle['total_size'] / 1024
            if size_kb < 200:
                status = "✅ Excelente"
            elif size_kb < 500:
                status = "⚠️ Aceitável"
            else:
                status = "🚨 Precisa otimização"
            
            print(f"   Tamanho: {size_kb:.1f} KB - {status}")
            print(f"   Chunks: {bundle['chunks']} - {'✅ Bem dividido' if bundle['chunks'] > 5 else '⚠️ Considere mais divisões'}")
            print(f"   Sugestões: {bundle['suggestions']} - {'🎯 Revisar' if bundle['suggestions'] > 0 else '✅ Otimizado'}")
        
        # Memory Profiling
        if 'memory' in self.results:
            memory = self.results['memory']
            print("\n🧠 MEMORY PROFILING:")
            
            if memory['peak_memory_mb'] < 20:
                memory_status = "✅ Normal"
            elif memory['peak_memory_mb'] < 50:
                memory_status = "⚠️ Moderado"
            else:
                memory_status = "🚨 Alto"
            
            print(f"   Pico de memória: {memory['peak_memory_mb']:.1f} MB - {memory_status}")
            print(f"   Vazamentos: {memory['leaks_detected']} - {'🚨 Investigar' if memory['leaks_detected'] > 0 else '✅ Limpo'}")
            print(f"   Snapshots: {memory['snapshots']} - {'📊 Dados suficientes' if memory['snapshots'] > 10 else '⚠️ Poucos dados'}")
        
        # Stress Testing
        if 'stress' in self.results:
            stress = self.results['stress']
            print("\n💪 STRESS TESTING:")
            
            if stress['throughput'] > 10:
                throughput_status = "✅ Excelente"
            elif stress['throughput'] > 5:
                throughput_status = "⚠️ Adequado"
            else:
                throughput_status = "🚨 Baixo"
            
            print(f"   Throughput: {stress['throughput']:.1f} req/s - {throughput_status}")
            print(f"   Taxa de erro: {stress['error_rate']:.1f}% - {'🚨 Alta' if stress['error_rate'] > 5 else '✅ Aceitável'}")
            print(f"   Pontos de falha: {stress['failure_points']} - {'⚠️ Investigar' if stress['failure_points'] > 0 else '✅ Estável'}")
        
        # Master Suite
        if 'master_suite' in self.results:
            master = self.results['master_suite']
            print("\n🎯 MASTER SUITE:")
            
            score = master['overall_score']
            if score >= 85:
                score_status = "🏆 Excelente"
            elif score >= 70:
                score_status = "✅ Bom"
            elif score >= 50:
                score_status = "⚠️ Precisa melhoria"
            else:
                score_status = "🚨 Crítico"
            
            print(f"   Score geral: {score:.1f}/100 - {score_status}")
            print(f"   Status: {master['status'].upper()}")
            print(f"   Issues críticos: {master['critical_issues']}")
    
    def example_best_practices(self):
        """Exemplo: Melhores práticas"""
        self.print_section("EXEMPLO 6: Melhores Práticas")
        
        print("🎯 Melhores práticas para testes de performance:")
        print()
        
        print("📋 FREQUÊNCIA DE TESTES:")
        print("   • Bundle Analysis: A cada build")
        print("   • Memory Profiling: Semanalmente")
        print("   • Stress Testing: Antes de releases")
        print("   • Master Suite: Mensalmente")
        print()
        
        print("⚙️ CONFIGURAÇÕES RECOMENDADAS:")
        print("   • Desenvolvimento: Testes rápidos (1-2 min)")
        print("   • Staging: Testes médios (5-10 min)")
        print("   • Produção: Testes completos (15-30 min)")
        print()
        
        print("🎯 MÉTRICAS IMPORTANTES:")
        print("   • Performance Score: > 80")
        print("   • Bundle Size: < 500KB")
        print("   • Memory Usage: < 50MB")
        print("   • Error Rate: < 5%")
        print()
        
        print("🚨 ALERTAS CRÍTICOS:")
        print("   • Performance Score < 50")
        print("   • Bundle Size > 1MB")
        print("   • Memory Leaks detectados")
        print("   • Error Rate > 10%")
    
    def save_example_results(self):
        """Salva resultados do exemplo"""
        results_file = Path("example_results.json")
        
        example_data = {
            "timestamp": datetime.now().isoformat(),
            "example_session": True,
            "results": self.results,
            "summary": {
                "tests_executed": len(self.results),
                "overall_health": "good" if len(self.results) >= 3 else "partial"
            }
        }
        
        with open(results_file, 'w', encoding='utf-8') as f:
            json.dump(example_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Resultados do exemplo salvos em: {results_file}")

async def main():
    """Função principal do exemplo"""
    print("🎯 EXEMPLO DE USO - SUÍTE DE PERFORMANCE TESTING")
    print("=" * 60)
    print("Este exemplo demonstra como usar cada ferramenta da suíte")
    print("⚠️ Certifique-se de que o servidor está rodando: npm run dev")
    print()
    
    # Verificar se deve continuar
    try:
        import aiohttp
        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:8080", timeout=timeout) as response:
                if response.status != 200:
                    raise Exception("Servidor não responde")
    except:
        print("❌ Servidor não está rodando em http://localhost:8080")
        print("Execute 'npm run dev' em outro terminal e tente novamente")
        return
    
    # Executar exemplos
    example = PerformanceTestingExample()
    
    try:
        # Exemplo 1: Bundle Analysis
        example.example_bundle_analysis()
        await asyncio.sleep(2)
        
        # Exemplo 2: Memory Profiling
        await example.example_memory_profiling()
        await asyncio.sleep(2)
        
        # Exemplo 3: Stress Testing
        await example.example_stress_testing()
        await asyncio.sleep(2)
        
        # Exemplo 4: Master Suite (comentado para não demorar muito)
        # await example.example_master_suite()
        
        # Exemplo 5: Interpretação de resultados
        example.example_interpreting_results()
        
        # Exemplo 6: Melhores práticas
        example.example_best_practices()
        
        # Salvar resultados
        example.save_example_results()
        
        print("\n🎉 EXEMPLO CONCLUÍDO!")
        print("✅ Todos os exemplos foram executados com sucesso")
        print("📚 Consulte o README_PERFORMANCE_TESTING.md para mais detalhes")
        
    except KeyboardInterrupt:
        print("\n⏹️ Exemplo interrompido pelo usuário")
    except Exception as e:
        print(f"\n💥 Erro durante execução do exemplo: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 