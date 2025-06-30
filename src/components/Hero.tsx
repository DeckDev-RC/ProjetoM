import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useDeviceDetection } from "@/hooks/use-mobile";
import { useResponsivePadding, useResponsiveValue } from "@/hooks/useResponsiveUtils";
import LazyVideo from "@/components/LazyVideo";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Usar hooks de responsividade
  const deviceInfo = useDeviceDetection();
  const padding = useResponsivePadding('hero');
  
  // Tamanho do card responsivo - simplificado
  const cardSize = useResponsiveValue({
    'mobile-xs': { maxWidth: 'max-w-[240px]', height: 'h-[320px]' },
    'mobile-sm': { maxWidth: 'max-w-[280px]', height: 'h-[360px]' },
    'mobile-md': { maxWidth: 'max-w-[320px]', height: 'h-[400px]' },
    'tablet-sm': { maxWidth: 'max-w-sm', height: 'h-[480px]' },
    'tablet-md': { maxWidth: 'max-w-md', height: 'h-[600px]' },
    'tablet-lg': { maxWidth: 'max-w-md', height: 'h-[600px]' },
    'desktop': { maxWidth: 'max-w-md', height: 'h-[600px]' }
  }, { maxWidth: 'max-w-md', height: 'h-[600px]' });
  
  return (
    <section 
      className="overflow-hidden relative bg-gray-950" 
      id="hero" 
      style={{ padding }}
    >
      {/* Background estático otimizado */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)',
          }}
        />
        {/* Gradiente de baixo para cima - preto para transparente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2">
                    <div 
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pulse-900/50 text-pulse-300 border border-pulse-700 mb-3 sm:mb-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2 font-sans">01</span>
              <span className="font-sans">{t('hero.badge')}</span>
            </div>
            
            <h1 
              className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight opacity-0 animate-fade-in text-white font-display" 
              style={{ animationDelay: "0.3s" }}
            >
              {t('hero.title')}<br className="sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                {t('hero.titleGradient')}
              </span>
            </h1>
            
            <p 
              style={{ animationDelay: "0.5s" }} 
              className="section-subtitle mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed opacity-0 animate-fade-in text-gray-300 font-normal text-base sm:text-lg text-left font-sans"
            >
              {t('hero.description')}
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.2s" }}
            >
              <a 
                href="#contact" 
                className="relative flex items-center justify-center group w-full sm:w-auto text-white rounded-full px-9 py-4 transition-all duration-300 ease-out font-semibold text-lg font-sans transform hover:scale-[1.02] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #2abfff, #06b6d4)',
                  boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className="relative z-10 flex items-center">
                  {t('hero.cta')}
                  <ArrowRight className="ml-3 w-5 h-5 transition-all duration-300 group-hover:translate-x-2" />
                </span>
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0 flex justify-center">
            <div className={`relative z-10 animate-fade-in ${cardSize.maxWidth} w-full`} style={{ animationDelay: "0.9s" }}>
              {/* Wrapper com borda RGB */}
              <div className="relative p-[1px] rounded-[30px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                {/* Container do vídeo */}
                <div className={`relative overflow-hidden rounded-[28px] ${cardSize.height} transition-transform duration-300 hover:scale-[1.02] bg-black`}>
                  {/* Vídeo do card */}
                  <div className="absolute top-0 left-0 right-0 bottom-0" ref={imageRef}>
                    <LazyVideo
                      src={["/webm/0617.webm"]}
                      className="w-full h-full object-cover object-top"
                      onError={() => {
                        console.warn("Vídeo do hero não pôde ser carregado");
                      }}
                    />
                  </div>
                  
                  {/* Overlay com gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;