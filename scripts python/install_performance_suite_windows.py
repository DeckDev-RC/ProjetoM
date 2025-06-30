#!/usr/bin/env python3
"""
🚀 Instalador Automático - Windows - Suíte de Performance Testing
Versão específica para Windows com melhor tratamento de erros

Funcionalidades:
- Verificação robusta de pré-requisitos no Windows
- Instalação de dependências Python
- Configuração do ambiente Windows
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

class WindowsPerformanceSuiteInstaller:
    """Instalador automático da suíte de performance para Windows"""
    
    def __init__(self):
        self.system = platform.system().lower()
        self.python_version = sys.version_info
        self.requirements_installed = False
        self.chrome_available = False
        self.node_available = False
        self.npm_available = False
        
    def print_header(self):
        """Imprime cabeçalho do instalador"""
        print("🚀 INSTALADOR AUTOMÁTICO - WINDOWS - SUÍTE DE PERFORMANCE TESTING")
        print("=" * 70)
        print("Este script irá instalar e configurar todas as dependências")
        print("necessárias para executar os testes de performance no Windows.")
        print()
    
    def check_prerequisites(self):
        """Verifica pré-requisitos do sistema Windows"""
        print("🔍 Verificando pré-requisitos do Windows...")
        
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
        
        # Verificar Node.js com diferentes métodos
        self.node_available = self.check_nodejs()
        self.npm_available = self.check_npm()
        
        # Verificar Chrome/Chromium
        self.chrome_available = self.check_chrome()
        
        return True
    
    def check_nodejs(self):
        """Verifica Node.js com múltiplos métodos"""
        methods = [
            (['node', '--version'], "node"),
            (['node.exe', '--version'], "node.exe"),
            (['nodejs', '--version'], "nodejs")
        ]
        
        for cmd, name in methods:
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, 
                                      shell=True, timeout=10)
                if result.returncode == 0:
                    node_version = result.stdout.strip()
                    print(f"✅ Node.js {node_version} disponível ({name})")
                    return True
            except (FileNotFoundError, subprocess.TimeoutExpired):
                continue
        
        print("⚠️ Node.js não encontrado (necessário para o projeto)")
        print("   Instale Node.js de: https://nodejs.org/")
        return False
    
    def check_npm(self):
        """Verifica npm com múltiplos métodos"""
        if not self.node_available:
            return False
            
        methods = [
            (['npm', '--version'], "npm"),
            (['npm.cmd', '--version'], "npm.cmd"),
            (['npx', '--version'], "npx")
        ]
        
        for cmd, name in methods:
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, 
                                      shell=True, timeout=10)
                if result.returncode == 0:
                    npm_version = result.stdout.strip()
                    print(f"✅ npm {npm_version} disponível ({name})")
                    return True
            except (FileNotFoundError, subprocess.TimeoutExpired):
                continue
        
        print("⚠️ npm não encontrado")
        return False
    
    def check_chrome(self):
        """Verifica Chrome/Chromium no Windows"""
        chrome_paths = [
            r'C:\Program Files\Google\Chrome\Application\chrome.exe',
            r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
            r'C:\Users\{}\AppData\Local\Google\Chrome\Application\chrome.exe'.format(os.getenv('USERNAME', '')),
            r'C:\Program Files\Chromium\Application\chromium.exe',
            r'C:\Program Files (x86)\Chromium\Application\chromium.exe'
        ]
        
        for path in chrome_paths:
            if os.path.exists(path):
                print(f"✅ Chrome/Chromium encontrado: {path}")
                return True
        
        print("⚠️ Chrome/Chromium não encontrado")
        print("   Instale Chrome de: https://www.google.com/chrome/")
        print("   Selenium precisa de um browser para funcionar")
        return False
    
    def install_python_dependencies(self):
        """Instala dependências Python no Windows"""
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
            ], check=True, shell=True)
            
            # Instalar dependências
            print("📥 Instalando dependências...")
            subprocess.run([
                sys.executable, '-m', 'pip', 'install', '-r', str(requirements_file)
            ], check=True, shell=True)
            
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
                ], check=True, shell=True)
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
            options.add_argument("--disable-gpu")  # Adicional para Windows
            
            service = Service(driver_path)
            driver = webdriver.Chrome(service=service, options=options)
            driver.get("https://www.google.com")
            driver.quit()
            
            print("✅ ChromeDriver funcionando corretamente!")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao configurar ChromeDriver: {e}")
            return False
    
    def install_lighthouse_windows(self):
        """Instala Lighthouse no Windows com tratamento robusto"""
        print("\n💡 Instalando Lighthouse (opcional)...")
        
        if not self.npm_available:
            print("⚠️ npm não disponível, pulando Lighthouse")
            return False
        
        # Tentar verificar se já está instalado
        lighthouse_commands = ['lighthouse', 'lighthouse.cmd', 'npx lighthouse']
        
        for cmd in lighthouse_commands:
            try:
                result = subprocess.run(cmd.split() + ['--version'], 
                                      capture_output=True, text=True, 
                                      shell=True, timeout=10)
                if result.returncode == 0:
                    print(f"✅ Lighthouse já instalado: {result.stdout.strip()}")
                    return True
            except (FileNotFoundError, subprocess.TimeoutExpired):
                continue
        
        # Tentar instalar
        npm_commands = ['npm', 'npm.cmd']
        
        for npm_cmd in npm_commands:
            try:
                print(f"📥 Instalando Lighthouse via {npm_cmd}...")
                subprocess.run([npm_cmd, 'install', '-g', 'lighthouse'], 
                             check=True, shell=True, timeout=300)
                print("✅ Lighthouse instalado com sucesso!")
                return True
                
            except subprocess.TimeoutExpired:
                print("⚠️ Timeout na instalação do Lighthouse")
                continue
            except subprocess.CalledProcessError as e:
                print(f"⚠️ Falha com {npm_cmd}: {e}")
                continue
            except FileNotFoundError:
                print(f"⚠️ {npm_cmd} não encontrado")
                continue
        
        print("⚠️ Não foi possível instalar Lighthouse")
        print("   Lighthouse é opcional, continuando sem ele...")
        print("   Para instalar manualmente: npm install -g lighthouse")
        return False
    
    def create_windows_batch_scripts(self):
        """Cria scripts batch para facilitar uso no Windows"""
        print("\n📝 Criando scripts batch para Windows...")
        
        # Script para executar testes rápidos
        quick_test_bat = """@echo off
