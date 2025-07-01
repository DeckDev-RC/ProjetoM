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
  
  // Tamanho do card responsivo - otimizado para Galaxy A55 e outros mobiles
  const cardSize = useResponsiveValue({
    'mobile-xs': { 
      height: 'min-h-[450px]', 
      fontSize: 'text-lg', 
      padding: 'p-6', 
      descriptionSize: 'text-sm', 
      featuresSize: 'text-xs', 
      imageTop: 'top-16', 
      headerHeight: 'h-12', 
      textTop: 'top-4',
      backHeight: 'min-h-[450px]'
    },
    'mobile-sm': { 
      height: 'min-h-[500px]', 
      fontSize: 'text-xl', 
      padding: 'p-6', 
      descriptionSize: 'text-sm', 
      featuresSize: 'text-xs', 
      imageTop: 'top-18', 
      headerHeight: 'h-12', 
      textTop: 'top-4',
      backHeight: 'min-h-[500px]'
    },
    'mobile-md': { 
      height: 'min-h-[550px]', 
      fontSize: 'text-xl', 
      padding: 'p-7', 
      descriptionSize: 'text-base', 
      featuresSize: 'text-sm', 
      imageTop: 'top-20', 
      headerHeight: 'h-14', 
      textTop: 'top-5',
      backHeight: 'min-h-[550px]'
    },
    'tablet-sm': { 
      height: 'min-h-[600px]', 
      fontSize: 'text-2xl', 
      padding: 'p-8', 
      descriptionSize: 'text-base', 
      featuresSize: 'text-sm', 
      imageTop: 'top-22', 
      headerHeight: 'h-16', 
      textTop: 'top-6',
      backHeight: 'min-h-[600px]'
    },
    'tablet-md': { 
      height: 'min-h-[650px]', 
      fontSize: 'text-2xl', 
      padding: 'p-8', 
      descriptionSize: 'text-base', 
      featuresSize: 'text-sm', 
      imageTop: 'top-24', 
      headerHeight: 'h-16', 
      textTop: 'top-6',
      backHeight: 'min-h-[650px]'
    },
    'tablet-lg': { 
      height: 'min-h-[650px]', 
      fontSize: 'text-2xl', 
      padding: 'p-8', 
      descriptionSize: 'text-base', 
      featuresSize: 'text-sm', 
      imageTop: 'top-24', 
      headerHeight: 'h-16', 
      textTop: 'top-6',
      backHeight: 'min-h-[650px]'
    },
    'desktop': { 
      height: 'min-h-[700px]', 
      fontSize: 'text-2xl', 
      padding: 'p-8', 
      descriptionSize: 'text-base', 
      featuresSize: 'text-sm', 
      imageTop: 'top-24', 
      headerHeight: 'h-16', 
      textTop: 'top-6',
      backHeight: 'min-h-[700px]'
    }
  }, { 
    height: 'min-h-[700px]', 
    fontSize: 'text-2xl', 
    padding: 'p-8', 
    descriptionSize: 'text-base', 
    featuresSize: 'text-sm', 
    imageTop: 'top-24', 
    headerHeight: 'h-16', 
    textTop: 'top-6',
    backHeight: 'min-h-[700px]'
  });
  
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
        "relative group cursor-pointer w-full",
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
          className={`relative rounded-[30px] ${cardSize.height} w-full transition-all duration-700 hover:scale-[1.02]`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: deviceInfo.isMobile ? '450px' : '600px'
          }}
        >
          {/* Frente do card com borda RGB */}
          <div 
            className={`absolute inset-0 rounded-[30px] w-full ${cardSize.height} p-[0.5px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700`}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              opacity: isFlipped ? 0 : 1,
              visibility: isFlipped ? 'hidden' : 'visible'
            }}
          >
            <div 
              className={`w-full ${cardSize.height} rounded-[28px] relative overflow-hidden`}
              style={{ 
                backgroundColor: bgColors[index]
              }}
            >
              {/* Área escura do cabeçalho */}
              <div className={`absolute top-0 left-0 right-0 ${cardSize.headerHeight} z-10`} style={{ backgroundColor: bgColors[index] }} />
              
              {/* Imagem posicionada responsivamente - usando flex para melhor controle */}
              <div className={`absolute ${cardSize.imageTop} left-0 right-0 bottom-0 flex items-end justify-center`}>
                <ResponsiveImage 
                  src={images[index]} 
                  webpSrc={images[index].replace('.png', '.webp')}
                  alt={title} 
                  className="w-full h-full object-cover object-center"
                  style={{ 
                    objectPosition: 'center bottom',
                    maxHeight: '100%',
                    height: 'auto'
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Overlay com gradiente para melhor legibilidade do texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Texto sobreposto - posicionamento melhorado */}
              <div className={`absolute ${cardSize.textTop} left-4 right-4 z-20 text-center`}>
                <h3 
                  className={`${cardSize.fontSize} font-bold text-white leading-tight drop-shadow-lg`}
                  style={{ 
                    fontFamily: 'Brockmann, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {title}
                </h3>
              </div>
            </div>
          </div>

          {/* Verso do card - altura automática com padding adequado */}
          <div 
            className={`absolute inset-0 rounded-[30px] w-full ${cardSize.backHeight} bg-gradient-to-br from-gray-900 via-gray-800 to-black ${cardSize.padding} transition-all duration-700`}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              opacity: isFlipped ? 1 : 0,
              visibility: isFlipped ? 'visible' : 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: deviceInfo.isMobile ? '2rem' : '3rem'
            }}
          >
            {/* Título do verso */}
            <h3 
              className={`${cardSize.fontSize} font-bold text-white mb-4 text-center leading-tight`}
              style={{ fontFamily: 'Brockmann, sans-serif' }}
            >
              {title}
            </h3>
            
            {/* Descrição */}
            <p className={`text-gray-300 ${cardSize.descriptionSize} leading-relaxed mb-6 text-center font-sans max-w-none`}>
              {description}
            </p>
            
            {/* Lista de recursos - layout flexível */}
            <div className="space-y-3 w-full flex-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <p className={`text-gray-200 ${cardSize.featuresSize} font-sans leading-relaxed flex-1`}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Indicador de clique - posicionamento relativo */}
            <div className="mt-4 text-gray-500 text-xs text-center">
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
    <section className="w-full py-8 sm:py-12 relative overflow-hidden" id="features" ref={sectionRef}>
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
        
        {/* Image Cards Section - layout melhorado */}
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
              
              /* Melhoramentos específicos para Galaxy A55 e similares */
              @media screen and (max-width: 768px) and (min-height: 600px) {
                .mobile-card-container {
                  min-height: 480px;
                }
              }
              
              @media screen and (max-width: 480px) {
                .mobile-card-container {
                  min-height: 450px;
                  padding: 1rem;
                }
              }
            `
          }} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-2 sm:px-4 md:px-12">
            {[0, 1, 2].map((index) => (
              <div key={index} className="mobile-card-container">
                <ImageCard
                  imageSrc=""
                  index={index}
                  isActive={activeCardIndex === index}
                  onMouseEnter={() => setActiveCardIndex(index)}
                  onMouseLeave={() => setActiveCardIndex(null)}
                  position={getCardPosition(index)}
                  activeIndex={activeCardIndex}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
