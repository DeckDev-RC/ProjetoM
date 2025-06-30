import React from "react";
import LazyVideo from "@/components/LazyVideo";
import { useTranslation } from "react-i18next";

const ImageShowcaseSection = () => {
  const { t } = useTranslation();
  
  return (
        <section className="w-full pt-0 pb-8 sm:pb-12 relative overflow-hidden" id="showcase">
      {/* Glass background overlay */}
      
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 animate-on-scroll">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-700/50 mb-4 backdrop-blur-sm">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white mr-2 font-sans">02</span>
            <span className="font-sans">{t('showcase.badge')}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-6 sm:mb-7 leading-loose">
          <span>{t('showcase.title')}</span>
          <br/>
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradientFlow 3s ease-in-out infinite'
                }}
              >
                {t('showcase.titleGradient')}
              </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-sans">
          {t('showcase.description')}
          </p>
        </div>
        
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant dark:shadow-indigo-900/20 mx-auto max-w-4xl animate-on-scroll">
          <div className="w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-pulse-500/20 via-blurple-500/10 via-indigo-500/10 to-violet-500/20 mix-blend-overlay"></div>
            <LazyVideo
              src={["/webm/0625.webm", "/webm/Using_the_reference_202506212005.webm"]}
              className="w-full h-auto"
              onError={() => {
                console.warn("Vídeo do showcase não pôde ser carregado");
              }}
            />
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 dark:text-white">
              <span>{t('showcase.cardTitle')} </span>
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradientFlow 3s ease-in-out infinite'
                }}
              >
               {t('showcase.cardTitleGradient')}
              </span>
            </h3>
            
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
              `
            }} />
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-sans">
             {t('showcase.cardDescription')}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pulse-100 dark:bg-pulse-900/30 text-pulse-700 dark:text-pulse-300 font-sans">
              {t('showcase.tags.customAI')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blurple-100 dark:bg-blurple-900/30 text-blurple-700 dark:text-blurple-300 font-sans">
              {t('showcase.tags.smartAutomation')}
              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-sans">
              {t('showcase.tags.customSolutions')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;
