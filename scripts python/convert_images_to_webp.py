import os
from pathlib import Path
from PIL import Image, ImageOps
import subprocess

def check_pillow_installed():
    """Verifica se o Pillow está instalado"""
    try:
        import PIL
        return True
    except ImportError:
        return False

def install_pillow():
    """Instala o Pillow se não estiver disponível"""
    try:
        subprocess.run(['pip', 'install', 'Pillow'], check=True)
        print("✓ Pillow instalado com sucesso")
        return True
    except subprocess.CalledProcessError:
        print("✗ Erro ao instalar Pillow")
        return False

def convert_to_webp(input_path, output_path, quality=85):
    """Converte uma imagem para WebP"""
    try:
        with Image.open(input_path) as img:
            # Corrigir orientação baseada nos dados EXIF
            img = ImageOps.exif_transpose(img)
            
            # Converter para RGB se necessário (WebP não suporta RGBA em alguns casos)
            if img.mode in ('RGBA', 'LA'):
                # Manter transparência
                img.save(output_path, 'WebP', quality=quality, lossless=False)
            else:
                # Converter para RGB
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(output_path, 'WebP', quality=quality, optimize=True)
        
        print(f"✓ Convertido: {input_path.name} -> {output_path.name}")
        return True
    except Exception as e:
        print(f"✗ Erro ao converter {input_path.name}: {e}")
        return False

def get_file_size(path):
    """Retorna o tamanho do arquivo em bytes"""
    return path.stat().st_size

def format_size(size_bytes):
    """Formata o tamanho em bytes para formato legível"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024**2:
        return f"{size_bytes/1024:.1f} KB"
    elif size_bytes < 1024**3:
        return f"{size_bytes/(1024**2):.1f} MB"
    else:
        return f"{size_bytes/(1024**3):.1f} GB"

def main():
    # Verificar se Pillow está instalado
    if not check_pillow_installed():
        print("Pillow não encontrado. Instalando...")
        if not install_pillow():
            print("Erro: Não foi possível instalar o Pillow")
            return
        # Reimportar após instalação
        from PIL import Image, ImageOps
    
    # Diretório público do projeto
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    public_dir = project_root / "public"
    webp_dir = public_dir / "webp"
    
    # Verificar se o diretório public existe
    if not public_dir.exists():
        print(f"Erro: Diretório public não encontrado em {public_dir}")
        return
    
    # Criar diretório webp se não existir
    webp_dir.mkdir(exist_ok=True)
    
    # Extensões de imagem suportadas
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif']
    
    # Encontrar todas as imagens no diretório público
    images = []
    for ext in image_extensions:
        images.extend(public_dir.glob(f"**/*{ext}"))
        images.extend(public_dir.glob(f"**/*{ext.upper()}"))
    
    if not images:
        print("Nenhuma imagem encontrada para converter.")
        return
    
    print(f"Encontradas {len(images)} imagens para converter:")
    
    # Converter cada imagem
    converted = 0
    total_original_size = 0
    total_webp_size = 0
    
    for image in images:
        # Pular se já for WebP
        if image.suffix.lower() == '.webp':
            continue
            
        # Nome do arquivo WebP
        webp_name = image.stem + '.webp'
        webp_path = webp_dir / webp_name
        
        # Tamanho original
        original_size = get_file_size(image)
        total_original_size += original_size
        
        print(f"\nConvertendo: {image.name} ({format_size(original_size)})")
        
        if convert_to_webp(image, webp_path):
            converted += 1
            # Tamanho após conversão
            webp_size = get_file_size(webp_path)
            total_webp_size += webp_size
            reduction = ((original_size - webp_size) / original_size) * 100
            print(f"  Novo tamanho: {format_size(webp_size)} (redução: {reduction:.1f}%)")
    
    # Relatório final
    print(f"\n✓ Conversão concluída:")
    print(f"  - {converted} imagens convertidas com sucesso")
    print(f"  - Total processado: {converted}/{len(images)}")
    
    if total_original_size > 0:
        total_reduction = ((total_original_size - total_webp_size) / total_original_size) * 100
        print(f"  - Tamanho original total: {format_size(total_original_size)}")
        print(f"  - Tamanho WebP total: {format_size(total_webp_size)}")
        print(f"  - Redução total: {format_size(total_original_size - total_webp_size)} ({total_reduction:.1f}%)")
    
    print(f"Arquivos WebP salvos em: {webp_dir}")

if __name__ == "__main__":
    main() 