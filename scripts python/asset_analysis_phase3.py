#!/usr/bin/env python3
"""
Script de Análise de Assets - Fase 3
Análise detalhada para otimização final
"""

import os
import json
from pathlib import Path
from datetime import datetime

def get_file_size(file_path):
    """Retorna o tamanho do arquivo em bytes"""
    try:
        return os.path.getsize(file_path)
    except OSError:
        return 0

def format_size(size_bytes):
    """Formata tamanho em bytes para formato legível"""
    if size_bytes == 0:
        return "0B"
    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    return f"{size_bytes:.2f}{size_names[i]}"

def analyze_images():
    """Analisa todas as imagens do projeto"""
    print("🖼️ ANÁLISE DETALHADA DE IMAGENS:")
    
    public_dir = Path("public")
    images = []
    total_size = 0
    
    # Buscar imagens na pasta public
    for pattern in ["*.png", "*.jpg", "*.jpeg", "*.gif", "*.webp", "*.svg"]:
        for img_file in public_dir.glob(pattern):
            size = get_file_size(img_file)
            total_size += size
            images.append({
                "name": img_file.name,
                "path": str(img_file),
                "size_bytes": size,
                "size_formatted": format_size(size),
                "extension": img_file.suffix.lower()
            })
    
    # Buscar imagens na pasta icons
    icons_dir = public_dir / "icons"
    if icons_dir.exists():
        for pattern in ["*.png", "*.jpg", "*.jpeg", "*.gif", "*.webp", "*.svg"]:
            for img_file in icons_dir.glob(pattern):
                size = get_file_size(img_file)
                total_size += size
                images.append({
                    "name": img_file.name,
                    "path": str(img_file),
                    "size_bytes": size,
                    "size_formatted": format_size(size),
                    "extension": img_file.suffix.lower(),
                    "category": "icon"
                })
    
    # Ordenar por tamanho (maior primeiro)
    images.sort(key=lambda x: x["size_bytes"], reverse=True)
    
    print(f"\n📊 Total de imagens: {len(images)}")
    print(f"📊 Tamanho total: {format_size(total_size)}")
    
    # Categorizar por prioridade
    critical_images = [img for img in images if img["size_bytes"] > 1024 * 1024]  # > 1MB
    large_images = [img for img in images if 500 * 1024 < img["size_bytes"] <= 1024 * 1024]  # 500KB-1MB
    medium_images = [img for img in images if 100 * 1024 < img["size_bytes"] <= 500 * 1024]  # 100KB-500KB
    small_images = [img for img in images if img["size_bytes"] <= 100 * 1024]  # < 100KB
    
    print(f"\n🔴 CRÍTICAS (>1MB): {len(critical_images)} imagens")
    for img in critical_images:
        webp_estimate = img["size_bytes"] * 0.3  # ~70% redução
        print(f"   • {img['name']}: {img['size_formatted']} → WebP: ~{format_size(webp_estimate)} (-70%)")
    
    print(f"\n🟡 GRANDES (500KB-1MB): {len(large_images)} imagens")
    for img in large_images:
        webp_estimate = img["size_bytes"] * 0.35  # ~65% redução
        print(f"   • {img['name']}: {img['size_formatted']} → WebP: ~{format_size(webp_estimate)} (-65%)")
    
    print(f"\n🟢 MÉDIAS (100KB-500KB): {len(medium_images)} imagens")
    print(f"🔵 PEQUENAS (<100KB): {len(small_images)} imagens")
    
    # Calcular economia total estimada
    total_critical = sum(img["size_bytes"] for img in critical_images)
    total_large = sum(img["size_bytes"] for img in large_images)
    
    estimated_savings = total_critical * 0.7 + total_large * 0.65
    new_total = total_size - estimated_savings
    
    print(f"\n💰 ECONOMIA ESTIMADA:")
    print(f"   • Tamanho atual: {format_size(total_size)}")
    print(f"   • Tamanho pós-WebP: {format_size(new_total)}")
    print(f"   • Economia: {format_size(estimated_savings)} (-{(estimated_savings/total_size)*100:.1f}%)")
    
    return {
        "total_images": len(images),
        "total_size": total_size,
        "critical_images": critical_images,
        "large_images": large_images,
        "estimated_savings": estimated_savings,
        "estimated_new_size": new_total
    }

