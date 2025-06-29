import React, { useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const { toast } = useToast();

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de envio do formulário
    toast({
      title: "Proposta enviada!",
      description: "Entraremos em contato em breve.",
    });
  };

  return (
    <section className="w-full pt-24 sm:pt-28 md:pt-32 pb-16 relative overflow-hidden" id="contact" ref={sectionRef}>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Card com efeito fosco transparente incluindo o cabeçalho */}
            <div className="relative backdrop-blur-md bg-black/20 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-1000">
              {/* Gradiente sutil de fundo */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              {/* Conteúdo do card */}
              <div className="relative z-10">
                {/* Header dentro do card */}
                <div className="flex items-center gap-4 mb-8 sm:mb-12 w-full">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2 font-sans">✉</span>
                      <span className="font-sans">Contato</span>
                    </div>
                  </div>
                  <div className="flex-1 h-[1px] bg-white/20"></div>
                </div>

                {/* Título */}
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-4 text-white">
                    Vamos construir sua solução de
                  </h2>
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight text-white mb-4">
                   <span 
                     className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                     style={{
                       backgroundSize: '200% 200%',
                       animation: 'gradientFlow 3s ease-in-out infinite'
                     }}
                   >
                      IA personalizada.
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
                      
                      @keyframes shimmer {
                        0% {
                          transform: translateX(-100%);
                        }
                        100% {
                          transform: translateX(200%);
                        }
                      }
                    `
                  }} />
                  <p className="text-gray-300 text-lg font-sans">
                    Preencha seus dados e fale com nossos especialistas.
            
                  </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Nome*"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email*"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Número de Telefone*"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Nome da Empresa"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="relative flex items-center justify-center group w-full text-white rounded-lg px-9 py-4 transition-all duration-500 ease-out font-semibold text-lg font-sans transform hover:scale-[1.02] overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #2abfff, #06b6d4)',
                      backgroundSize: '300% 300%',
                      animation: 'gradientFlow 4s ease-in-out infinite',
                      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {/* Efeito de brilho animado */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                        transform: 'translateX(-100%)',
                        animation: 'shimmer 2s infinite'
                      }}
                    />
                    
                    {/* Conteúdo do botão */}
                    <span className="relative z-10 flex items-center">
                      Solicitar Proposta
                    </span>
                    
                    {/* Efeito de partículas no hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                      <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 