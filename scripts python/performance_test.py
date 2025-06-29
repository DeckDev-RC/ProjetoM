#!/usr/bin/env python3
"""
Script de Análise de Performance - Projeto M
Executa testes automatizados de velocidade e qualidade do site
"""

import os
import json
import time
import mimetypes
from pathlib import Path
from typing import Dict, List, Any

class PerformanceAnalyzer:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.public_path = self.project_path / "public"
        self.src_path = self.project_path / "src"
        
    def analyze_assets(self) -> Dict[str, Any]:
        """Analisa todos os assets do projeto"""
        results = {
            "images": [],
            "videos": [],
            "fonts": [],
            "total_size": 0,
            "large_files": [],
            "issues": []
        }
        
        # Analisar arquivos públicos
        if self.public_path.exists():
            for file_path in self.public_path.rglob("*"):
                if file_path.is_file():
                    file_info = self._analyze_file(file_path)
                    results["total_size"] += file_info["size"]
                    
                    # Categorizar por tipo
                    if file_info["type"] == "image":
                        results["images"].append(file_info)
                    elif file_info["type"] == "video":
                        results["videos"].append(file_info)
                    elif file_info["type"] == "font":
                        results["fonts"].append(file_info)
                    
                    # Identificar arquivos grandes
                    if file_info["size"] > 1024 * 1024:  # > 1MB
                        results["large_files"].append(file_info)
                        results["issues"].append(f"Arquivo grande: {file_info['name']} ({file_info['size_mb']:.2f}MB)")
        
        return results
    
    def _analyze_file(self, file_path: Path) -> Dict[str, Any]:
        """Analisa um arquivo individual"""
        stat = file_path.stat()
        mime_type, _ = mimetypes.guess_type(str(file_path))
        
        file_type = "other"
        if mime_type:
            if mime_type.startswith("image/"):
                file_type = "image"
            elif mime_type.startswith("video/"):
                file_type = "video"
            elif mime_type.startswith("font/") or file_path.suffix in [".ttf", ".otf", ".woff", ".woff2"]:
                file_type = "font"
        
        return {
            "name": file_path.name,
            "path": str(file_path.relative_to(self.project_path)),
            "size": stat.st_size,
            "size_kb": stat.st_size / 1024,
            "size_mb": stat.st_size / (1024 * 1024),
            "type": file_type,
            "extension": file_path.suffix
        }
    
    def analyze_code_complexity(self) -> Dict[str, Any]:
        """Analisa a complexidade do código"""
        results = {
            "total_files": 0,
            "total_lines": 0,
            "large_files": [],
            "hooks_usage": {},
            "performance_issues": []
        }
        
        hook_patterns = [
            "useState", "useEffect", "useMemo", "useCallback",
            "useRef", "useContext", "useReducer"
        ]
        
        for file_path in self.src_path.rglob("*.tsx"):
            if file_path.is_file():
                results["total_files"] += 1
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        lines = content.split('\n')
                        line_count = len(lines)
                        results["total_lines"] += line_count
                        
                        # Arquivos grandes
                        if line_count > 200:
                            results["large_files"].append({
                                "file": str(file_path.relative_to(self.project_path)),
                                "lines": line_count
                            })
                        
                        # Análise de hooks
                        for hook in hook_patterns:
                            count = content.count(hook)
                            if count > 0:
                                if hook not in results["hooks_usage"]:
                                    results["hooks_usage"][hook] = 0
                                results["hooks_usage"][hook] += count
                        
                        # Problemas de performance específicos
                        self._check_performance_issues(file_path, content, results["performance_issues"])
                        
                except Exception as e:
                    print(f"Erro ao analisar {file_path}: {e}")
        
        return results
    
    def _check_performance_issues(self, file_path: Path, content: str, issues: List[str]):
        """Verifica problemas específicos de performance"""
        file_name = file_path.name
        
        # Verificar vídeos múltiplos
        if content.count("<video") > 1:
            issues.append(f"{file_name}: Múltiplos elementos de vídeo")
        
        # Verificar setInterval sem cleanup
        if "setInterval" in content and "clearInterval" not in content:
            issues.append(f"{file_name}: setInterval sem clearInterval")
        
        # Verificar animações pesadas
        if content.count("animate") > 5:
            issues.append(f"{file_name}: Muitas animações ({content.count('animate')})")
        
        # Verificar orbs (componente específico)
        if "orb" in content.lower() and "24" in content:
            issues.append(f"{file_name}: Muitos orbs (possível impacto na performance)")
        
        # Verificar useEffect sem dependências
        if "useEffect" in content and "[]" not in content:
            effect_count = content.count("useEffect")
            deps_count = content.count("[]")
            if effect_count > deps_count:
                issues.append(f"{file_name}: useEffect sem array de dependências otimizado")
    
    def run_full_analysis(self) -> Dict[str, Any]:
        """Executa análise completa"""
        print("🔍 Iniciando análise de performance...")
        
        # Análise de assets
        print("📁 Analisando assets...")
        assets = self.analyze_assets()
        
        # Análise de código
        print("💻 Analisando código...")
        code = self.analyze_code_complexity()
        
        return {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "assets": assets,
            "code": code,
            "summary": {
                "total_assets_mb": assets["total_size"] / (1024 * 1024),
                "large_files_count": len(assets["large_files"]),
                "code_files": code["total_files"],
                "code_lines": code["total_lines"],
                "performance_issues": len(code["performance_issues"])
            }
        }

def main():
    """Função principal"""
    project_path = os.getcwd()
    analyzer = PerformanceAnalyzer(project_path)
    
    try:
        results = analyzer.run_full_analysis()
        
        summary = results["summary"]
        
        print("\n" + "="*60)
        print("📊 RESUMO DA ANÁLISE DE PERFORMANCE")
        print("="*60)
        
        print(f"📦 Assets Totais: {summary['total_assets_mb']:.2f}MB")
        print(f"📁 Arquivos Grandes: {summary['large_files_count']}")
        print(f"💻 Arquivos de Código: {summary['code_files']}")
        print(f"📝 Linhas de Código: {summary['code_lines']}")
        print(f"⚠️  Problemas de Performance: {summary['performance_issues']}")
        
        print("\n⚡ PROBLEMAS CRÍTICOS ENCONTRADOS:")
        for issue in results["code"]["performance_issues"][:5]:
            print(f"   • {issue}")
        
        # Salvar relatório
        with open("performance_report.json", 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Análise concluída! Relatório salvo em performance_report.json")
        
    except Exception as e:
        print(f"❌ Erro durante a análise: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 