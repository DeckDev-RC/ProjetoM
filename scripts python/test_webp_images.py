import os
from pathlib import Path
from PIL import Image

def test_webp_images():
    """Testa se as imagens WebP estão válidas"""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    webp_dir = project_root / "public" / "webp"
    
    if not webp_dir.exists():
        print(f"Diretório WebP não encontrado: {webp_dir}")
        return
    
    webp_files = list(webp_dir.glob("*.webp"))
    
    if not webp_files:
        print("Nenhum arquivo WebP encontrado")
        return
    
    print(f"Testando {len(webp_files)} imagens WebP:")
    
    valid_images = 0
    invalid_images = 0
    
    for webp_file in webp_files:
        try:
            with Image.open(webp_file) as img:
                # Verificar se a imagem pode ser carregada
                img.verify()
                
                # Reabrir para obter informações
                with Image.open(webp_file) as img2:
                    width, height = img2.size
                    mode = img2.mode
                    format_name = img2.format
                    
                print(f"✓ {webp_file.name}: {width}x{height}, {mode}, {format_name}")
                valid_images += 1
                
        except Exception as e:
            print(f"✗ {webp_file.name}: ERRO - {e}")
            invalid_images += 1
    
    print(f"\nResumo:")
    print(f"  Válidas: {valid_images}")
    print(f"  Inválidas: {invalid_images}")
    print(f"  Total: {len(webp_files)}")
    
    if invalid_images > 0:
        print(f"\n⚠️  {invalid_images} imagens com problemas encontradas!")
    else:
        print(f"\n✅ Todas as imagens WebP estão válidas!")

if __name__ == "__main__":
    test_webp_images() 