import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FloatingOrbs } from "./ui/orbs";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

interface ImageCardProps {
  imageSrc: string;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  position: 'left' | 'center' | 'right' | null;
  activeIndex: number | null;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
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
  
  const bgColors = [
    "bg-pulse-100 dark:bg-pulse-900/30",
    "bg-indigo-100 dark:bg-indigo-900/30",
    "bg-violet-100 dark:bg-violet-900/30",
    "bg-pulse-100 dark:bg-pulse-900/30",
    "bg-indigo-100 dark:bg-indigo-900/30",
    "bg-violet-100 dark:bg-violet-900/30",
  ];
  
  const iconColors = [
    "text-pulse-500 dark:text-pulse-400",
    "text-indigo-500 dark:text-indigo-400",
    "text-violet-500 dark:text-violet-400",
    "text-pulse-500 dark:text-pulse-400",
    "text-indigo-500 dark:text-indigo-400",
    "text-violet-500 dark:text-violet-400",
  ];
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        animationDelay: `${0.1 * index}s`,
        transition: "opacity 0.5s ease-in-out"
      }}
    >
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto", bgColors[index % 6])}>
        <div className={iconColors[index % 6]}>
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center">{description}</p>
    </div>
  );
};

const ImageCard = ({ 
  imageSrc, 
  index, 
  isActive, 
  onMouseEnter, 
  onMouseLeave,
  position,
  activeIndex
}: ImageCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
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
  
  // Títulos e subtítulos baseados no índice
  const titles = [
    { main: "Apple Intelligence", sub: "Possibilidades poderosas¹" },
    { main: "Câmeras de última geração", sub: "Temos fotos e vídeos para provar." },
    { main: "Chip e Bateria", sub: "Desempenho longa vida." },
  ];

  // Conteúdo do verso do card
  const backContent = [
    {
      title: "Apple Intelligence",
      features: [
        "Assistente pessoal avançado",
        "Reconhecimento de contexto",
        "Integração com todo o ecossistema",
        "Privacidade e segurança de dados"
      ]
    },
    {
      title: "Câmeras Profissionais",
      features: [
        "Sensor de última geração",
        "Modo noturno aprimorado",
        "Estabilização óptica avançada",
        "Gravação em 4K HDR"
      ]
    },
    {
      title: "A18 Pro",
      features: [
        "CPU de alto desempenho",
        "GPU para jogos avançados",
        "Eficiência energética superior",
        "Bateria de longa duração"
      ]
    }
  ];

  // Imagens para cada card
  const images = [
    "/vendas.png",
    "/atendimento.png",
    "/processos.png"
  ];

  // Cores de fundo para cada card
  const bgColors = [
    "#000000", // Preto para Apple Intelligence
    "#546a96", // Azul para Câmeras
    "#2a1e14"  // Marrom para Chip e Bateria
  ];

  // Determinar a transformação com base na posição relativa ao card ativo
  let transform = "";
  let zIndex = 10;
  
  if (isActive && !isFlipped) {
    transform = "translateY(-8px)";
    zIndex = 30;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
    onMouseLeave();
  };
  
  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        perspective: "1000px",
        height: "500px",
        zIndex: isFlipped ? 40 : zIndex,
        transition: "z-index 0.01s",
        animationDelay: `${0.2 * index}s`,
      }}
    >
      {/* Card container */}
      <div 
        className={cn(
          "w-full h-full cursor-pointer transition-transform duration-700 transform-style-preserve-3d relative"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : transform,
        }}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Frente do card */}
        <div 
          className="absolute w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative overflow-hidden rounded-lg bg-transparent h-[400px]" style={{ backgroundColor: bgColors[index] }}>
            <img 
              src={images[index]} 
              alt={titles[index].main} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-6">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">{titles[index].main}</h4>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{titles[index].sub}</h3>
          </div>
        </div>

        {/* Verso do card */}
        <div 
          className="absolute w-full h-full rounded-lg backface-hidden bg-white dark:bg-gray-800 p-8 flex flex-col"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          }}
        >
          <h3 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-pulse-500 to-violet-500 dark:from-pulse-400 dark:to-violet-400">
            {backContent[index].title}
          </h3>
          
          <div className="flex-1 flex flex-col justify-center">
            <ul className="space-y-3">
              {backContent[index].features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 mt-1 text-green-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center mt-4">
            <button 
              className="text-sm text-pulse-500 hover:text-pulse-600 dark:text-pulse-400 dark:hover:text-pulse-300 font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  
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
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return null;
    }
    
    // Para layout desktop (3 colunas)
    if (idx === 0) return 'left';
    if (idx === 1) return 'center';
    if (idx === 2) return 'right';
    return null;
  };
  
  return (
    <section className="w-full py-6 sm:py-10 bg-gray-50 dark:bg-gray-950 relative overflow-hidden" id="features" ref={sectionRef}>
      {/* Orbes flutuantes */}
      <FloatingOrbs sectionId="features" />
      
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center relative z-10">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16 w-full">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-500 text-white mr-2">2</span>
              <span>Recursos</span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-violet-300 dark:bg-violet-700"></div>
        </div>

        {/* Main content */}
        <div className="max-w-5xl text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-8 sm:mb-12">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              Inteligência Avançada, <br className="hidden sm:block" />
              Automação Intuitiva
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <FeatureCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 1 1-4-4"></path><path d="M12 8a4 4 0 1 0 4 4"></path><circle cx="12" cy="12" r="1"></circle></svg>}
              title="Aprendizado Contínuo"
              description="Nossos agentes evoluem constantemente, aprendendo com cada interação para oferecer respostas cada vez mais precisas e personalizadas."
              index={0}
            />
            <FeatureCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 2h2v2"></path><path d="M18 20h2v2"></path></svg>}
              title="Automação Inteligente"
              description="Otimize seus processos com automação avançada, permitindo que sua equipe foque em atividades estratégicas e criativas."
              index={1}
            />
            <FeatureCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg>}
              title="Integração Perfeita"
              description="Conecte-se facilmente com suas ferramentas existentes, criando um ecossistema unificado e eficiente para sua empresa."
              index={2}
            />
            <FeatureCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="M8 11h8"></path><path d="M8 15h8"></path></svg>}
              title="Segurança Robusta"
              description="Proteção avançada dos seus dados com criptografia de ponta e conformidade com as principais regulamentações do mercado."
              index={3}
            />
            <FeatureCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>}
              title="Suporte 24/7"
              description="Assistência inteligente disponível a qualquer momento, com respostas rápidas e soluções efetivas para suas demandas."
              index={4}
            />
            <FeatureCard
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 7V5c0-1.1.9-2 2-2h2"></path><path d="M17 3h2c1.1 0 2 .9 2 2v2"></path><path d="M21 17v2c0 1.1-.9 2-2 2h-2"></path><path d="M7 21H5c-1.1 0-2-.9-2-2v-2"></path><rect width="7" height="7" x="7" y="7" rx="1"></rect><rect width="7" height="7" x="10" y="10" rx="1"></rect></svg>}
              title="Escalabilidade Total"
              description="Cresça sem limites com uma solução que se expande de acordo com suas necessidades, mantendo a performance em qualquer escala."
              index={5}
            />
          </div>
        </div>
        
        {/* Image Cards Section */}
        <div className="w-full mt-20">
          <h3 className="text-2xl sm:text-3xl font-semibold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Recursos de destaque
          </h3>
          
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
          <div className="text-center mt-8 mb-16 text-sm text-gray-500 dark:text-gray-400">
            Clique nos cards para ver mais detalhes
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