echo 🎯 Executando teste rápido da suíte de performance...
python quick_start.py
pause
"""
        
        with open("quick_test.bat", "w") as f:
            f.write(quick_test_bat)
        
        # Script para executar suíte completa
        full_suite_bat = """@echo off
echo 🚀 Executando suíte completa de performance...
python master_performance_suite.py
pause
"""
        
        with open("run_performance_suite.bat", "w") as f:
            f.write(full_suite_bat)
        
        # Script para abrir dashboard
        dashboard_bat = """@echo off
echo 📊 Abrindo dashboard de performance...
start performance_dashboard.html
"""
        
        with open("open_dashboard.bat", "w") as f:
            f.write(dashboard_bat)
        
        print("✅ Scripts batch criados:")
        print("   • quick_test.bat - Teste rápido")
        print("   • run_performance_suite.bat - Suíte completa")
        print("   • open_dashboard.bat - Abrir dashboard")
    
    def run_installation_test_windows(self):
        """Executa teste básico da instalação no Windows"""
        print("\n🧪 Testando instalação no Windows...")
        
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
        
        # Testar Selenium com configurações Windows
        try:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver.chrome.service import Service
            from webdriver_manager.chrome import ChromeDriverManager
            
            options = Options()
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--disable-extensions")
            
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
            driver.get("data:text/html,<html><body><h1>Test Windows</h1></body></html>")
            title = driver.title
            driver.quit()
            
            print("✅ Selenium funcionando no Windows")
            
        except Exception as e:
            print(f"⚠️ Problema com Selenium: {e}")
        
        return True
    
    def print_windows_summary(self):
        """Imprime resumo específico para Windows"""
        print("\n" + "=" * 70)
        print("📋 RESUMO DA INSTALAÇÃO - WINDOWS")
        print("=" * 70)
        
        print(f"✅ Python {self.python_version.major}.{self.python_version.minor}: OK")
        print(f"{'✅' if self.requirements_installed else '❌'} Dependências Python: {'Instaladas' if self.requirements_installed else 'Falha'}")
        print(f"{'✅' if self.chrome_available else '⚠️'} Chrome/Chromium: {'Disponível' if self.chrome_available else 'Instalar Chrome'}")
        print(f"{'✅' if self.node_available else '⚠️'} Node.js: {'Disponível' if self.node_available else 'Instalar Node.js'}")
        print(f"{'✅' if self.npm_available else '⚠️'} npm: {'Disponível' if self.npm_available else 'Instalar npm'}")
        
        print("\n📁 ARQUIVOS CRIADOS:")
        files_created = [
            "performance_config.json",
            "performance_reports/",
            "quick_start.py",
            "quick_test.bat",
            "run_performance_suite.bat", 
            "open_dashboard.bat"
        ]
        
        for file in files_created:
            if Path(file).exists():
                print(f"   ✅ {file}")
            else:
                print(f"   ❌ {file}")
        
        print("\n🚀 PRÓXIMOS PASSOS - WINDOWS:")
        print("   1. Certifique-se de que o projeto está rodando: npm run dev")
        print("   2. Execute um teste rápido: quick_test.bat")
        print("   3. Execute a suíte completa: run_performance_suite.bat")
        print("   4. Veja o dashboard: open_dashboard.bat")
        
        if not self.chrome_available:
            print("\n⚠️ ATENÇÃO - CHROME:")
            print("   Instale Google Chrome: https://www.google.com/chrome/")
        
        if not self.node_available:
            print("\n⚠️ ATENÇÃO - NODE.JS:")
            print("   Instale Node.js: https://nodejs.org/")
            print("   Reinicie o terminal após a instalação")
    
    def run_installation(self):
        """Executa instalação completa para Windows"""
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
        self.install_lighthouse_windows()
        
        # Criar arquivos de configuração (reutilizar do instalador original)
        from install_performance_suite import PerformanceSuiteInstaller
        original_installer = PerformanceSuiteInstaller()
        original_installer.create_config_file()
        original_installer.create_output_directory()
        original_installer.create_quick_start_script()
        
        # Criar scripts específicos do Windows
        self.create_windows_batch_scripts()
        
        # Testar instalação
        self.run_installation_test_windows()
        
        # Resumo final
        self.print_windows_summary()
        
        print("\n🎉 INSTALAÇÃO WINDOWS CONCLUÍDA!")
        return True

def main():
    """Função principal"""
    installer = WindowsPerformanceSuiteInstaller()
    
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