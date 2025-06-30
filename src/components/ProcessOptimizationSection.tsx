import React, { useRef, useEffect } from "react";
import { useDeviceDetection } from "@/hooks/use-mobile";
import { 
  useResponsiveContainer, 
  useResponsiveInnerScale,
  useResponsiveAnimation 
} from "@/hooks/useResponsiveUtils";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useTranslation } from "react-i18next";


// Função robusta para detectar dispositivos móveis reais
const isRealMobileDevice = (): boolean => {
  // Verificar se estamos no browser
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // 1. Detectar pelo User Agent
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipod', 'blackberry', 
    'windows phone', 'opera mini', 'iemobile', 'mobile safari'
  ];
  
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  // 2. Detectar dispositivos iOS específicos (incluindo iPads que podem reportar como desktop)
  const isIOS = /ipad|iphone|ipod/.test(userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // 3. Detectar Android
  const isAndroid = userAgent.includes('android');
  
  // 4. Verificar touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 5. Verificar densidade de pixels (dispositivos móveis geralmente têm DPR > 1)
  const hasHighDPR = window.devicePixelRatio > 1;
  
  // 6. Verificar se a menor dimensão é típica de mobile (mesmo em landscape)
  const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
  const isMobileSize = smallerDimension <= 480;
  
  // 7. Verificar se é landscape em dispositivo móvel (largura > altura mas altura pequena)
  const isLandscapeMobile = window.innerWidth > window.innerHeight && window.innerHeight <= 500;
  
  // 8. Detectar se é realmente um tablet grande (iPad Pro, etc.)
  const isLargeTablet = (
    (userAgent.includes('ipad') && window.innerWidth > 1000 && window.innerHeight > 700) ||
    (userAgent.includes('android') && window.innerWidth > 900 && window.innerHeight > 600 && !userAgent.includes('mobile'))
  );
  
  // Lógica de decisão: é mobile se:
  // - Tem indicadores de mobile no UA, OU
  // - É iOS/Android E tem touch E (tem alta DPR OU tamanho pequeno OU é landscape mobile)
  // - MAS NÃO é um tablet grande
  const isMobile = (
    isMobileUA || 
    ((isIOS || isAndroid) && hasTouch && (hasHighDPR || isMobileSize || isLandscapeMobile))
  ) && !isLargeTablet;
  
  return isMobile;
};

// SVG Connector Component (apenas para desktop)
interface ConnectorProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: "pulse" | "blurple" | "indigo" | "violet";
  type?: "curved" | "straight" | "L-shaped";
}

