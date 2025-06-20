import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import LottieAnimation from "./LottieAnimation";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [lottieData, setLottieData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/loop-header.lottie')
      .then(response => response.json())
      .then(data => setLottieData(data))
      .catch(error => console.error("Error loading Lottie animation:", error));
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      
      const {
        left,
        top,
        width,
        height
      } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      imageRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isMobile]);
  
  useEffect(() => {
    if (isMobile) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax');
      elements.forEach(el => {
        const element = el as HTMLElement;
        const speed = parseFloat(element.dataset.speed || '0.1');
        const yPos = -scrollY * speed;
        element.style.setProperty('--parallax-y', `${yPos}px`);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);
  
  return (
    <section 
      className="overflow-hidden relative bg-gray-950" 
      id="hero" 
      style={{
        padding: isMobile ? '100px 12px 40px' : '120px 20px 60px',
      }}
    >
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => setVideoLoaded(true)}
          style={{ zIndex: 1 }}
        >
          <source src="/Header-background-dark.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }}></div>
        
        {/* Animated Gradient Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900" 
          style={{ 
            opacity: videoLoaded ? 0.7 : 1, 
            transition: 'opacity 0.5s ease', 
            zIndex: 3,
            animation: 'pulse 8s ease-in-out infinite alternate'
          }}
        ></div>

        {/* Noise overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            zIndex: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 10 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            opacity: 0.1
          }}
        ></div>
      </div>

      {/* Efeito de gradiente superior-direito */}
      <div 
        className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] rounded-full" 
        style={{ 
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(70px)',
          zIndex: 5
        }}
      ></div>
      
      {/* Efeito de gradiente inferior-esquerdo */}
      <div 
        className="absolute -bottom-[10%] -left-[5%] w-1/2 h-[50%] rounded-full" 
        style={{ 
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0) 70%)',
          filter: 'blur(70px)',
          zIndex: 5
        }}
      ></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <div 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pulse-100 dark:bg-pulse-900/50 text-pulse-600 dark:text-pulse-300 border border-pulse-200 dark:border-pulse-700 mb-3 sm:mb-6 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">01</span>
              <span>Propósito</span>
            </div>
            
            <h1 
              className="section-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight opacity-0 animate-fade-in dark:text-white" 
              style={{ animationDelay: "0.3s" }}
            >
              Automatize tudo<br className="hidden sm:inline" />Expanda sem limites
            </h1>
            
            <p 
              style={{ animationDelay: "0.5s" }} 
              className="section-subtitle mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed opacity-0 animate-fade-in text-gray-950 dark:text-gray-300 font-normal text-base sm:text-lg text-left"
            >
              Somos especialistas em agentes de inteligência artificial que aprendem com seus processos e executam com precisão. Eliminamos o esforço manual, otimizamos fluxos e liberamos sua equipe para pensar no que realmente importa. Você não precisa de mais pessoas para crescer. Precisa de mais inteligência.
            </p>
            
            <style>{`
              @keyframes float {
                0% {
                  transform: translateY(0px);
                  box-shadow: 0 10px 20px rgba(124, 58, 237, 0.15);
                }
                50% {
                  transform: translateY(-2px);
                  box-shadow: 0 20px 25px rgba(124, 58, 237, 0.2);
                }
                100% {
                  transform: translateY(0px);
                  box-shadow: 0 10px 20px rgba(124, 58, 237, 0.15);
                }
              }
              .floating-button {
                animation: float 2s ease-in-out infinite;
              }
              .floating-button:hover {
                animation-play-state: paused;
              }
              
              @keyframes pulse {
                0% {
                  opacity: 0.5;
                }
                50% {
                  opacity: 0.7;
                }
                100% {
                  opacity: 0.5;
                }
              }
            `}</style>
            <div 
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.2s" }}
            >
              <a 
                href="#get-access" 
                className="floating-button flex items-center justify-center group w-full sm:w-auto text-center bg-gradient-to-r from-violet-500 via-violet-400 to-pulse-400 hover:from-violet-600 hover:via-violet-500 hover:to-pulse-500 text-white rounded-full px-8 py-4 transition-all duration-300 ease-in-out font-medium hover:animate-float shadow-[0_10px_15px_rgba(124,58,237,0.2)]"
              >
                Explorar
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
            {lottieData ? (
              <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.9s" }}>
                <LottieAnimation 
                  animationPath={lottieData} 
                  className="w-full h-auto max-w-lg mx-auto"
                  loop={true}
                  autoplay={true}
                />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-violet-900 dark:bg-violet-950 rounded-2xl sm:rounded-3xl shadow-xl" style={{ zIndex: 1 }}></div>
                <div className="relative transition-all duration-500 ease-out overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                  <img 
                    ref={imageRef} 
                    src="/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png" 
                    alt="Atlas Robot" 
                    className="w-full h-auto object-cover transition-transform duration-500 ease-out" 
                    style={{ transformStyle: 'preserve-3d', opacity: 0 }} 
                  />
                  <div className="absolute inset-0" style={{ zIndex: 2 }}>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ opacity: 1 }}
                    >
                      <source src="/0617.mp4" type="video/mp4" />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Efeito de círculo com parallax */}
      <div 
        className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 rounded-full parallax" 
        data-speed="0.05"
        style={{ 
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 5
        }}
      ></div>
    </section>
  );
};

export default Hero; 