import React, { useEffect, useState } from "react";

const PartnersSection = () => {
  // Array com múltiplas instâncias da logo para criar o efeito infinito
  const partnerLogos = Array(12).fill("/webp/Agregar.webp");
  
  // Detectar mobile para otimizações
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window;
      
      setIsMobile(isMobileUA || (isSmallScreen && isTouchDevice));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="w-full overflow-hidden py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-3">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mr-3 font-sans text-xs">🤝</span>
            <span className="font-sans tracking-wide">Parceiros de Confiança</span>
          </div>
        </div>
      </div>

      {/* Container do scroll infinito */}
      <div className="relative overflow-hidden h-32 sm:h-36 md:h-40 lg:h-48">
        <div 
          className={`flex space-x-16 animate-scroll-infinite items-center h-full ${isMobile ? 'mobile-scroll-optimization' : ''}`}
          style={{
            width: 'calc(280px * 12 + 2rem * 11)', // Largura calculada precisa
            display: 'flex',
            gap: '2rem',
            willChange: 'transform', // Otimização para mobile
            ...(isMobile && {
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: '1000px',
              WebkitPerspective: '1000px'
            })
          }}
        >
          {partnerLogos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="h-48 sm:h-28 md:h-32 lg:h-40 object-contain transition-opacity duration-300 hover:opacity-80 mobile-logo-scale"
              style={{ 
                opacity: 0.5,
                minWidth: '280px',
                filter: 'grayscale(100%) brightness(0.9)'
              }}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
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
          
          @keyframes scroll-infinite {
            0% {
              transform: translate3d(0, 0, 0);
              -webkit-transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
              -webkit-transform: translate3d(-50%, 0, 0);
            }
          }
          
          @-webkit-keyframes scroll-infinite {
            0% {
              -webkit-transform: translate3d(0, 0, 0);
            }
            100% {
              -webkit-transform: translate3d(-50%, 0, 0);
            }
          }
          
          .animate-scroll-infinite {
            animation: scroll-infinite 30s linear infinite;
            -webkit-animation: scroll-infinite 30s linear infinite;
            will-change: transform;
            -webkit-will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            -webkit-perspective: 1000px;
          }
          
          .mobile-logo-scale {
            transform: scale(2.2);
          }
          
          @media (min-width: 640px) {
            .mobile-logo-scale {
              transform: scale(1.5);
            }
          }
          
          /* Otimizações específicas para mobile */
          @media (max-width: 768px) {
            .animate-scroll-infinite {
              animation-duration: 25s !important;
              animation-timing-function: linear !important;
              animation-iteration-count: infinite !important;
              animation-play-state: running !important;
              transform: translate3d(0, 0, 0);
              -webkit-transform: translate3d(0, 0, 0);
            }
            
            /* Forçar hardware acceleration em mobile */
            .relative.overflow-hidden {
              transform: translateZ(0);
              -webkit-transform: translateZ(0);
              will-change: transform;
              -webkit-will-change: transform;
            }
            
            /* Garantir que a animação não seja pausada */
            .animate-scroll-infinite * {
              pointer-events: none;
            }
          }
          
          /* Suporte para dispositivos com pouca memória */
          @media (max-width: 480px) {
            .animate-scroll-infinite {
              animation-duration: 20s !important;
            }
          }
          
          /* Classe específica para otimização mobile */
          .mobile-scroll-optimization {
            -webkit-overflow-scrolling: touch !important;
            transform: translate3d(0, 0, 0) !important;
            -webkit-transform: translate3d(0, 0, 0) !important;
            will-change: transform !important;
            -webkit-will-change: transform !important;
            animation-fill-mode: both !important;
            -webkit-animation-fill-mode: both !important;
          }
          
          /* Forçar animação em dispositivos iOS */
          @supports (-webkit-overflow-scrolling: touch) {
            .animate-scroll-infinite {
              -webkit-animation: scroll-infinite 25s linear infinite !important;
              animation: scroll-infinite 25s linear infinite !important;
              transform: translate3d(0, 0, 0) !important;
              -webkit-transform: translate3d(0, 0, 0) !important;
            }
          }
          
          /* Fallback para dispositivos muito antigos */
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            .animate-scroll-infinite {
              -webkit-animation: scroll-infinite 25s linear infinite !important;
            }
          }
        `
      }} />
    </section>
  );
};

export default PartnersSection; 