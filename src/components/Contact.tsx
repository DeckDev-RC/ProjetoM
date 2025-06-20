import React, { useRef, useEffect } from "react";
import { FloatingOrbs } from "./ui/orbs";
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
    <section className="w-full pt-24 sm:pt-28 md:pt-32 pb-16 bg-gray-950 relative overflow-hidden" ref={sectionRef}>
      {/* Orbes flutuantes */}
      <FloatingOrbs sectionId="contact" />

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Container para o efeito do drone */}
            <div className="relative">
              {/* Drone grande com efeito de flutuação */}
              <div className={`absolute -top-20 sm:-top-24 md:-top-28 -left-16 sm:-left-20 md:-left-28 z-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="relative">
                  {/* Sombra do drone no chão */}
                  <div 
                    className="absolute top-40 sm:top-48 md:top-56 left-1/2 transform -translate-x-1/2 w-16 h-8 sm:w-20 sm:h-9 md:w-28 md:h-12 bg-black/25 rounded-full blur-md animate-drone-shadow"
                    style={{
                      animationDelay: '0.5s'
                    }}
                  ></div>
                  
                  {/* Drone com animação de flutuação */}
                  <img 
                    src="/drone.png" 
                    alt="Drone" 
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 animate-drone-hover relative z-10"
                    style={{
                      filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6))',
                      animationDelay: '0.5s'
                    }}
                  />
                </div>
              </div>

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
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2">✉</span>
                        <span>Contato</span>
                      </div>
                    </div>
                    <div className="flex-1 h-[1px] bg-white/20"></div>
                  </div>

                  {/* Título */}
                  <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight mb-4 text-white">
                      Let's Build Your
                    </h2>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight text-white mb-4">
                      Rising Page
                    </h3>
                    <p className="text-gray-300 text-lg">
                      Fill in your details, and we'll get back to you to talk about your project.
                    </p>
                  </div>

                  {/* Formulário */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Name"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Company Name*"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                      />
                      <Input
                        type="tel"
                        placeholder="Phone Number*"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg"
                      />
                      <textarea
                        placeholder="How did you hear about us?"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/50 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                      Request a Proposal
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Contact; 