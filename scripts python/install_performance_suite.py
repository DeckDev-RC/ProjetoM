#!/usr/bin/env python3
"""
🚀 Instalador Automático - Suíte de Performance Testing
Instala e configura automaticamente todas as dependências necessárias

Funcionalidades:
- Verificação de pré-requisitos
- Instalação de dependências Python
- Configuração do ambiente
- Verificação da instalação
- Testes básicos
"""

import os
import sys
import subprocess
import platform
import shutil
from pathlib import Path
import json
import urllib.request

class PerformanceSuiteInstaller:
    """Instalador automático da suíte de performance"""
    
    def __init__(self):
        self.system = platform.system().lower()
        self.python_version = sys.version_info
        self.requirements_installed = False
        self.chrome_available = False
        self.node_available = False
        
    def print_header(self):
        """Imprime cabeçalho do instalador"""
        print("🚀 INSTALADOR AUTOMÁTICO - SUÍTE DE PERFORMANCE TESTING")
        print("=" * 60)
        print("Este script irá instalar e configurar todas as dependências")
        print("necessárias para executar os testes de performance.")
        print()
    
    def check_prerequisites(self):
        """Verifica pré-requisitos do sistema"""
        print("🔍 Verificando pré-requisitos...")
        
        # Verificar Python
        if self.python_version < (3, 8):
            print(f"❌ Python {self.python_version.major}.{self.python_version.minor} detectado")
            print("⚠️ Python 3.8+ é necessário")
            return False
        else:
            print(f"✅ Python {self.python_version.major}.{self.python_version.minor} OK")
        
        # Verificar pip
        try:
            import pip
            print("✅ pip disponível")
        except ImportError:
            print("❌ pip não encontrado")
            return False
        
        # Verificar Node.js
        try:
            result = subprocess.run(['node', '--version'], capture_output=True, text=True, shell=True)
            if result.returncode == 0:
                node_version = result.stdout.strip()
                print(f"✅ Node.js {node_version} disponível")
                self.node_available = True
            else:
                print("⚠️ Node.js não encontrado (necessário para o projeto)")
        except FileNotFoundError:
            print("⚠️ Node.js não encontrado (necessário para o projeto)")
        
        # Verificar npm
        try:
            result = subprocess.run(['npm', '--version'], capture_output=True, text=True, shell=True)
            if result.returncode == 0:
                npm_version = result.stdout.strip()
                print(f"✅ npm {npm_version} disponível")
            else:
                print("⚠️ npm não encontrado")
        except FileNotFoundError:
            print("⚠️ npm não encontrado")
        
        # Verificar Chrome/Chromium
        chrome_paths = {
            'linux': [
                '/usr/bin/google-chrome',
                '/usr/bin/chromium-browser',
                '/usr/bin/chromium'
            ],
            'darwin': [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Chromium.app/Contents/MacOS/Chromium'
            ],
            'windows': [
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            ]
        }
        
        chrome_found = False
        for path in chrome_paths.get(self.system, []):
            if os.path.exists(path):
                print(f"✅ Chrome/Chromium encontrado: {path}")
                chrome_found = True
                self.chrome_available = True
                break
        
        if not chrome_found:
            print("⚠️ Chrome/Chromium não encontrado")
            print("   Selenium precisa de um browser para funcionar")
        
        return True
    
    def install_python_dependencies(self):
        """Instala dependências Python"""
        print("\n📦 Instalando dependências Python...")
        
        requirements_file = Path("requirements-performance.txt")
        
        if not requirements_file.exists():
            print("⚠️ Arquivo requirements-performance.txt não encontrado")
            print("Criando arquivo com dependências essenciais...")
            self.create_requirements_file()
        
        try:
            # Atualizar pip primeiro
            print("🔄 Atualizando pip...")
            subprocess.run([
                sys.executable, '-m', 'pip', 'install', '--upgrade', 'pip'
            ], check=True)
            
            # Instalar dependências
            print("📥 Instalando dependências...")
            subprocess.run([
                sys.executable, '-m', 'pip', 'install', '-r', str(requirements_file)
            ], check=True)
            
            print("✅ Dependências Python instaladas com sucesso!")
            self.requirements_installed = True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao instalar dependências: {e}")
            print("Tentando instalação individual...")
            return self.install_essential_packages()
        
        return True
    
    def create_requirements_file(self):
        """Cria arquivo de requirements básico"""
        essential_packages = [
            "selenium>=4.15.0",
            "webdriver-manager>=4.0.1",
            "aiohttp>=3.9.0",
            "psutil>=5.9.0",
            "requests>=2.31.0"
        ]
        
        with open("requirements-performance.txt", "w") as f:
            f.write("# Essential packages for performance testing\n")
            for package in essential_packages:
                f.write(f"{package}\n")
    
    def install_essential_packages(self):
        """Instala pacotes essenciais individualmente"""
        essential_packages = [
            "selenium",
            "webdriver-manager", 
            "aiohttp",
            "psutil",
            "requests"
        ]
        
        for package in essential_packages:
            try:
                print(f"📦 Instalando {package}...")
                subprocess.run([
                    sys.executable, '-m', 'pip', 'install', package
                ], check=True)
                print(f"✅ {package} instalado")
            except subprocess.CalledProcessError:
                print(f"❌ Falha ao instalar {package}")
                return False
        
        self.requirements_installed = True
        return True
    
    def install_chrome_driver(self):
        """Instala ChromeDriver automaticamente"""
        print("\n🚗 Configurando ChromeDriver...")
        
        try:
            from selenium import webdriver
            from webdriver_manager.chrome import ChromeDriverManager
            
            print("📥 Baixando ChromeDriver...")
            driver_path = ChromeDriverManager().install()
            print(f"✅ ChromeDriver instalado: {driver_path}")
            
            # Testar se funciona
            print("🧪 Testando ChromeDriver...")
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver.chrome.service import Service
            
            options = Options()
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            
            driver = webdriver.Chrome(
                service=Service(driver_path),
                options=options
            )
            driver.get("https://www.google.com")
            driver.quit()
            
            print("✅ ChromeDriver funcionando corretamente!")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao configurar ChromeDriver: {e}")
            return False
    
    def install_lighthouse(self):
        """Instala Lighthouse globalmente"""
        print("\n💡 Instalando Lighthouse (opcional)...")
        
        if not self.node_available:
            print("⚠️ Node.js não disponível, pulando Lighthouse")
            return False
        
        try:
            # Verificar se já está instalado
            result = subprocess.run(['lighthouse', '--version'], capture_output=True, text=True, shell=True)
            if result.returncode == 0:
                print(f"✅ Lighthouse já instalado: {result.stdout.strip()}")
                return True
        except FileNotFoundError:
            pass
        
        try:
            print("📥 Instalando Lighthouse...")
            # Usar shell=True no Windows para resolver problemas de PATH
            subprocess.run(['npm', 'install', '-g', 'lighthouse'], 
                         check=True, shell=True, timeout=300)
            print("✅ Lighthouse instalado com sucesso!")
            return True
            
        except subprocess.TimeoutExpired:
            print("⚠️ Timeout na instalação do Lighthouse (pode estar lento)")
            print("Lighthouse é opcional, continuando sem ele...")
            return False
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Falha ao instalar Lighthouse: {e}")
            print("Lighthouse é opcional, continuando sem ele...")
            return False
        except FileNotFoundError:
            print("⚠️ npm não encontrado no PATH do sistema")
            print("Certifique-se de que Node.js está instalado corretamente")
            print("Lighthouse é opcional, continuando sem ele...")
            return False
    
    def create_config_file(self):
        """Cria arquivo de configuração padrão"""
        print("\n⚙️ Criando arquivo de configuração...")
        
        config = {
            "base_url": "http://localhost:8080",
            "output_dir": "performance_reports",
            "tests": {
                "bundle_analysis": True,
                "memory_profiling": True,
                "stress_testing": True,
                "performance_suite": True
            },
            "memory": {
                "duration_minutes": 5,
                "snapshot_interval": 2
            },
            "stress": {
                "max_users": 50,
                "ramp_up_minutes": 5,
                "test_duration_minutes": 10
            },
            "alerts": {
                "enabled": True,
                "thresholds": {
                    "performance_score": 70,
                    "memory_growth_rate": 1048576,
                    "error_rate": 5.0
                }
            }
        }
        
        config_file = Path("performance_config.json")
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Configuração criada: {config_file}")
    
    def create_output_directory(self):
        """Cria diretório de output"""
        output_dir = Path("performance_reports")
        output_dir.mkdir(exist_ok=True)
        print(f"📁 Diretório de reports criado: {output_dir}")
    
    def run_installation_test(self):
        """Executa teste básico da instalação"""
        print("\n🧪 Testando instalação...")
        
        # Testar imports
        try:
            import selenium
            import aiohttp
            import psutil
            import requests
            print("✅ Imports básicos funcionando")
        except ImportError as e:
            print(f"❌ Erro nos imports: {e}")
            return False
        
        # Testar Selenium
        try:
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
            
            print("✅ Selenium funcionando")
            
        except Exception as e:
            print(f"⚠️ Problema com Selenium: {e}")
        
        # Testar aiohttp
        try:
            import asyncio
            import aiohttp
            
            async def test_aiohttp():
                async with aiohttp.ClientSession() as session:
                    async with session.get('https://httpbin.org/get') as response:
                        return response.status == 200
            
            result = asyncio.run(test_aiohttp())
            if result:
                print("✅ aiohttp funcionando")
            else:
                print("⚠️ aiohttp com problemas")
                
        except Exception as e:
            print(f"⚠️ Problema com aiohttp: {e}")
        
        return True
    
    def create_quick_start_script(self):
        """Cria script de início rápido"""
        script_content = '''#!/usr/bin/env python3
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
        from bundle_analyzer import BundleAnalyzer
        analyzer = BundleAnalyzer()
        print("✅ Bundle Analyzer carregado")
        
        # Testar Memory Profiler
        from memory_profiler import MemoryProfiler
        profiler = MemoryProfiler()
        print("✅ Memory Profiler carregado")
        
        # Testar Stress Tester
        from stress_tester import StressTester
        tester = StressTester()
        print("✅ Stress Tester carregado")
        
        print("\n🎉 Todos os módulos carregados com sucesso!")
        print("Para executar testes completos:")
        print("  python master_performance_suite.py")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        print("Execute o instalador novamente: python install_performance_suite.py")

if __name__ == "__main__":
    asyncio.run(quick_test())
'''
        
        script_file = Path("quick_start.py")
        with open(script_file, 'w', encoding='utf-8') as f:
            f.write(script_content)
        
        print(f"🚀 Script de início rápido criado: {script_file}")
    
    def print_installation_summary(self):
        """Imprime resumo da instalação"""
        print("\n" + "=" * 60)
        print("📋 RESUMO DA INSTALAÇÃO")
        print("=" * 60)
        
        print(f"✅ Python {self.python_version.major}.{self.python_version.minor}: OK")
        print(f"{'✅' if self.requirements_installed else '❌'} Dependências Python: {'Instaladas' if self.requirements_installed else 'Falha'}")
        print(f"{'✅' if self.chrome_available else '⚠️'} Chrome/Chromium: {'Disponível' if self.chrome_available else 'Não encontrado'}")
        print(f"{'✅' if self.node_available else '⚠️'} Node.js: {'Disponível' if self.node_available else 'Não encontrado'}")
        
        print("\n📁 ARQUIVOS CRIADOS:")
        files_created = [
            "performance_config.json",
            "performance_reports/",
            "quick_start.py"
        ]
        
        for file in files_created:
            if Path(file).exists():
                print(f"   ✅ {file}")
            else:
                print(f"   ❌ {file}")
        
        print("\n🚀 PRÓXIMOS PASSOS:")
        print("   1. Certifique-se de que o projeto está rodando: npm run dev")
        print("   2. Execute um teste rápido: python quick_start.py")
        print("   3. Execute a suíte completa: python master_performance_suite.py")
        print("   4. Veja o dashboard: open performance_dashboard.html")
        
        if not self.chrome_available:
            print("\n⚠️ ATENÇÃO:")
            print("   Chrome/Chromium não foi encontrado.")
            print("   Instale um browser compatível para usar Selenium.")
        
        if not self.node_available:
            print("\n⚠️ ATENÇÃO:")
            print("   Node.js não foi encontrado.")
            print("   Instale Node.js para executar o projeto principal.")
    
    def run_installation(self):
        """Executa instalação completa"""
        self.print_header()
        
        # Verificar pré-requisitos
        if not self.check_prerequisites():
            print("\n❌ Pré-requisitos não atendidos. Instalação abortada.")
            return False
        
        # Instalar dependências Python
        if not self.install_python_dependencies():
            print("\n❌ Falha na instalação das dependências Python.")
            return False
        
        # Configurar ChromeDriver
        self.install_chrome_driver()
        
        # Instalar Lighthouse (opcional)
        self.install_lighthouse()
        
        # Criar arquivos de configuração
        self.create_config_file()
        self.create_output_directory()
        self.create_quick_start_script()
        
        # Testar instalação
        self.run_installation_test()
        
        # Resumo final
        self.print_installation_summary()
        
        print("\n🎉 INSTALAÇÃO CONCLUÍDA!")
        return True

def main():
    """Função principal"""
    installer = PerformanceSuiteInstaller()
    
    try:
        success = installer.run_installation()
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n⏹️ Instalação interrompida pelo usuário")
        return 130
    except Exception as e:
        print(f"\n💥 Erro inesperado durante instalação: {e}")
        return 1

if __name__ == "__main__":
    exit(main()) 