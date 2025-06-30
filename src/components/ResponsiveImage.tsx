import React, { useState, useRef, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  srcSet?: string;
  webpSrcSet?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  style?: React.CSSProperties;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
  src,
  webpSrc,
  alt,
  className = '',
  width,
  height,
  sizes,
  srcSet,
  webpSrcSet,
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  style
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Determinar qual imagem usar
  const getImageSrc = () => {
    // Se há webpSrc, usar ele primeiro
    if (webpSrc && !hasError) {
      return webpSrc;
    }
    // Fallback para src original
    return src;
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <img
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        width={width}
        height={height}
        aria-hidden="true"
      />
      
      {/* Imagem responsiva */}
      {isInView && (
        <picture>
          {/* WebP version - apenas se webpSrc for fornecido e não houve erro */}
          {webpSrc && !hasError && (
            <source
              srcSet={webpSrcSet || webpSrc}
              sizes={sizes}
              type="image/webp"
            />
          )}
          
          {/* Imagem principal */}
          <img
            src={getImageSrc()}
            srcSet={srcSet}
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={style}
            onLoad={handleLoad}
            onError={handleError}
            width={width}
            height={height}
            loading={loading}
          />
        </picture>
      )}
    </div>
  );
};

export default ResponsiveImage; 