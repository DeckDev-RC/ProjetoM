import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useTranslation } from "react-i18next";

const Contact = React.memo(() => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const { toast } = useToast();

  // Otimizar Intersection Observer com useCallback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
      }
    });
  }, []);

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(handleIntersection, { 
      threshold: 0.1,
      rootMargin: '50px' // Otimização: trigger antes de aparecer completamente
    });

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [handleIntersection]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('contact.toast.title'),
      description: t('contact.toast.description'),
    });
  }, [toast, t]);

  // Memoizar estilos complexos
  const buttonStyles = useMemo(() => ({
    background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #2abfff, #06b6d4)',
    backgroundSize: '300% 300%',
    boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }), []);

  // Memoizar o formulário para evitar re-renders desnecessários
  const formFields = useMemo(() => [
    { type: "text", placeholder: t('contact.form.name'), required: true },
    { type: "email", placeholder: t('contact.form.email'), required: true },
    { type: "tel", placeholder: t('contact.form.phone'), required: true },
    { type: "text", placeholder: t('contact.form.company'), required: false }
  ], [t]);

  return (
    <>
      {/* CSS otimizado movido para um style tag simples */}
      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 4s ease-in-out infinite;
        }
        
        .gradient-button {
          animation: gradientFlow 6s ease-in-out infinite;
        }
        
        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .shimmer-effect:hover::before {
          left: 100%;
        }
        
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Reduzir motion para usuários que preferem menos animação */
        @media (prefers-reduced-motion: reduce) {
          .gradient-text, .gradient-button {
            animation: none;
          }
        }
      `}</style>

    <section className="w-full pt-24 sm:pt-28 md:pt-32 pb-16 relative overflow-hidden" id="contact" ref={sectionRef}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Card com efeito fosco transparente */}
              <div className="relative backdrop-blur-md bg-black/20 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Gradiente sutil de fundo */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              {/* Conteúdo do card */}
              <div className="relative z-10">
                {/* Header dentro do card */}
                <div className="flex items-center gap-4 mb-8 sm:mb-12 w-full">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2 font-sans">✉</span>
                      <span className="font-sans">{t('contact.badge')}</span>
                    </div>
                  </div>
                  <div className="flex-1 h-[1px] bg-white/20"></div>
                </div>

                {/* Título */}
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-4 text-white">
                    {t('contact.title')}
                  </h2>
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight text-white mb-4">
                      <span className="gradient-text">
                      {t('contact.titleGradient')}
                     </span>
                  </h3>
                  
                  <p className="text-gray-300 text-lg font-sans">
                    {t('contact.description')}
                  </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                      {formFields.map((field, index) => (
                    <Input
                          key={index}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg transition-colors duration-200"
                          required={field.required}
                        />
                      ))}
                  </div>

                  <button
                    type="submit"
                      className="relative flex items-center justify-center group w-full text-white rounded-lg px-9 py-4 transition-all duration-300 ease-out font-semibold text-lg font-sans transform hover:scale-[1.02] overflow-hidden gradient-button shimmer-effect"
                      style={buttonStyles}
                    >
                    {/* Conteúdo do botão */}
                    <span className="relative z-10 flex items-center">
                      {t('contact.form.submit')}
                    </span>
                    
                      {/* Efeito de partículas simplificado */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
});

Contact.displayName = 'Contact';

export default Contact; 