const SVGConnector: React.FC<ConnectorProps> = ({ from, to, color, type = "curved" }) => {
  const getGradientId = (color: string) => {
    switch (color) {
      case "pulse": return "neonPulse";
      case "blurple": return "neonBlurple"; 
      case "indigo": return "neonIndigo";
      case "violet": return "neonViolet";
      default: return "neonPulse";
    }
  };

  const getPath = () => {
    if (type === "curved") {
      const midX = (from.x + to.x) / 2;
      const midY = from.y + (to.y - from.y) * 0.3;
      return `M${from.x} ${from.y} Q${midX} ${midY} ${to.x} ${to.y}`;
    } else if (type === "L-shaped") {
      return `M${from.x} ${from.y} L${from.x} ${to.y} L${to.x} ${to.y}`;
    }
    return `M${from.x} ${from.y} L${to.x} ${to.y}`;
  };

  return (
    <>
      {/* Linha de fundo para efeito de brilho */}
      <path
        d={getPath()}
        stroke={`url(#${getGradientId(color)})`}
        strokeWidth="6"
        fill="none"
        opacity="0.15"
        filter="url(#glow)"
      />
      {/* Linha principal estática */}
      <path
        d={getPath()}
        stroke={`url(#${getGradientId(color)})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="8,8"
        filter="url(#glow)"
        opacity="0.8"
      />
    </>
  );
};

// Reusable Strategy Card Component
interface StrategyCardProps {
  id: number;
  name: string;
  role: string;
  icon: string;
  quote: string;
  accentColor: "pulse" | "blurple" | "indigo" | "violet";
  className?: string;
  showMoreOptions?: boolean;
  style?: React.CSSProperties;
  isMobile?: boolean;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  id,
  name,
  role,
  icon,
  quote,
  accentColor,
  className = "",
  showMoreOptions = false,
  style,
  isMobile = false
}) => {
  const animation = useResponsiveAnimation();

  const getAccentStyles = (color: "pulse" | "blurple" | "indigo" | "violet") => {
    switch (color) {
      case "pulse":
        return {
          accent: "bg-pulse-500",
          dot: "bg-pulse-400",
          text: "text-pulse-400",
          gradient: "from-black via-black/90 to-pulse-900/40",
          glow: "hover:shadow-pulse-500/20"
        };
      case "blurple":
        return {
          accent: "bg-blurple-500", 
          dot: "bg-blurple-400",
          text: "text-blurple-400",
          gradient: "from-black via-black/90 to-blurple-900/40",
          glow: "hover:shadow-blurple-500/20"
        };
      case "indigo":
        return {
          accent: "bg-indigo-500",
          dot: "bg-indigo-400", 
          text: "text-indigo-400",
          gradient: "from-black via-black/90 to-indigo-900/40",
          glow: "hover:shadow-indigo-500/20"
        };
      case "violet":
        return {
          accent: "bg-violet-500",
          dot: "bg-violet-400", 
          text: "text-violet-400",
          gradient: "from-black via-black/90 to-violet-900/40",
          glow: "hover:shadow-violet-500/20"
        };
      default:
        return {
          accent: "bg-pulse-500",
          dot: "bg-pulse-400",
          text: "text-pulse-400", 
          gradient: "from-black via-black/90 to-pulse-900/40",
          glow: "hover:shadow-pulse-500/20"
        };
    }
  };

  const styles = getAccentStyles(accentColor);

  const formatQuote = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  };

  // Layout mobile simplificado e estático
  if (isMobile) {
    return (
      <div className={`w-full max-w-sm mx-auto mb-6 ${className}`}>
        <div className={`relative bg-gradient-to-b ${styles.gradient} rounded-2xl p-4 shadow-lg border border-white/10`}>
          {/* Triângulo simples sem animação */}
          <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden rounded-tl-2xl">
            <div 
              className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            />
          </div>

          {/* Title */}
          <div className="pt-4 pb-2">
            <h4 className="text-white font-semibold text-lg text-center leading-tight">{role}</h4>
          </div>

          {/* Icon simples */}
          <div className="flex justify-center py-4">
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <ResponsiveImage 
                src={icon} 
                webpSrc={icon.replace('.png', '.webp')}
                alt={role}
                className="w-20 h-20 object-contain"
                sizes="80px"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="text-gray-200 text-sm leading-relaxed text-center">
            <span className={`${styles.text} text-lg mr-1`}>"</span>
            <span dangerouslySetInnerHTML={{ __html: formatQuote(quote) }} />
          </div>
        </div>
      </div>
    );
  }

  // Layout desktop com animações
  return (
    <div 
      className={`group animate-on-scroll ${className}`} 
      style={{
        ...style,
        animationDelay: `${animation.delay}ms`,
        transition: `all ${animation.duration} ${animation.easing}`
      }}
    >
      {/* Card com formato moderno */}
      <div className={`relative w-80 h-[380px] bg-gradient-to-b ${styles.gradient} rounded-3xl p-6 shadow-2xl ${styles.glow} hover:shadow-3xl transition-all duration-300 group-hover:scale-[1.02] overflow-hidden glass-card`}>
        
        {/* Triângulo elegante no canto superior esquerdo */}
        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden rounded-tl-3xl">
          <div 
            className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg opacity-90"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientFlow 3s ease-in-out infinite'
            }}
          />
        </div>

        {/* Title Section */}
        <div className="absolute top-6 left-6 right-6 z-20">
          <h4 className="text-white font-semibold text-xl tracking-wide font-display text-center leading-tight">{role}</h4>
        </div>

        {/* Central Icon */}
        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
            <ResponsiveImage 
              src={icon} 
              webpSrc={icon.replace('.png', '.webp')}
              alt={role}
              className="w-22 h-22 object-contain"
              sizes="128px"
            />
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Quote Text */}
          <div className="text-gray-200 text-sm leading-relaxed tracking-wide font-display">
            <span className={`${styles.text} text-xl mr-2 font-light`}>"</span>
            <span dangerouslySetInnerHTML={{ __html: formatQuote(quote) }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessOptimizationSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Usar hooks de responsividade
  const deviceInfo = useDeviceDetection();
  const container = useResponsiveContainer('processOptimization');
  const innerScale = useResponsiveInnerScale();
  const animation = useResponsiveAnimation();
  
  // Configuração estática para melhor performance
  const performanceConfig = { enableAnimations: true, enableHeavyAnimations: false };

  // Detectar se é realmente um dispositivo móvel
  const [isRealMobile, setIsRealMobile] = React.useState(false);
  
  React.useEffect(() => {
    // Detectar na montagem e em mudanças de orientação
    const checkDevice = () => {
      setIsRealMobile(isRealMobileDevice());
    };
    
    checkDevice();
    
    // Listener para mudanças de orientação
    window.addEventListener('orientationchange', checkDevice);
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('orientationchange', checkDevice);
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

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

  const getGradientId = (color: string) => {
    switch (color) {
      case "pulse": return "neonPulse";
      case "blurple": return "neonBlurple"; 
      case "indigo": return "neonIndigo";
      case "violet": return "neonViolet";
      default: return "neonPulse";
    }
  };

  const strategies = [
    {
      id: 1,
      name: t('strategy.cards.automation.title'),
      role: t('strategy.cards.automation.title'),
      icon: "/webp/Automatize-com-inteligencia.webp",
      quote: t('strategy.cards.automation.description'),
      accentColor: "pulse" as const
    },
    {
      id: 2,
      name: t('strategy.cards.integration.title'),
      role: t('strategy.cards.integration.title'), 
      icon: "/webp/Conecte-tudo-precisao.webp",
      quote: t('strategy.cards.integration.description'),
      accentColor: "blurple" as const
    },
    {
      id: 3,
      name: t('strategy.cards.workflows.title'),
      role: t('strategy.cards.workflows.title'),
      icon: "/webp/Fluxos-estrategicos-adaptaveis.webp",
      quote: t('strategy.cards.workflows.description'),
      accentColor: "indigo" as const,
      showMoreOptions: true
    },
    {
      id: 4,
      name: t('strategy.cards.monitoring.title'),
      role: t('strategy.cards.monitoring.title'),
      icon: "/webp/Crescimento-monitoramento-total.webp",
      quote: t('strategy.cards.monitoring.description'),
      accentColor: "violet" as const
    }
  ];

  // Coordenadas para conectar os cards (apenas desktop)
  const connections = [
    { from: { x: 140, y: 15 }, to: { x: 139.9, y: 80 }, color: "pulse" as const },
    { from: { x: 780, y: 200 }, to: { x: 310, y: 200.1 }, color: "blurple" as const },
    { from: { x: 140.1, y: 480 }, to: { x: 140, y: 650 }, color: "indigo" as const },
    { from: { x: 310, y: 770 }, to: { x: 790, y: 770.1 }, color: "violet" as const },
    { from: { x: 955, y: 290 }, to: { x: 955.1, y: 450 }, color: "pulse" as const },
    { from: { x: 955, y: 849 }, to: { x: 955.1, y: 914 }, color: "pulse" as const },
  ];

  // Layout mobile completamente estático - funciona tanto em portrait quanto landscape
  const MobileLayout = () => (
    <div className="px-4 py-8 mobile-static-layout">
      <div className="space-y-6 max-w-md mx-auto mobile-cards-container">
        {strategies.map((strategy, index) => (
          <StrategyCard
            key={strategy.id}
            {...strategy}
            isMobile={true}
            className="mobile-strategy-card"
          />
        ))}
      </div>
    </div>
  );

  // Layout desktop com animações condicionais baseadas na performance
  const DesktopLayout = () => (
    <div 
      ref={containerRef} 
      className={container.classes}
      style={container.styles}
    >
      {/* Container com escala para manter proporções */}
      <div 
        className={innerScale.classes}
        style={innerScale.styles}
      >
        {/* SVG Connector Lines - Versão otimizada */}
        {performanceConfig.enableAnimations && (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-10" 
            viewBox="0 0 1200 980"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="neonPulse" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2ABFFF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#47C3FF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2ABFFF" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="neonBlurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2B75D8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#4F9FFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2B75D8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="neonIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#524EBF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#7767C7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#524EBF" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="neonViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4C30AF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#674FB7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4C30AF" stopOpacity="0.9" />
              </linearGradient>

              {/* Filtro otimizado para os nodes */}
              <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
                <feGaussianBlur in="blur1" stdDeviation="4" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Filtro para as linhas */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feFlood floodColor="#ffffff" result="color" />
                <feComposite in="color" in2="coloredBlur" operator="in" result="glow" />
                <feMerge> 
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Render all connections */}
            {connections.map((connection, index) => (
              <SVGConnector
                key={index}
                from={connection.from}
                to={connection.to}
                color={connection.color}
                type="curved"
              />
            ))}
            
            {/* Connection nodes estáticos */}
            {connections.map((connection, index) => (
              <g key={`nodes-${index}`}>
                {/* Node de origem */}
                <circle 
                  cx={connection.from.x} 
                  cy={connection.from.y} 
                  r="4" 
                  fill={`url(#${getGradientId(connection.color)})`}
                  opacity="0.8"
                />
                
                {/* Node de destino */}
                <circle 
                  cx={connection.to.x} 
                  cy={connection.to.y} 
                  r="4" 
                  fill={`url(#${getGradientId(connection.color)})`}
                  opacity="0.8"
                />
              </g>
            ))}
          </svg>
        )}

        {/* Strategy Cards - Layout para desktop */}
        <div className="relative h-[980px] z-20">
          {/* Card 1 - Top Right */}
          <StrategyCard
            {...strategies[0]}
            className="absolute -top-[120px] right-[90px] w-full max-w-[300px]"
            style={{ animationDelay: '0ms' }}
          />
          
          {/* Card 2 - Middle Left */}
          <StrategyCard
            {...strategies[1]}
            className="absolute top-[70px] -left-[40px] w-full max-w-[300px]"
            style={{ animationDelay: '150ms' }}
          />
          
          {/* Card 3 - Middle Right */}
          <StrategyCard
            {...strategies[2]}
            className="absolute top-[440px] right-[80px] w-full max-w-[300px]"
            style={{ animationDelay: '300ms' }}
          />
          
          {/* Card 4 - Bottom Left */}
          <StrategyCard
            {...strategies[3]}
            className="absolute top-[640px] -left-[40px] w-full max-w-[300px]"
            style={{ animationDelay: '450ms' }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section 
      className="w-full py-8 sm:py-12 lg:py-16 relative overflow-hidden" 
      id="process-optimization" 
      ref={sectionRef}
    >
      {/* CSS para desktop - Condicionais baseadas na performance */}
      {!isRealMobile && (
        <style dangerouslySetInnerHTML={{
          __html: `
            ${performanceConfig.enableAnimations ? `
              @keyframes gradientFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            ` : ''}

            

            .animate-on-scroll {
              opacity: ${isVisible ? 1 : 0};
              transform: translateY(${isVisible ? 0 : '20px'});
              transition: ${performanceConfig.enableAnimations ? `all ${animation.duration} ${animation.easing}` : 'none'};
            }

            /* Desabilitar hover effects para baixa performance */
            ${!performanceConfig.enableAnimations ? `
              .group-hover\\:scale-\\[1\\.02\\] {
                transform: none !important;
              }
              .hover\\:scale-\\[1\\.02\\] {
                transform: none !important;
              }
              .hover\\:shadow-3xl {
                box-shadow: inherit !important;
              }
            ` : ''}
          `
        }} />
      )}

      {/* CSS específico para mobile - portrait e landscape */}
      {isRealMobile && (
        <style dangerouslySetInnerHTML={{
          __html: `
            /* FORÇA layout mobile estático independente da orientação */
            .mobile-static-layout {
              position: relative !important;
              transform: none !important;
              animation: none !important;
              transition: none !important;
              contain: layout style paint;
              overflow: visible !important;
              display: block !important;
              width: 100% !important;
            }

            .mobile-cards-container {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: flex-start !important;
              gap: 1.5rem !important;
              width: 100% !important;
              max-width: 28rem !important;
              margin: 0 auto !important;
              padding: 0 !important;
              position: relative !important;
              transform: none !important;
            }

            .mobile-strategy-card {
              position: relative !important;
              transform: none !important;
              animation: none !important;
              transition: none !important;
              width: 100% !important;
              max-width: 20rem !important;
              margin: 0 auto !important;
              display: block !important;
              float: none !important;
              clear: both !important;
            }

            /* FORÇAR layout mobile em QUALQUER orientação para dispositivos móveis reais */
            .mobile-static-layout,
            .mobile-cards-container,
            .mobile-strategy-card {
              position: relative !important;
              transform: none !important;
              animation: none !important;
              transition: none !important;
              will-change: auto !important;
              backface-visibility: visible !important;
              -webkit-backface-visibility: visible !important;
            }

            /* MOBILE - PORTRAIT E LANDSCAPE IDÊNTICOS (sem diferenças) */
            @media (max-width: 768px), 
                   (max-height: 500px and orientation: landscape) {
              #process-optimization {
                overflow-x: hidden !important;
                overflow-y: auto !important;
              }

              .mobile-static-layout {
                padding: 2rem 1rem !important;
                min-height: auto !important;
                height: auto !important;
                display: block !important;
                position: relative !important;
              }

              .mobile-cards-container {
                gap: 1.5rem !important;
                max-width: 28rem !important;
                padding: 0 !important;
                margin: 0 auto !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                width: 100% !important;
              }

              .mobile-strategy-card {
                max-width: 20rem !important;
                margin: 0 auto !important;
                margin-bottom: 0 !important;
                width: 100% !important;
                position: relative !important;
                transform: none !important;
              }

              /* Cards com formatação IDÊNTICA em portrait e landscape */
              .mobile-strategy-card > div {
                padding: 1rem !important;
                min-height: auto !important;
                height: auto !important;
                position: relative !important;
                transform: none !important;
              }
            }

            /* FORÇAR desabilitação de animações/transforms em QUALQUER mobile */
            @media (max-width: 768px), 
                   (max-height: 500px and orientation: landscape) {
              /* Desabilitar animações globalmente no mobile */
              #process-optimization *,
              .mobile-static-layout *,
              .mobile-cards-container *,
              .mobile-strategy-card * {
                animation: none !important;
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition: none !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
                transform: none !important;
                will-change: auto !important;
                backface-visibility: visible !important;
                -webkit-backface-visibility: visible !important;
                position: relative !important;
              }

              /* Remover backdrop-filter no mobile para performance */
              .mobile-strategy-card .bg-white\\/10,
              .mobile-strategy-card [class*="bg-white/"] {
                background: rgba(255, 255, 255, 0.1) !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
              }

              /* Garantir que SVGs e elementos absolutos não apareçam no mobile */
              .mobile-static-layout svg,
              .mobile-static-layout .absolute {
                display: none !important;
              }

              /* Forçar elementos a serem estáticos */
              .mobile-static-layout .relative {
                position: relative !important;
              }

              /* Prevenir overflow horizontal no mobile landscape */
              body, html, #root {
                overflow-x: hidden !important;
              }
            }

            /* EXTRA: Garantir que hooks responsivos não afetem mobile */
            @media (max-width: 768px), 
                   (max-height: 500px and orientation: landscape) {
              .mobile-static-layout [class*="scale-"],
              .mobile-static-layout [class*="translate-"],
              .mobile-static-layout [class*="rotate-"] {
                transform: none !important;
              }
            }
          `
        }} />
      )}

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        {/* Header with badge and line */}
        <div className={`flex items-center gap-4 mb-4 sm:mb-6 lg:mb-8 w-full ${isRealMobile ? '' : `transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}`}>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pulse-900/50 text-pulse-300 border border-pulse-700/50">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2 font-sans">03</span>
              <span className="font-sans">{t('strategy.badge')}</span>
            </div>
          </div>
                      <div className="flex-1 h-[1px] bg-pulse-700/60"></div>
        </div>

        {/* Main Title */}
        <div className={`max-w-4xl mb-6 sm:mb-10 lg:mb-16 ${isRealMobile ? '' : `transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}`} style={isRealMobile ? {} : { animationDelay: '0.2s' }}>
          <h1 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-3 sm:mb-4 lg:mb-6 font-display">
            <span className="text-white">{t('strategy.title')}</span>
            <br />
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              style={isRealMobile ? {} : {
                backgroundSize: performanceConfig.enableAnimations ? '200% 200%' : '100% 100%',
                animation: performanceConfig.enableAnimations ? 'gradientFlow 3s ease-in-out infinite' : 'none'
              }}
            >
              {t('strategy.titleGradient')}
            </span>
          </h1>
          
          <p className="section-subtitle text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-sans">
            {t('strategy.description')}
          </p>
        </div>

        {/* Renderizar layout baseado na detecção robusta de dispositivo móvel */}
        {(() => {
          // SEMPRE usar layout mobile se for detectado como dispositivo móvel real
          const shouldUseMobileLayout = isRealMobile;
          
          return shouldUseMobileLayout ? <MobileLayout /> : <DesktopLayout />;
        })()}
      </div>
    </section>
  );
};

export default ProcessOptimizationSection; 