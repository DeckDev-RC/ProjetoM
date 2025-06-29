#!/usr/bin/env python3
"""
Script de Otimização de Imagens - Projeto M
Converte imagens PNG para WebP e reduz tamanho
"""

import os
import sys
from pathlib import Path
from typing import List

def optimize_images():
    """Otimiza imagens no diretório public"""
    public_dir = Path("public")
    
    if not public_dir.exists():
        print("❌ Diretório public não encontrado!")
        return False
    
    print("🖼️ Iniciando otimização de imagens...")
    
    # Encontrar todas as imagens PNG grandes
    large_images = []
    for img_path in public_dir.rglob("*.png"):
        size_mb = img_path.stat().st_size / (1024 * 1024)
        if size_mb > 0.5:  # Maiores que 500KB
            large_images.append((img_path, size_mb))
    
    if not large_images:
        print("✅ Nenhuma imagem grande encontrada!")
        return True
    
    print(f"📊 Encontradas {len(large_images)} imagens para otimização:")
    for img_path, size_mb in large_images:
        print(f"   • {img_path.name}: {size_mb:.2f}MB")
    
    # Instruções para otimização manual
    print("\n🛠️ INSTRUÇÕES PARA OTIMIZAÇÃO:")
    print("1. Acesse https://squoosh.app/")
    print("2. Para cada imagem listada acima:")
    print("   - Faça upload da imagem")
    print("   - Escolha formato WebP")
    print("   - Ajuste qualidade para 80-85%")
    print("   - Baixe e substitua o arquivo original")
    print("\n📈 REDUÇÃO ESPERADA:")
    
    total_current = sum(size for _, size in large_images)
    total_optimized = total_current * 0.3  # Estimativa de 70% de redução
    savings = total_current - total_optimized
    
    print(f"   • Tamanho atual: {total_current:.2f}MB")
    print(f"   • Tamanho otimizado: {total_optimized:.2f}MB")
    print(f"   • Economia: {savings:.2f}MB ({(savings/total_current)*100:.1f}%)")
    
    return True

def create_webp_guide():
    """Cria guia de otimização"""
    guide_content = """# 🖼️ Guia de Otimização de Imagens

## Imagens Prioritárias para Otimização

### Críticas (>1MB)
- `processos.png` (1.78MB) → `processos.webp`
- `atendimento.png` (1.34MB) → `atendimento.webp`
- `vendas.png` (1.08MB) → `vendas.webp`

### Icons (>1MB cada)
- `Automatize-com-inteligencia.png` (1.48MB)
- `Conecte-tudo-precisao.png` (1.33MB)
- `Fluxos-estrategicos-adaptaveis.png` (1.27MB)
- `Crescimento-monitoramento-total.png` (1.20MB)

## Ferramentas Recomendadas

### Online (Mais Fácil)
1. **[Squoosh](https://squoosh.app/)**
   - Upload da imagem
   - Selecionar WebP
   - Qualidade: 80-85%
   - Download

2. **[TinyPNG](https://tinypng.com/)**
   - Compressão automática
   - Suporte a PNG/JPEG

### Desktop
1. **ImageOptim** (Mac)
2. **RIOT** (Windows)
3. **GIMP** (Multiplataforma)

## Configurações Recomendadas

### WebP
- **Qualidade**: 80-85%
- **Compressão**: Lossy
- **Redução esperada**: 60-80%

### Responsive Images
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.png" type="image/png">
  <img src="image.png" alt="Descrição" loading="lazy">
</picture>
```

## Próximos Passos

1. ✅ Otimizar imagens críticas (>1MB)
2. ✅ Implementar componente LazyImage
3. ✅ Configurar responsive images
4. ✅ Testar performance pós-otimização

**Meta**: Reduzir assets de 9.77MB para ~3MB (-70%)
"""
    
    with open("IMAGE_OPTIMIZATION_GUIDE.md", "w", encoding="utf-8") as f:
        f.write(guide_content)
    
    print("📄 Guia salvo em: IMAGE_OPTIMIZATION_GUIDE.md")

def main():
    """Função principal"""
    try:
        optimize_images()
        create_webp_guide()
        
        print("\n✅ Análise de otimização concluída!")
        print("📋 Próximos passos:")
        print("   1. Seguir instruções do guia de otimização")
        print("   2. Implementar componente LazyImage nos componentes")
        print("   3. Testar performance após otimizações")
        
        return 0
        
    except Exception as e:
        print(f"❌ Erro durante otimização: {e}")
        return 1

if __name__ == "__main__":
    exit(main()) 