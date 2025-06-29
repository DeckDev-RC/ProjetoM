import React, { useState, useRef, useEffect } from 'react';

interface LazyVideoProps {
  src: string[];
  poster?: string;
  className?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  title?: string;
  'aria-label'?: string;
  onLoadedData?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onCanPlay?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

// Função para detectar o tipo MIME correto baseado na extensão
const getMimeType = (src: string): string => {
  const extension = src.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'webm':
      return 'video/webm';
    case 'mp4':
      return 'video/mp4';
    case 'ogg':
    case 'ogv':
      return 'video/ogg';
    case 'avi':
      return 'video/x-msvideo';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'video/mp4'; // fallback
  }
};

// Detectar se é dispositivo mobile com detecção mais robusta
const isMobile = (): boolean => {
  // Verificar user agent
  const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Verificar largura da tela
  const screenWidthCheck = window.innerWidth <= 768;
  
  // Verificar se tem touch
  const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Verificar orientation API (disponível principalmente em mobile)
  const orientationCheck = 'orientation' in window;
  
  // Dispositivo é considerado mobile se atender a pelo menos 2 critérios
  const checks = [userAgentCheck, screenWidthCheck, touchCheck, orientationCheck];
  const trueChecks = checks.filter(Boolean).length;
  
  return trueChecks >= 2;
};

const LazyVideo: React.FC<LazyVideoProps> = ({ 
  src,
  poster,
  className = '',
  width,
  height,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  title,
  'aria-label': ariaLabel,
  onLoadedData,
  onCanPlay,
  onError
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playAttempted, setPlayAttempted] = useState(false);
  const [waitingForInteraction, setWaitingForInteraction] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobile = isMobile();

  useEffect(() => {
    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setIsLoading(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    } catch (error) {
      // Fallback: mostrar vídeo imediatamente se IntersectionObserver não for suportado
      console.warn('IntersectionObserver não suportado, carregando vídeo imediatamente:', error);
      setIsInView(true);
      setIsLoading(true);
    }
  }, []);

  // Função para tentar reproduzir o vídeo
  const attemptPlay = async (video: HTMLVideoElement): Promise<boolean> => {
    try {
      // Configurar propriedades essenciais para mobile
      video.muted = true;
      video.playsInline = true;
      
      // Configurações específicas para mobile
      if (mobile) {
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        // NUNCA mostrar controles no mobile
        video.controls = false;
        video.removeAttribute('controls');
      }
      
      await video.play();
      setIsLoading(false);
      setPlayAttempted(true);
      setWaitingForInteraction(false);
      return true;
    } catch (error) {
      console.warn('Tentativa de autoplay falhou:', error);
      setIsLoading(false);
      
      // No mobile, nunca mostrar controles, apenas marcar que está esperando interação
      if (mobile && autoPlay) {
        setWaitingForInteraction(true);
        video.controls = false;
        video.removeAttribute('controls');
      } else if (!mobile && controls) {
        // Apenas no desktop, se controles foram explicitamente solicitados
        video.controls = true;
      }
      
      return false;
    }
  };

  // Tentar reproduzir o vídeo quando ele carrega
  useEffect(() => {
    if (isInView && videoRef.current && autoPlay && !playAttempted) {
      const video = videoRef.current;
      
      const tryPlay = async () => {
        await attemptPlay(video);
      };

      // Tentar reproduzir quando o vídeo estiver pronto
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        tryPlay();
      } else {
        video.addEventListener('canplay', tryPlay, { once: true });
        video.addEventListener('loadeddata', tryPlay, { once: true });
        video.addEventListener('loadedmetadata', tryPlay, { once: true });
      }
    }
  }, [isInView, autoPlay, playAttempted]);

  // Adicionar listeners para interação do usuário no mobile
  useEffect(() => {
    if (!mobile || !waitingForInteraction || !videoRef.current) return;

    const video = videoRef.current;
    
    const handleUserInteraction = async () => {
      if (video && !playAttempted) {
        const success = await attemptPlay(video);
        if (success) {
          // Remover listeners após sucesso
          document.removeEventListener('touchstart', handleUserInteraction);
          document.removeEventListener('click', handleUserInteraction);
          window.removeEventListener('scroll', handleUserInteraction);
        }
      }
    };

    // Adicionar listeners para primeira interação do usuário
    document.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('scroll', handleUserInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };
  }, [waitingForInteraction, mobile, playAttempted]);

  // Tentar reproduzir periodicamente no mobile se ainda não conseguiu
  useEffect(() => {
    if (!mobile || !waitingForInteraction || playAttempted) return;

    const retryInterval = setInterval(async () => {
      if (videoRef.current) {
        const success = await attemptPlay(videoRef.current);
        if (success) {
          clearInterval(retryInterval);
        }
      }
    }, 2000); // Tentar a cada 2 segundos

    // Limpar após 30 segundos para não ficar tentando infinitamente
    const timeout = setTimeout(() => {
      clearInterval(retryInterval);
      setWaitingForInteraction(false);
    }, 30000);

    return () => {
      clearInterval(retryInterval);
      clearTimeout(timeout);
    };
  }, [waitingForInteraction, mobile, playAttempted]);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.warn('Erro ao carregar vídeo:', e.currentTarget.src);
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError(e);
    }
  };

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsLoading(false);
    if (onLoadedData) {
      onLoadedData(e);
    }
  };

  const handleCanPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsLoading(false);
    
    // Tentar reproduzir automaticamente quando o vídeo estiver pronto
    if (autoPlay && !playAttempted) {
      const video = e.currentTarget;
      attemptPlay(video);
    }
    
    if (onCanPlay) {
      onCanPlay(e);
    }
  };

  const createPlaceholder = () => (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}>
      <div className="text-center text-gray-400">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </div>
        <p className="text-sm font-medium">
          {isLoading ? 'Carregando vídeo...' : 'Carregando...'}
        </p>
        {mobile && waitingForInteraction && (
          <p className="text-xs text-gray-500 mt-2">
            Toque na tela para iniciar
          </p>
        )}
      </div>
    </div>
  );

  if (hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}>
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900 flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <p className="text-sm font-medium">Vídeo indisponível</p>
          <p className="text-xs text-gray-500 mt-1">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  // Função para lidar com clique/toque no vídeo (apenas para tentar reproduzir)
  const handleVideoInteraction = async () => {
    if (videoRef.current && autoPlay) {
      await attemptPlay(videoRef.current);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!isInView ? (
        createPlaceholder()
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          width={width}
          height={height}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={mobile ? false : controls} // Nunca mostrar controles no mobile
          title={title}
          aria-label={ariaLabel}
          poster={poster}
          preload="auto"
          webkit-playsinline="true"
          onClick={handleVideoInteraction}
          onTouchStart={handleVideoInteraction}
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onError={handleError}
        >
          {src.map((source, index) => (
            <source 
              key={index} 
              src={source} 
              type={getMimeType(source)}
            />
          ))}
          {/* Fallback para navegadores muito antigos */}
          <p className="text-center text-gray-400 p-4">
            Seu navegador não suporta o elemento de vídeo.
            <br />
            <a href={src[0]} className="text-blue-400 underline">
              Clique aqui para baixar o vídeo
            </a>
          </p>
        </video>
      )}
    </div>
  );
};

export default LazyVideo; 