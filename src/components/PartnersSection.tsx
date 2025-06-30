import React from "react";
import { useTranslation } from "react-i18next";

const PartnersSection = () => {
  const { t } = useTranslation();
  
  // Array com múltiplas instâncias da logo para criar o efeito infinito
  const partnerLogos = Array(20).fill("/webp/Agregar.webp");

  return (
    <section className="w-full overflow-hidden py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-3">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mr-3 font-sans text-xs">🤝</span>
            <span className="font-sans tracking-wide">{t('partners.badge')}</span>
          </div>
        </div>
      </div>

      {/* Container do scroll infinito */}
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64 lg:h-72">
        <div className="flex animate-scroll-infinite items-center h-full">
          {partnerLogos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Partner logo ${index + 1}`}
              className="h-36 sm:h-44 md:h-52 lg:h-60 object-contain mx-8 flex-shrink-0"
              style={{ 
                opacity: 0.5,
                filter: 'grayscale(100%) brightness(0.9)'
              }}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-infinite {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-infinite {
            animation: scroll-infinite 33.75s linear infinite;
            width: max-content;
          }
          
          /* Ajustes para mobile */
          @media (max-width: 768px) {
            .animate-scroll-infinite {
              animation-duration: 28.125s;
            }
          }
          
          @media (max-width: 480px) {
            .animate-scroll-infinite {
              animation-duration: 22.5s;
            }
          }
        `
      }} />
    </section>
  );
};

export default PartnersSection;





