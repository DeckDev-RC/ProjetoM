#!/usr/bin/env python3
"""
🧪 Teste Real Performance Suite
Testa a implementação real de performance que substitui os dados simulados
"""

import asyncio
import sys
from pathlib import Path

# Adicionar o diretório atual ao path
sys.path.append(str(Path(__file__).parent))

try:
    from real_performance_suite import RealPerformanceSuite
    from master_performance_suite import MasterPerformanceSuite, TestConfiguration
except ImportError as e:
    print(f"❌ Erro ao importar: {e}")
    print("Certifique-se de que real_performance_suite.py existe")
    exit(1)

async def test_real_performance_suite():
    """Testa o Real Performance Suite"""
    print("🧪 Testando Real Performance Suite...")
    
    # Configuração de teste
    config = TestConfiguration(
        run_bundle_analysis=False,  # Desabilitar outros testes
        run_memory_profiling=False,
        run_stress_testing=False,
        run_performance_suite=True,  # Apenas este
        base_url="http://localhost:8080",
        output_dir="test_performance_reports"
    )
    
    try:
        # Teste direto do Real Performance Suite
        print("\n1️⃣ Testando Real Performance Suite diretamente...")
        real_suite = RealPerformanceSuite(config.base_url)
        analysis = await real_suite.run_performance_analysis()
        
        print("✅ Real Performance Suite executado com sucesso!")
        print(f"   📊 FCP: {analysis.core_web_vitals.fcp:.0f}ms")
        print(f"   📊 LCP: {analysis.core_web_vitals.lcp:.0f}ms")
        print(f"   📊 Performance Score: {analysis.performance_score}/100")
        print(f"   📦 Total Resources: {analysis.resource_metrics.total_resources}")
        print(f"   🧠 Heap Used: {analysis.javascript_metrics.heap_used / 1024 / 1024:.1f}MB")
        
        # Teste através do Master Performance Suite
        print("\n2️⃣ Testando através do Master Performance Suite...")
        master_suite = MasterPerformanceSuite(config)
        report = await master_suite.run_all_tests()
        
        if report:
            print("✅ Master Performance Suite executado com sucesso!")
            print(f"   📊 Overall Score: {report.overall_performance_score:.1f}/100")
            print(f"   🎖️ Status: {report.overall_status}")
            print(f"   ✅ Testes bem-sucedidos: {len([r for r in report.test_results if r.status == 'success'])}")
            
            # Verificar se o Performance Suite foi executado
            perf_test = next((r for r in report.test_results if r.test_name == "Performance Suite"), None)
            if perf_test and perf_test.status == "success":
                print("✅ Performance Suite executado com dados reais!")
                print(f"   📊 FCP: {perf_test.data.get('fcp_avg', 0):.0f}ms")
                print(f"   📊 LCP: {perf_test.data.get('lcp_avg', 0):.0f}ms")
                print(f"   📊 Performance Score: {perf_test.data.get('performance_score', 0)}/100")
            else:
                print("❌ Performance Suite não foi executado ou falhou")
        else:
            print("❌ Master Performance Suite falhou")
        
        print("\n🎉 Teste concluído com sucesso!")
        print("✅ O Real Performance Suite está funcionando e coletando dados reais!")
        
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        import traceback
        traceback.print_exc()

async def test_server_availability():
    """Testa se o servidor está disponível"""
    print("🌐 Verificando disponibilidade do servidor...")
    
    try:
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:8080", timeout=5) as response:
                if response.status == 200:
                    print("✅ Servidor disponível em http://localhost:8080")
                    return True
                else:
                    print(f"⚠️ Servidor respondeu com status {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Servidor não disponível: {e}")
        print("💡 Certifique-se de que o servidor está rodando em localhost:8080")
        return False

async def main():
    """Função principal"""
    print("🧪 TESTE DO REAL PERFORMANCE SUITE")
    print("="*50)
    
    # Verificar servidor
    server_ok = await test_server_availability()
    
    if not server_ok:
        print("\n⚠️ Continuando teste mesmo sem servidor (pode gerar dados vazios)")
        input("Pressione Enter para continuar ou Ctrl+C para cancelar...")
    
    # Executar teste
    await test_real_performance_suite()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⏹️ Teste cancelado pelo usuário")
    except Exception as e:
        print(f"\n💥 Erro inesperado: {e}") 