def analyze_videos():
    """Analisa todos os vídeos do projeto"""
    print("\n🎥 ANÁLISE DE VÍDEOS:")
    
    public_dir = Path("public")
    videos = []
    total_size = 0
    
    # Buscar vídeos
    for pattern in ["*.mp4", "*.webm", "*.mov", "*.avi"]:
        for video_file in public_dir.glob(pattern):
            size = get_file_size(video_file)
            total_size += size
            
            # Detectar vídeos corrompidos (muito pequenos)
            is_corrupted = size < 1024  # < 1KB provavelmente corrompido
            
            videos.append({
                "name": video_file.name,
                "path": str(video_file),
                "size_bytes": size,
                "size_formatted": format_size(size),
                "is_corrupted": is_corrupted,
                "status": "❌ CORROMPIDO" if is_corrupted else "✅ OK"
            })
    
    print(f"\n📊 Total de vídeos: {len(videos)}")
    print(f"📊 Tamanho total: {format_size(total_size)}")
    
    corrupted_videos = [v for v in videos if v["is_corrupted"]]
    healthy_videos = [v for v in videos if not v["is_corrupted"]]
    
    print(f"\n❌ VÍDEOS CORROMPIDOS: {len(corrupted_videos)}")
    for video in corrupted_videos:
        print(f"   • {video['name']}: {video['size_formatted']} {video['status']}")
    
    print(f"\n✅ VÍDEOS SAUDÁVEIS: {len(healthy_videos)}")
    for video in healthy_videos:
        print(f"   • {video['name']}: {video['size_formatted']}")
    
    return {
        "total_videos": len(videos),
        "total_size": total_size,
        "corrupted_videos": corrupted_videos,
        "healthy_videos": healthy_videos
    }

def generate_optimization_plan():
    """Gera plano detalhado de otimização"""
    print("\n📋 PLANO DE OTIMIZAÇÃO - FASE 3:")
    
    image_analysis = analyze_images()
    video_analysis = analyze_videos()
    
    # Prioridades
    print(f"\n🎯 PRIORIDADES DE OTIMIZAÇÃO:")
    
    print(f"\n1. 🔴 IMAGENS CRÍTICAS (MÁXIMA PRIORIDADE)")
    for img in image_analysis["critical_images"]:
        print(f"   → {img['name']} ({img['size_formatted']})")
    
    print(f"\n2. 🎥 VÍDEOS CORROMPIDOS (ALTA PRIORIDADE)")
    for video in video_analysis["corrupted_videos"]:
        print(f"   → {video['name']} (corrigir/substituir)")
    
    print(f"\n3. 🟡 IMAGENS GRANDES (MÉDIA PRIORIDADE)")
    for img in image_analysis["large_images"]:
        print(f"   → {img['name']} ({img['size_formatted']})")
    
    # Instruções específicas
    print(f"\n🛠️ INSTRUÇÕES DE IMPLEMENTAÇÃO:")
    
    print(f"\n📋 PASSO 1 - Converter Imagens Críticas para WebP:")
    print(f"   1. Acesse https://squoosh.app/")
    print(f"   2. Para cada imagem crítica:")
    
    for img in image_analysis["critical_images"]:
        print(f"      • Upload {img['name']}")
        print(f"        - Formato: WebP")
        print(f"        - Qualidade: 80-85%")
        print(f"        - Salvar como: {img['name'].replace('.png', '.webp')}")
    
    print(f"\n📋 PASSO 2 - Implementar ResponsiveImage:")
    print(f"   • Substituir LazyImage por ResponsiveImage nos componentes")
    print(f"   • Configurar src + webpSrc para cada imagem")
    
    print(f"\n📋 PASSO 3 - Corrigir Vídeos:")
    print(f"   • Verificar CDN fallbacks")
    print(f"   • Substituir arquivos corrompidos")
    
    # Salvar relatório
    report = {
        "timestamp": datetime.now().isoformat(),
        "phase": "3",
        "image_analysis": image_analysis,
        "video_analysis": video_analysis,
        "optimization_plan": {
            "critical_images": len(image_analysis["critical_images"]),
            "corrupted_videos": len(video_analysis["corrupted_videos"]),
            "estimated_savings_mb": image_analysis["estimated_savings"] / (1024 * 1024),
            "estimated_savings_percent": (image_analysis["estimated_savings"] / image_analysis["total_size"]) * 100
        }
    }
    
    with open("../asset_analysis_phase3.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 Relatório salvo em: asset_analysis_phase3.json")
    
    return report

if __name__ == "__main__":
    print("🚀 ANÁLISE DE ASSETS - FASE 3")
    print("=" * 50)
    print(f"📅 Data: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    generate_optimization_plan() 