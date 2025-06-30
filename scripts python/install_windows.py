#!/usr/bin/env python3
"""
🚀 Instalador Windows - Suíte de Performance Testing
Versão específica para Windows com melhor tratamento de erros
"""

import os
import sys
import subprocess
import platform
from pathlib import Path
import json

class WindowsInstaller:
    """Instalador específico para Windows"""
    
    def __init__(self):
        self.requirements_installed = False
        self.chrome_available = False
        self.node_available = False
        
    def install_lighthouse_safe(self):
        """Instala Lighthouse com tratamento seguro de erros"""
        print("\n💡 Instalando Lighthouse (opcional)...")
        
        # Verificar se npm está disponível
        npm_commands = ['npm', 'npm.cmd']
        npm_working = None
        
        for cmd in npm_commands:
            try:
                result = subprocess.run([cmd, '--version'], 
                                      capture_output=True, text=True, 
                                      shell=True, timeout=10)
                if result.returncode == 0:
                    npm_working = cmd
                    print(f"✅ {cmd} funcionando")
                    break
            except:
                continue
        
        if not npm_working:
            print("⚠️ npm não encontrado, pulando Lighthouse")
            return False
        
        # Tentar instalar Lighthouse
        try:
            print("📥 Instalando Lighthouse...")
            result = subprocess.run([npm_working, 'install', '-g', 'lighthouse'], 
                                  capture_output=True, text=True,
                                  shell=True, timeout=300)
            
            if result.returncode == 0:
                print("✅ Lighthouse instalado com sucesso!")
                return True
            else:
                print(f"⚠️ Lighthouse falhou: {result.stderr}")
                print("Lighthouse é opcional, continuando...")
                return False
                
        except subprocess.TimeoutExpired:
            print("⚠️ Timeout na instalação do Lighthouse")
            print("Lighthouse é opcional, continuando...")
            return False
        except Exception as e:
            print(f"⚠️ Erro na instalação do Lighthouse: {e}")
            print("Lighthouse é opcional, continuando...")
            return False
    
    def create_batch_files(self):
        """Cria arquivos batch para facilitar uso"""
        print("\n📝 Criando scripts batch...")
        
        # Script de teste rápido (sem emojis para evitar problemas de encoding)
        quick_bat = """@echo off
echo Teste Rapido - Performance Suite
python quick_start.py
pause
"""
        with open("quick_test.bat", "w", encoding='utf-8') as f:
            f.write(quick_bat)
        
        # Script da suíte completa
        suite_bat = """@echo off
echo Suite Completa - Performance Testing
python master_performance_suite.py
pause
"""
        with open("run_suite.bat", "w", encoding='utf-8') as f:
            f.write(suite_bat)
        
        # Script para abrir dashboard
        dashboard_bat = """@echo off
echo Abrindo Dashboard de Performance
start performance_dashboard.html
"""
        with open("open_dashboard.bat", "w", encoding='utf-8') as f:
            f.write(dashboard_bat)
        
        print("✅ Scripts batch criados: quick_test.bat, run_suite.bat, open_dashboard.bat")
    
    def run_safe_installation(self):
        """Executa instalação segura"""
        print("🚀 INSTALADOR WINDOWS - PERFORMANCE SUITE")
        print("=" * 50)
        
        # 1. Instalar dependências Python básicas
        print("\n📦 Instalando dependências Python...")
        try:
            subprocess.run([sys.executable, '-m', 'pip', 'install', 
                          'selenium', 'webdriver-manager', 'aiohttp', 'psutil', 'requests'], 
                          check=True)
            print("✅ Dependências básicas instaladas")
            self.requirements_installed = True
        except:
            print("❌ Erro nas dependências Python")
            return False
        
        # 2. Configurar ChromeDriver
        print("\n🚗 Configurando ChromeDriver...")
        try:
            from webdriver_manager.chrome import ChromeDriverManager
            driver_path = ChromeDriverManager().install()
            print(f"✅ ChromeDriver: {driver_path}")
        except Exception as e:
            print(f"⚠️ ChromeDriver: {e}")
        
        # 3. Instalar Lighthouse (opcional)
        self.install_lighthouse_safe()
        
        # 4. Criar arquivos de configuração
        print("\n⚙️ Criando configuração...")
        config = {
            "base_url": "http://localhost:8080",
            "output_dir": "performance_reports"
        }
        
        with open("performance_config.json", "w") as f:
            json.dump(config, f, indent=2)
        
        Path("performance_reports").mkdir(exist_ok=True)
        print("✅ Configuração criada")
        
        # 5. Criar scripts batch
        self.create_batch_files()
        
        print("\n🎉 INSTALAÇÃO CONCLUÍDA!")
        print("Execute: quick_test.bat para testar")
        return True

if __name__ == "__main__":
    installer = WindowsInstaller()
    installer.run_safe_installation() 