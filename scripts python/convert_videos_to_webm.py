import os
import subprocess
from pathlib import Path

def check_video_integrity(video_path):
    """Verifica se o vídeo está íntegro"""
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(video_path)]
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError:
        return False

def convert_to_webm(input_path, output_path):
    """Converte um vídeo para WebM usando FFmpeg"""
    cmd = [
        'ffmpeg',
        '-i', input_path,
        '-c:v', 'libvpx-vp9',
        '-crf', '30',
        '-b:v', '1M',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-y',  # Sobrescrever arquivo se existir
        output_path
    ]
    
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"✓ Convertido: {input_path} -> {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Erro ao converter {input_path}")
        print(f"Código de saída: {e.returncode}")
        print(f"Erro: {e.stderr}")
        return False

def main():
    # Diretório público do projeto - caminho absoluto
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    public_dir = project_root / "public"
    webm_dir = public_dir / "webm"
    
    # Verificar se o diretório public existe
    if not public_dir.exists():
        print(f"Erro: Diretório public não encontrado em {public_dir}")
        return
    
    # Criar diretório webm se não existir
    webm_dir.mkdir(exist_ok=True)
    
    # Extensões de vídeo suportadas
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv']
    
    # Encontrar todos os vídeos no diretório público
    videos = []
    for ext in video_extensions:
        videos.extend(public_dir.glob(f"**/*{ext}"))
    
    if not videos:
        print("Nenhum vídeo encontrado para converter.")
        return
    
    print(f"Encontrados {len(videos)} vídeos para verificar:")
    
    # Verificar integridade e converter vídeos válidos
    converted = 0
    corrupted = 0
    
    for video in videos:
        print(f"\nVerificando: {video.name}")
        
        if not check_video_integrity(video):
            print(f"⚠️  Vídeo corrompido, pulando: {video.name}")
            corrupted += 1
            continue
        
        # Nome do arquivo WebM
        webm_name = video.stem + '.webm'
        webm_path = webm_dir / webm_name
        
        print(f"Convertendo: {video.name}")
        if convert_to_webm(str(video), str(webm_path)):
            converted += 1
    
    print(f"\n✓ Conversão concluída:")
    print(f"  - {converted} vídeos convertidos com sucesso")
    print(f"  - {corrupted} vídeos corrompidos pulados")
    print(f"  - Total processado: {converted + corrupted}/{len(videos)}")
    print(f"Arquivos WebM salvos em: {webm_dir}")

if __name__ == "__main__":
    main() 