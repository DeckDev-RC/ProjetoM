#!/usr/bin/env python3
"""
📦 Bundle Analyzer - Projeto M
Análise detalhada do bundle para otimização de performance

Funcionalidades:
- Análise de tamanho de chunks
- Detecção de duplicação de código
- Análise de dependências
- Sugestões de otimização
- Comparação histórica
- Tree shaking analysis
"""

import json
import os
import re
import gzip
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
import subprocess
import statistics

@dataclass
class BundleFile:
    """Representa um arquivo do bundle"""
    name: str
    path: str
    size: int
    gzipped_size: int
    type: str  # js, css, asset
    chunk_type: str  # vendor, main, lazy
    dependencies: List[str]
    hash: str

@dataclass
class BundleAnalysis:
    """Resultado da análise do bundle"""
    timestamp: str
    total_size: int
    total_gzipped_size: int
    files: List[BundleFile]
    chunks_count: int
    duplicated_code: List[Dict]
    optimization_suggestions: List[str]
    dependency_analysis: Dict
    performance_impact: Dict

class BundleAnalyzer:
    """Analisador avançado de bundle"""
    
    def __init__(self, dist_path: str = "dist"):
        self.dist_path = Path(dist_path)
        self.analysis_history: List[BundleAnalysis] = []
        self.load_history()
    
    def analyze(self) -> BundleAnalysis:
        """Executa análise completa do bundle"""
        print("📦 Iniciando análise do bundle...")
        
        if not self.dist_path.exists():
            print("⚠️ Pasta dist não encontrada. Executando build...")
            self.build_project()
        
        # Coletar informações dos arquivos
        files = self.collect_file_info()
        
        # Análises específicas
        duplicated_code = self.detect_duplicated_code(files)
        optimization_suggestions = self.generate_optimization_suggestions(files)
        dependency_analysis = self.analyze_dependencies(files)
        performance_impact = self.calculate_performance_impact(files)
        
        # Criar análise
        analysis = BundleAnalysis(
            timestamp=datetime.now().isoformat(),
            total_size=sum(f.size for f in files),
            total_gzipped_size=sum(f.gzipped_size for f in files),
            files=files,
            chunks_count=len([f for f in files if f.type == 'js']),
            duplicated_code=duplicated_code,
            optimization_suggestions=optimization_suggestions,
            dependency_analysis=dependency_analysis,
            performance_impact=performance_impact
        )
        
        self.analysis_history.append(analysis)
        self.save_analysis(analysis)
        
        return analysis
    
    def build_project(self):
        """Executa build do projeto"""
        try:
            result = subprocess.run(
                ["npm", "run", "build"],
                capture_output=True,
                text=True,
                check=True
            )
            print("✅ Build executado com sucesso")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro no build: {e.stderr}")
            raise
    
    def collect_file_info(self) -> List[BundleFile]:
        """Coleta informações detalhadas dos arquivos"""
        files = []
        
        for file_path in self.dist_path.rglob("*"):
            if file_path.is_file() and not file_path.name.startswith('.'):
                # Determinar tipo do arquivo
                file_type = self.get_file_type(file_path)
                if file_type == 'unknown':
                    continue
                
                # Calcular tamanhos
                size = file_path.stat().st_size
                gzipped_size = self.get_gzipped_size(file_path)
                
                # Determinar tipo de chunk
                chunk_type = self.determine_chunk_type(file_path.name)
                
                # Extrair dependências (para arquivos JS)
                dependencies = []
                if file_type == 'js':
                    dependencies = self.extract_dependencies(file_path)
                
                # Calcular hash
                file_hash = self.calculate_file_hash(file_path)
                
                bundle_file = BundleFile(
                    name=file_path.name,
                    path=str(file_path.relative_to(self.dist_path)),
                    size=size,
                    gzipped_size=gzipped_size,
                    type=file_type,
                    chunk_type=chunk_type,
                    dependencies=dependencies,
                    hash=file_hash
                )
                
                files.append(bundle_file)
        
        return files
    
    def get_file_type(self, file_path: Path) -> str:
        """Determina o tipo do arquivo"""
        suffix = file_path.suffix.lower()
        
        if suffix == '.js':
            return 'js'
        elif suffix == '.css':
            return 'css'
        elif suffix in ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']:
            return 'image'
        elif suffix in ['.woff', '.woff2', '.ttf', '.otf']:
            return 'font'
        elif suffix in ['.json', '.txt', '.xml']:
            return 'data'
        else:
            return 'unknown'
    
    def get_gzipped_size(self, file_path: Path) -> int:
        """Calcula o tamanho comprimido com gzip"""
        try:
            with open(file_path, 'rb') as f:
                return len(gzip.compress(f.read()))
        except Exception:
            return 0
    
    def determine_chunk_type(self, filename: str) -> str:
        """Determina o tipo de chunk baseado no nome"""
        filename_lower = filename.lower()
        
        if 'vendor' in filename_lower:
            return 'vendor'
        elif 'main' in filename_lower or 'index' in filename_lower:
            return 'main'
        elif any(name in filename_lower for name in ['lazy', 'async', 'component']):
            return 'lazy'
        else:
            return 'other'
    
    def extract_dependencies(self, file_path: Path) -> List[str]:
        """Extrai dependências de um arquivo JS"""
        dependencies = []
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
                # Procurar por imports
                import_patterns = [
                    r'import\s+.*?\s+from\s+["\']([^"\']+)["\']',
                    r'require\(["\']([^"\']+)["\']\)',
                    r'import\(["\']([^"\']+)["\']\)'
                ]
                
                for pattern in import_patterns:
                    matches = re.findall(pattern, content)
                    dependencies.extend(matches)
        
        except Exception:
            pass
        
        return list(set(dependencies))  # Remove duplicatas
    
    def calculate_file_hash(self, file_path: Path) -> str:
        """Calcula hash MD5 do arquivo"""
        try:
            with open(file_path, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()[:8]
        except Exception:
            return "unknown"
    
    def detect_duplicated_code(self, files: List[BundleFile]) -> List[Dict]:
        """Detecta código duplicado entre chunks"""
        duplicated = []
        js_files = [f for f in files if f.type == 'js']
        
        # Comparar hashes para detectar arquivos idênticos
        hash_groups = {}
        for file in js_files:
            if file.hash not in hash_groups:
                hash_groups[file.hash] = []
            hash_groups[file.hash].append(file.name)
        
        for file_hash, file_names in hash_groups.items():
            if len(file_names) > 1:
                duplicated.append({
                    'type': 'identical_files',
                    'files': file_names,
                    'hash': file_hash,
                    'impact': 'high'
                })
        
        # Detectar dependências duplicadas
        dependency_counts = {}
        for file in js_files:
            for dep in file.dependencies:
                if dep not in dependency_counts:
                    dependency_counts[dep] = []
                dependency_counts[dep].append(file.name)
        
        for dep, files_using in dependency_counts.items():
            if len(files_using) > 2:  # Presente em mais de 2 chunks
                duplicated.append({
                    'type': 'duplicated_dependency',
                    'dependency': dep,
                    'files': files_using,
                    'impact': 'medium'
                })
        
        return duplicated
    
    def generate_optimization_suggestions(self, files: List[BundleFile]) -> List[str]:
        """Gera sugestões de otimização"""
        suggestions = []
        
        # Analisar tamanhos
        js_files = [f for f in files if f.type == 'js']
        css_files = [f for f in files if f.type == 'css']
        
        total_js_size = sum(f.size for f in js_files)
        total_css_size = sum(f.size for f in css_files)
        
        # Sugestões baseadas em tamanho
        if total_js_size > 1024 * 1024:  # > 1MB
            suggestions.append("⚠️ Bundle JS muito grande (>1MB). Considere code splitting adicional.")
        
        if total_css_size > 512 * 1024:  # > 512KB
            suggestions.append("⚠️ CSS muito grande (>512KB). Considere CSS code splitting.")
        
        # Analisar chunks individuais
        for file in js_files:
            if file.size > 500 * 1024:  # > 500KB
                suggestions.append(f"📦 Chunk '{file.name}' muito grande ({file.size/1024:.1f}KB). Considere dividir.")
        
        # Analisar compressão
        for file in files:
            if file.gzipped_size > 0:
                compression_ratio = file.gzipped_size / file.size
                if compression_ratio > 0.8:  # Compressão ruim
                    suggestions.append(f"🗜️ Arquivo '{file.name}' com baixa compressão ({compression_ratio:.1%}). Verifique conteúdo.")
        
        # Analisar chunks vendor
        vendor_files = [f for f in js_files if f.chunk_type == 'vendor']
        if len(vendor_files) > 1:
            suggestions.append("📚 Múltiplos chunks vendor detectados. Considere consolidar.")
        
        # Analisar lazy loading
        lazy_files = [f for f in js_files if f.chunk_type == 'lazy']
        main_files = [f for f in js_files if f.chunk_type == 'main']
        
        if len(lazy_files) == 0 and len(main_files) > 0:
            suggestions.append("⚡ Nenhum chunk lazy detectado. Considere implementar lazy loading.")
        
        return suggestions
    
    def analyze_dependencies(self, files: List[BundleFile]) -> Dict:
        """Analisa dependências do projeto"""
        all_dependencies = set()
        dependency_usage = {}
        
        for file in files:
            for dep in file.dependencies:
                all_dependencies.add(dep)
                if dep not in dependency_usage:
                    dependency_usage[dep] = []
                dependency_usage[dep].append(file.name)
        
        # Categorizar dependências
        external_deps = []
        internal_deps = []
        
        for dep in all_dependencies:
            if dep.startswith('./') or dep.startswith('../') or dep.startswith('@/'):
                internal_deps.append(dep)
            else:
                external_deps.append(dep)
        
        # Top dependências mais usadas
        top_dependencies = sorted(
            dependency_usage.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )[:10]
        
        return {
            'total_dependencies': len(all_dependencies),
            'external_dependencies': len(external_deps),
            'internal_dependencies': len(internal_deps),
            'top_dependencies': [
                {'name': dep, 'usage_count': len(files)}
                for dep, files in top_dependencies
            ],
            'unused_dependencies': self.detect_unused_dependencies()
        }
    
    def detect_unused_dependencies(self) -> List[str]:
        """Detecta dependências não utilizadas"""
        # Ler package.json
        package_json_path = Path("package.json")
        if not package_json_path.exists():
            return []
        
        try:
            with open(package_json_path, 'r', encoding='utf-8') as f:
                package_data = json.load(f)
            
            declared_deps = set()
            declared_deps.update(package_data.get('dependencies', {}).keys())
            declared_deps.update(package_data.get('devDependencies', {}).keys())
            
            # Coletar dependências usadas no código
            used_deps = set()
            for file_path in Path("src").rglob("*.{ts,tsx,js,jsx}"):
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        
                        # Procurar imports
                        import_matches = re.findall(
                            r'import\s+.*?\s+from\s+["\']([^"\']+)["\']',
                            content
                        )
                        
                        for match in import_matches:
                            # Extrair nome do pacote
                            if not match.startswith('.'):
                                package_name = match.split('/')[0]
                                if package_name.startswith('@'):
                                    package_name = '/'.join(match.split('/')[:2])
                                used_deps.add(package_name)
                
                except Exception:
                    continue
            
            unused = declared_deps - used_deps
            return list(unused)
        
        except Exception:
            return []
    
    def calculate_performance_impact(self, files: List[BundleFile]) -> Dict:
        """Calcula impacto na performance"""
        js_files = [f for f in files if f.type == 'js']
        
        # Calcular métricas de carregamento
        main_chunks = [f for f in js_files if f.chunk_type == 'main']
        vendor_chunks = [f for f in js_files if f.chunk_type == 'vendor']
        lazy_chunks = [f for f in js_files if f.chunk_type == 'lazy']
        
        critical_path_size = sum(f.size for f in main_chunks + vendor_chunks)
        
        # Estimativas de tempo de carregamento (baseado em diferentes conexões)
        connection_speeds = {
            "3G": 1.6 * 1024 * 1024 / 8,  # 1.6 Mbps em bytes/s
            "4G": 9 * 1024 * 1024 / 8,    # 9 Mbps em bytes/s
            "WiFi": 30 * 1024 * 1024 / 8  # 30 Mbps em bytes/s
        }
        
        loading_times = {}
        for connection, speed in connection_speeds.items():
            loading_times[connection] = critical_path_size / speed
        
        return {
            'critical_path_size': critical_path_size,
            'total_lazy_size': sum(f.size for f in lazy_chunks),
            'chunk_distribution': {
                'main': len(main_chunks),
                'vendor': len(vendor_chunks),
                'lazy': len(lazy_chunks)
            },
            'estimated_loading_times': loading_times,
            'compression_efficiency': self.calculate_compression_efficiency(files)
        }
    
    def calculate_compression_efficiency(self, files: List[BundleFile]) -> Dict:
        """Calcula eficiência de compressão"""
        total_original = sum(f.size for f in files if f.gzipped_size > 0)
        total_compressed = sum(f.gzipped_size for f in files if f.gzipped_size > 0)
        
        if total_original == 0:
            return {'ratio': 0, 'savings': 0}
        
        ratio = total_compressed / total_original
        savings = total_original - total_compressed
        
        return {
            'ratio': ratio,
            'savings': savings,
            'efficiency': 'good' if ratio < 0.3 else 'average' if ratio < 0.5 else 'poor'
        }
    
    def compare_with_previous(self, current: BundleAnalysis) -> Optional[Dict]:
        """Compara com análise anterior"""
        if len(self.analysis_history) < 2:
            return None
        
        previous = self.analysis_history[-2]
        
        size_change = current.total_size - previous.total_size
        size_change_percent = (size_change / previous.total_size) * 100
        
        chunks_change = current.chunks_count - previous.chunks_count
        
        return {
            'size_change': size_change,
            'size_change_percent': size_change_percent,
            'chunks_change': chunks_change,
            'new_files': [f.name for f in current.files if f.name not in [pf.name for pf in previous.files]],
            'removed_files': [f.name for f in previous.files if f.name not in [cf.name for cf in current.files]]
        }
    
    def save_analysis(self, analysis: BundleAnalysis):
        """Salva análise em arquivo"""
        filename = f"bundle_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(asdict(analysis), f, indent=2, ensure_ascii=False)
        
        print(f"📊 Análise salva em: {filename}")
    
    def load_history(self):
        """Carrega histórico de análises"""
        history_files = list(Path(".").glob("bundle_analysis_*.json"))
        
        for file_path in sorted(history_files)[-10:]:  # Últimas 10 análises
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Reconstruir objetos
                    files = [BundleFile(**f) for f in data['files']]
                    analysis = BundleAnalysis(
                        timestamp=data['timestamp'],
                        total_size=data['total_size'],
                        total_gzipped_size=data['total_gzipped_size'],
                        files=files,
                        chunks_count=data['chunks_count'],
                        duplicated_code=data['duplicated_code'],
                        optimization_suggestions=data['optimization_suggestions'],
                        dependency_analysis=data['dependency_analysis'],
                        performance_impact=data['performance_impact']
                    )
                    self.analysis_history.append(analysis)
            except Exception as e:
                print(f"⚠️ Erro ao carregar {file_path}: {e}")
    
    def print_report(self, analysis: BundleAnalysis):
        """Imprime relatório detalhado"""
        print("\n" + "="*70)
        print("📦 RELATÓRIO DE ANÁLISE DO BUNDLE")
        print("="*70)
        
        print(f"📅 Data: {analysis.timestamp}")
        print(f"📊 Total de arquivos: {len(analysis.files)}")
        print(f"📦 Total de chunks JS: {analysis.chunks_count}")
        print(f"💾 Tamanho total: {analysis.total_size / 1024:.2f} KB")
        print(f"🗜️  Tamanho comprimido: {analysis.total_gzipped_size / 1024:.2f} KB")
        
        # Distribuição por tipo
        js_files = [f for f in analysis.files if f.type == 'js']
        css_files = [f for f in analysis.files if f.type == 'css']
        
        print(f"\n📁 DISTRIBUIÇÃO POR TIPO:")
        print(f"   JavaScript: {sum(f.size for f in js_files) / 1024:.2f} KB ({len(js_files)} arquivos)")
        print(f"   CSS: {sum(f.size for f in css_files) / 1024:.2f} KB ({len(css_files)} arquivos)")
        
        # Top 5 maiores arquivos
        largest_files = sorted(analysis.files, key=lambda f: f.size, reverse=True)[:5]
        print(f"\n🔝 TOP 5 MAIORES ARQUIVOS:")
        for i, file in enumerate(largest_files, 1):
            print(f"   {i}. {file.name}: {file.size / 1024:.2f} KB ({file.type})")
        
        # Chunks por tipo
        chunk_distribution = analysis.performance_impact['chunk_distribution']
        print(f"\n📦 DISTRIBUIÇÃO DE CHUNKS:")
        print(f"   Main: {chunk_distribution['main']}")
        print(f"   Vendor: {chunk_distribution['vendor']}")
        print(f"   Lazy: {chunk_distribution['lazy']}")
        
        # Tempos de carregamento estimados
        loading_times = analysis.performance_impact['estimated_loading_times']
        print(f"\n⏱️  TEMPOS DE CARREGAMENTO ESTIMADOS:")
        for connection, time in loading_times.items():
            print(f"   {connection}: {time:.2f}s")
        
        # Dependências
        dep_analysis = analysis.dependency_analysis
        print(f"\n📚 ANÁLISE DE DEPENDÊNCIAS:")
        print(f"   Total: {dep_analysis['total_dependencies']}")
        print(f"   Externas: {dep_analysis['external_dependencies']}")
        print(f"   Internas: {dep_analysis['internal_dependencies']}")
        
        if dep_analysis['unused_dependencies']:
            print(f"   ⚠️ Não utilizadas: {len(dep_analysis['unused_dependencies'])}")
        
        # Código duplicado
        if analysis.duplicated_code:
            print(f"\n⚠️  CÓDIGO DUPLICADO DETECTADO:")
            for dup in analysis.duplicated_code:
                print(f"   {dup['type']}: {dup.get('dependency', 'N/A')} (impacto: {dup['impact']})")
        
        # Sugestões de otimização
        if analysis.optimization_suggestions:
            print(f"\n💡 SUGESTÕES DE OTIMIZAÇÃO:")
            for suggestion in analysis.optimization_suggestions:
                print(f"   {suggestion}")
        
        # Comparação com análise anterior
        comparison = self.compare_with_previous(analysis)
        if comparison:
            print(f"\n📈 COMPARAÇÃO COM ANÁLISE ANTERIOR:")
            print(f"   Mudança de tamanho: {comparison['size_change_percent']:+.2f}%")
            print(f"   Mudança de chunks: {comparison['chunks_change']:+d}")
            
            if comparison['new_files']:
                print(f"   Novos arquivos: {', '.join(comparison['new_files'])}")
            
            if comparison['removed_files']:
                print(f"   Arquivos removidos: {', '.join(comparison['removed_files'])}")
        
        print("\n" + "="*70)

def main():
    """Função principal"""
    analyzer = BundleAnalyzer()
    analysis = analyzer.analyze()
    analyzer.print_report(analysis)

if __name__ == "__main__":
    main() 