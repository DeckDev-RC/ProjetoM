#!/usr/bin/env python3
"""
🚀 Quick Start - Performance Testing Suite
Execute este script para rodar um teste rápido
"""

import asyncio
import sys
from pathlib import Path

async def quick_test():
    print("🎯 Executando teste rápido da suíte de performance...")
    
    try:
        # Testar Bundle Analyzer
        print("📦 Testando Bundle Analyzer...")
        try:
            from bundle_analyzer import BundleAnalyzer
            analyzer = BundleAnalyzer()
            print("✅ Bundle Analyzer carregado")
        except ImportError:
            print("⚠️ Bundle Analyzer não encontrado (normal se não executou ainda)")
        
        # Testar Memory Profiler
        print("🧠 Testando Memory Profiler...")
        try:
            from memory_profiler import MemoryProfiler
            profiler = MemoryProfiler("http://localhost:8080")
            print("✅ Memory Profiler carregado")
        except ImportError:
            print("⚠️ Memory Profiler não encontrado (normal se não executou ainda)")
        
        # Testar Stress Tester
        print("💪 Testando Stress Tester...")
        try:
            from stress_tester import StressTester
            tester = StressTester("http://localhost:8080")
            print("✅ Stress Tester carregado")
        except ImportError:
            print("⚠️ Stress Tester não encontrado (normal se não executou ainda)")
        
        # Testar dependências básicas
        print("\n🔧 Testando dependências básicas...")
        
        import selenium
        print("✅ Selenium instalado")
        
        import aiohttp
        print("✅ aiohttp instalado")
        
        import psutil
        print("✅ psutil instalado")
        
        import requests
        print("✅ requests instalado")
        
        # Testar Selenium básico
        print("\n🚗 Testando Selenium...")
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service
        from webdriver_manager.chrome import ChromeDriverManager
        
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )
        driver.get("data:text/html,<html><body><h1>Test</h1></body></html>")
        title = driver.title
        driver.quit()
        print("✅ Selenium funcionando corretamente")
        
        print("\n🎉 TESTE RÁPIDO CONCLUÍDO!")
        print("✅ Todas as dependências estão funcionando")
        print("\n📋 PRÓXIMOS PASSOS:")
        print("1. Certifique-se de que o projeto está rodando: npm run dev")
        print("2. Execute a suíte completa: python master_performance_suite.py")
        print("3. Ou use os scripts batch: run_suite.bat")
        
    except Exception as e:
        print(f"❌ Erro durante teste rápido: {e}")
        print("Execute o instalador novamente: python install_windows.py")

if __name__ == "__main__":
    asyncio.run(quick_test()) 