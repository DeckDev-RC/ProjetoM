import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDeviceDetection } from "@/hooks/use-mobile";
import { useResponsiveValue, useResponsiveAnimation } from "@/hooks/useResponsiveUtils";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useTranslation } from "react-i18next";

interface ImageCardProps {
  imageSrc: string;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  position: 'left' | 'center' | 'right' | null;
  activeIndex: number | null;
}

const ImageCard = ({ 
  imageSrc, 
  index, 
  isActive, 
  onMouseEnter, 
  onMouseLeave,
  position,
  activeIndex
}: ImageCardProps) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Usar hooks de responsividade
  const deviceInfo = useDeviceDetection();
  const animation = useResponsiveAnimation();
  
  // Tamanho do card responsivo - menor para mobile
  const cardSize = useResponsiveValue({
    'mobile-xs': { height: 'h-[400px]', fontSize: 'text-lg', padding: 'p-4', descriptionSize: 'text-sm', featuresSize: 'text-xs', imageTop: 'top-12', headerHeight: 'h-8', textTop: 'top-3' },
    'mobile-sm': { height: 'h-[450px]', fontSize: 'text-xl', padding: 'p-5', descriptionSize: 'text-sm', featuresSize: 'text-xs', imageTop: 'top-14', headerHeight: 'h-8', textTop: 'top-3' },
    'mobile-md': { height: 'h-[500px]', fontSize: 'text-xl', padding: 'p-6', descriptionSize: 'text-base', featuresSize: 'text-sm', imageTop: 'top-16', headerHeight: 'h-9', textTop: 'top-4' },
    'tablet-sm': { height: 'h-[550px]', fontSize: 'text-2xl', padding: 'p-7', descriptionSize: 'text-base', featuresSize: 'text-sm', imageTop: 'top-18', headerHeight: 'h-10', textTop: 'top-4' },
    'tablet-md': { height: 'h-[600px]', fontSize: 'text-2xl', padding: 'p-8', descriptionSize: 'text-base', featuresSize: 'text-sm', imageTop: 'top-20', headerHeight: 'h-10', textTop: 'top-5' },
    'tablet-lg': { height: 'h-[600px]', fontSize: 'text-2xl', padding: 'p-8', descriptionSize: 'text-base', featuresSize: 'text-sm', imageTop: 'top-20', headerHeight: 'h-10', textTop: 'top-5' },
    'desktop': { height: 'h-[600px]', fontSize: 'text-2xl', padding: 'p-8', descriptionSize: 'text-base', featuresSize: 'text-sm', imageTop: 'top-20', headerHeight: 'h-10', textTop: 'top-5' }
  }, { height: 'h-[600px]', fontSize: 'text-2xl', padding: 'p-8', descriptionSize: 'text-base', featuresSize: 'text-sm', imageTop: 'top-20', headerHeight: 'h-10', textTop: 'top-5' });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  // Títulos e conteúdo baseados no índice usando traduções
  const agentKeys = ['sales', 'support', 'process'] as const;
  const agentKey = agentKeys[index];
  
  const title = t(`features.agents.${agentKey}.title`);
  const description = t(`features.agents.${agentKey}.description`);
  const features = t(`features.agents.${agentKey}.features`, { returnObjects: true }) as string[];

  // Imagens para cada card
  const images = [
    "/webp/vendas.webp",
    "/webp/atendimento.webp",
    "/webp/processos.webp"
  ];

  // Cores de fundo para cada card
  const bgColors = [
    "#000000FF", // Preto para Apple Intelligence
    "#000000FF", // Azul para Câmeras
    "#000000FF"  // Marrom para Chip e Bateria
  ];
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative group cursor-pointer",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        animationDelay: `${animation.delay * index}ms`,
        transition: `opacity ${animation.duration} ${animation.easing}`
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
        {/* Container com flip effect */}
        <div 
          className={`relative rounded-[30px] ${cardSize.height} transition-all duration-700 hover:scale-[1.02]`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Frente do card com borda RGB */}
          <div 
            className="absolute inset-0 overflow-hidden rounded-[30px] w-full h-full p-[0.5px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              opacity: isFlipped ? 0 : 1,
              visibility: isFlipped ? 'hidden' : 'visible'
            }}
          >
            <div 
              className="w-full h-full overflow-hidden rounded-[28px]"
              style={{ 
                backgroundColor: bgColors[index]
              }}
            >
                            {/* Área escura do cabeçalho */}
              <div className={`absolute top-0 left-0 right-0 ${cardSize.headerHeight} z-10`} style={{ backgroundColor: bgColors[index] }} />
              
              {/* Imagem posicionada responsivamente */}
              <div className={`absolute ${cardSize.imageTop} left-0 right-0 bottom-0`}>
              <ResponsiveImage 
                src={images[index]} 
                webpSrc={images[index].replace('.png', '.webp')}
                alt={title} 
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              </div>
              
              {/* Overlay com gradiente para melhor legibilidade do texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Texto sobreposto */}
              <div className={`absolute ${cardSize.textTop} left-4 right-4 z-20 text-center`}>
                              <h3 
                className={`${cardSize.fontSize} font-bold text-white leading-tight`}
                style={{ fontFamily: 'Brockmann, sans-serif' }}
              >
                {title}
              </h3>
              </div>
            </div>
          </div>

          {/* Verso do card */}
          <div 
            className={`absolute inset-0 overflow-hidden rounded-[30px] w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black ${cardSize.padding} flex flex-col justify-center transition-all duration-700`}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              opacity: isFlipped ? 1 : 0,
              visibility: isFlipped ? 'visible' : 'hidden'
            }}
          >
            {/* Título do verso */}
            <h3 
              className={`${cardSize.fontSize} font-bold text-white mb-4 text-center`}
              style={{ fontFamily: 'Brockmann, sans-serif' }}
            >
              {title}
            </h3>
            
            {/* Descrição */}
            <p className={`text-gray-300 ${cardSize.descriptionSize} leading-relaxed mb-6 text-center font-sans`}>
              {description}
            </p>
            
            {/* Lista de recursos */}
            <div className="space-y-2">
              {features.map((feature, idx) => (
                <p key={idx} className={`text-gray-200 ${cardSize.featuresSize} font-sans`}>
                  {feature}
                </p>
              ))}
            </div>
            
            {/* Indicador de clique */}
            <div className="absolute bottom-4 right-4 text-gray-500 text-xs">
              {t('features.clickToFlip')}
            </div>
          </div>
        </div>
    </div>
  );
};

