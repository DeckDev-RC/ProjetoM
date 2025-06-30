import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useDeviceDetection, useOrientation } from "@/hooks/use-mobile";
import { useResponsiveValue } from "@/hooks/useResponsiveUtils";
import { COMPONENT_CONFIG } from "@/lib/responsive-config";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch";

const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Usar hooks de responsividade
  const deviceInfo = useDeviceDetection();
  const orientation = useOrientation();
  
  // Detectar se é landscape e mobile com lógica mais robusta
  const isLandscape = orientation === 'landscape';
  const isMobileLandscape = (deviceInfo.isMobile || deviceInfo.isTablet || window.innerWidth <= 768) && isLandscape;
  
  // Detectar se é realmente mobile (incluindo iPhone/iPad em landscape)
  const [isTrueMobile, setIsTrueMobile] = useState(false);
  
  useEffect(() => {
    const checkTrueMobile = () => {
      // Detectar dispositivos móveis baseado em user agent E tamanho de tela
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768; // Mudado para <= 768 para ser mais consistente
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // É mobile se: tem user agent mobile OU (tela pequena E touch) OU apenas tela pequena
      setIsTrueMobile(isMobileUA || (isSmallScreen && isTouchDevice) || isSmallScreen);
    };
    
    checkTrueMobile();
    
    window.addEventListener('resize', checkTrueMobile);
    window.addEventListener('orientationchange', checkTrueMobile);
    
    return () => {
      window.removeEventListener('resize', checkTrueMobile);
      window.removeEventListener('orientationchange', checkTrueMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > COMPONENT_CONFIG.navbar.scrollThreshold);
      
      // Fecha o menu mobile quando o usuário rola a página
      if (isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  // Fecha o menu quando clicar fora dele (agora gerenciado pelo overlay)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Fechar menu com tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  // Tamanho do logo responsivo - aumentado mais 25% novamente para desktop
  const logoSize = useResponsiveValue({
    'mobile-xs': 'w-24 h-auto max-w-24',
    'mobile-sm': 'w-28 h-auto max-w-28', 
    'mobile-md': 'w-30 h-auto max-w-30', // Galaxy A15 otimizado
    'tablet-sm': 'w-32 h-auto max-w-32',
    'tablet-md': 'w-34 h-auto max-w-34',
    'desktop': 'w-72 h-auto max-w-72 sm:w-80 sm:max-w-80' // Aumentado mais 25% (56→70→72, 60→75→80)
  }, 'w-72 h-auto max-w-72 sm:w-80 sm:max-w-80');

  // Dimensões do menu mobile otimizadas para landscape
  const mobileMenuWidth = isMobileLandscape ? '50%' : '75%';
  const mobileMenuMaxWidth = isMobileLandscape ? '280px' : '400px';

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 py-4 md:py-5 transition-all duration-300",
        isScrolled 
          ? "bg-gray-900/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <a 
          href="#" 
          className="flex items-center space-x-2 flex-shrink-0 md:-ml-[100px]"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="Mind AI"
        >
          <img 
            src="/logo.svg" 
            alt="Mind AI Logo" 
            className={`${logoSize} object-contain`}
            style={{ 
              minWidth: '80px',
              maxHeight: '95px' // Aumentado mais 25% novamente (75px → 95px)
            }}
            onError={(e) => {
              // Fallback para PNG caso SVG não carregue em alguns Samsung
              const img = e.target as HTMLImageElement;
              if (img.src.includes('.svg')) {
                img.src = '/logo.webp';
              }
            }}
          />
        </a>

        {/* Desktop Navigation e Language Switch */}
        <div className="hidden md:flex items-center justify-center flex-1">
          {/* Menu de navegação centralizado */}
          <nav 
            className="flex items-center justify-center gap-8 max-w-2xl"
            style={{
              transform: window.innerWidth >= 768 ? 'translateX(-60px)' : 'none'
            }}
          >
            <a href="#" className="relative text-gray-200 hover:text-blue-400 py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full font-sans" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>{t('navbar.home')}</a>
            <a href="#process-optimization" className="relative text-gray-200 hover:text-indigo-400 py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all hover:after:w-full font-sans">{t('navbar.strategy')}</a>
            <a href="#features" className="relative text-gray-200 hover:text-pulse-400 py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-pulse-400 after:transition-all hover:after:w-full font-sans">{t('navbar.features')}</a>
            <a href="#faq" className="relative text-gray-200 hover:text-violet-400 py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-violet-400 after:transition-all hover:after:w-full font-sans">{t('navbar.faq')}</a>
            <a href="#contact" className="relative text-gray-200 hover:text-green-400 py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-green-400 after:transition-all hover:after:w-full font-sans">{t('navbar.contact')}</a>
          </nav>
        </div>

        {/* Desktop Language Switch */}
        <div 
          className="hidden md:flex items-center"
          style={{
            transform: window.innerWidth >= 768 ? 'translateX(-100px)' : 'none'
          }}
        >
          <LanguageSwitch />
        </div>

        {/* Mobile Menu Button - mostra para todos os dispositivos móveis, incluindo iPhone landscape */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Language switch for mobile */}
          <LanguageSwitch />
          
          {/* Mobile menu button - increased touch target */}
          <button 
            className="menu-button text-gray-200 p-3 focus:outline-none hover:bg-white/10 rounded-lg transition-colors" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/80 transition-opacity duration-300 ease-in-out backdrop-blur-sm"
          onClick={() => {
            setIsMenuOpen(false);
            document.body.style.overflow = '';
          }}
          style={{ 
            height: '100vh',
            width: '100vw',
            top: 0,
            left: 0
          }}
        />
      )}

      {/* Mobile Navigation Panel */}
      {isMenuOpen && (
        <div 
          className={cn(
            "fixed top-0 right-0 z-[70] bg-gray-900 border-l border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          style={{ 
            height: '100vh',
            width: mobileMenuWidth,
            maxWidth: mobileMenuMaxWidth,
            minHeight: '100vh'
          }}
        >
          {/* Botão de fechamento */}
          <button 
            className="absolute right-4 top-4 rounded-sm p-2 text-gray-400 opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10" 
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          
          {/* Conteúdo do menu - ajustado para landscape com scroll */}
          <div className={cn(
            "flex flex-col h-full",
            isMobileLandscape ? "pt-12 p-4 gap-2" : "pt-16 p-6 gap-6"
          )}>
            {/* Links de navegação */}
            <div className={cn(
              "flex flex-col",
              isMobileLandscape ? "gap-2" : "gap-4"
            )}>
              <a 
                href="#" 
                className={cn(
                  "text-gray-400 hover:text-white transition-colors duration-300 font-sans",
                  isMobileLandscape ? "text-sm py-1" : "text-lg py-2"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                  scrollToTop();
                }}
              >
                {t('navbar.home')}
              </a>
              <a 
                href="#process-optimization" 
                className={cn(
                  "text-gray-400 hover:text-white transition-colors duration-300 font-sans",
                  isMobileLandscape ? "text-sm py-1" : "text-lg py-2"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                {t('navbar.strategy')}
              </a>
              <a 
                href="#features" 
                className={cn(
                  "text-gray-400 hover:text-white transition-colors duration-300 font-sans",
                  isMobileLandscape ? "text-sm py-1" : "text-lg py-2"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                {t('navbar.features')}
              </a>
              <a 
                href="#faq" 
                className={cn(
                  "text-gray-400 hover:text-white transition-colors duration-300 font-sans",
                  isMobileLandscape ? "text-sm py-1" : "text-lg py-2"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                {t('navbar.faq')}
              </a>
              <a 
                href="#contact" 
                className={cn(
                  "text-gray-400 hover:text-white transition-colors duration-300 font-sans",
                  isMobileLandscape ? "text-sm py-1" : "text-lg py-2"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                {t('navbar.contact')}
              </a>
              
              {/* Botão Começar Agora - logo abaixo de Contato */}
              <div className={cn(
                "mt-2",
                isMobileLandscape ? "mt-2" : "mt-4"
              )}>
                <button 
                  className={cn(
                    "w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 font-sans",
                    isMobileLandscape ? "h-8 text-xs" : "h-12"
                  )}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #2abfff, #06b6d4)',
                    backgroundSize: '300% 300%',
                    animation: 'gradientFlow 4s ease-in-out infinite',
                    color: 'white'
                  }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                    // Navegar para seção de contato para começar
                    const contactSection = document.querySelector('#contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      // Fallback: scroll para o final da página se não encontrar a seção
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                  }}
                >
                  {t('navbar.getStarted')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
