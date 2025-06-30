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

// Detectar se é dispositivo mobile - versão otimizada
const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobile = isMobile();

  useEffect(() => {
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
  }, []);

  // Função simplificada para tentar reproduzir o vídeo
  const attemptPlay = async (video: HTMLVideoElement): Promise<boolean> => {
    try {
      video.muted = true;
      video.playsInline = true;
      
      if (mobile) {
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        video.controls = false;
        video.removeAttribute('controls');
      }
      
      await video.play();
      setIsLoading(false);
      setPlayAttempted(true);
      return true;
    } catch (error) {
      console.warn('Tentativa de autoplay falhou:', error);
      setIsLoading(false);
      
      if (!mobile && controls) {
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

      if (video.readyState >= 3) {
        tryPlay();
      } else {
        video.addEventListener('canplay', tryPlay, { once: true });
      }
    }
  }, [isInView, autoPlay, playAttempted]);

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

  const handleVideoInteraction = async () => {
    if (videoRef.current && autoPlay && !playAttempted) {
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
          controls={mobile ? false : controls}
          title={title}
          aria-label={ariaLabel}
          poster={poster}
          preload="metadata"
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