const Features = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  
  // Usar hooks de responsividade
  const deviceInfo = useDeviceDetection();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Determinar a posição de cada card (esquerda, centro, direita)
  const getCardPosition = (idx: number): 'left' | 'center' | 'right' | null => {
    // Para layout mobile (1 coluna)
    if (deviceInfo.isMobile) {
      return null;
    }
    
    // Para layout desktop (3 colunas)
    if (idx === 0) return 'left';
    if (idx === 1) return 'center';
    if (idx === 2) return 'right';
    return null;
  };
  
  return (
        <section className="w-full py-6 sm:py-10 relative overflow-hidden" id="features" ref={sectionRef}>
     
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center relative z-10">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16 w-full">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-900/50 text-violet-300 border border-violet-700/50 backdrop-blur-sm">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2 font-sans">04</span>
              <span className="font-sans">{t('features.badge')}</span>
            </div>
          </div>
                      <div className="flex-1 h-[1px] bg-violet-700/60"></div>
        </div>

        {/* Main content */}
        <div className="max-w-5xl text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-8 sm:mb-12 text-white">
            {t('features.title')}<br />
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradientFlow 3s ease-in-out infinite'
              }}
            >
              {t('features.titleGradient')}
            </span>
          </h2>
        </div>
        
        {/* Image Cards Section */}
        <div className="w-full mt-1">
          
          <style dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Brockmann';
                src: url('/brockmann-medium-webfont.ttf') format('truetype');
                font-weight: 500;
                font-style: normal;
                font-display: swap;
              }
              
              @keyframes gradientFlow {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
            `
          }} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4 md:px-12">
            {[0, 1, 2].map((index) => (
              <ImageCard
                key={index}
                imageSrc=""
                index={index}
                isActive={activeCardIndex === index}
                onMouseEnter={() => setActiveCardIndex(index)}
                onMouseLeave={() => setActiveCardIndex(null)}
                position={getCardPosition(index)}
                activeIndex={activeCardIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
