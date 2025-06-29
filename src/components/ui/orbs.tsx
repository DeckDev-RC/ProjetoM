import React, { useEffect, useRef, useState } from 'react';

interface OrbProps {
  color: string;
  size: number;
  delay: number;
  duration: number;
  path: 'horizontal' | 'diagonal' | 'wave' | 'circular' | 'zigzag';
  sectionId: string;
  orbId: number;
}

interface MouseFollowOrbProps {
  color: string;
  size: number;
  followSpeed: number;
  orbId: number;
}

interface FloatingOrbsProps {
  orbCount?: number;
  sectionId: string;
  enableMouseFollow?: boolean;
}

// Armazenamento global de animações para sincronização entre seções
const globalAnimations: Record<string, Animation> = {};

const MouseFollowOrb: React.FC<MouseFollowOrbProps> = ({ color, size, followSpeed, orbId }) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    
    const animate = () => {
      setOrbPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * followSpeed,
        y: prev.y + (mousePosition.y - prev.y) * followSpeed
      }));
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition, followSpeed]);

  // Verificar se o mouse está na zona de exclusão
  const isMouseInExclusionZone = () => {
    const heroSection = document.getElementById('hero');
    const showcaseSection = document.getElementById('showcase');
    
    if (heroSection && showcaseSection) {
      const heroRect = heroSection.getBoundingClientRect();
      const showcaseRect = showcaseSection.getBoundingClientRect();
      
             const exclusionTop = heroRect.bottom - 200;
       const exclusionBottom = showcaseRect.top + 200;
      
      return mousePosition.y >= exclusionTop && mousePosition.y <= exclusionBottom;
    }
    
    return false;
  };

  return (
    <div
      ref={orbRef}
      className="fixed pointer-events-none blur-lg"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: color,
        left: `${orbPosition.x - size / 2}px`,
        top: `${orbPosition.y - size / 2}px`,
        zIndex: 0,
        opacity: isMouseInExclusionZone() ? 0 : 0.3,
        visibility: isMouseInExclusionZone() ? 'hidden' : 'visible',
        boxShadow: `0 0 ${size * 1.2}px ${size * 0.6}px ${color}`,
        mixBlendMode: 'lighten',
        transition: 'opacity 0.3s ease, visibility 0.3s ease'
      }}
    />
  );
};

const Orb: React.FC<OrbProps> = ({ color, size, delay, duration, path, sectionId, orbId }) => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;
    
    // Função para verificar se o orb está na zona de exclusão (divisa Hero/ImageShowcase)
    const isInExclusionZone = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const heroSection = document.getElementById('hero');
      const showcaseSection = document.getElementById('showcase');
      
      if (heroSection && showcaseSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const showcaseRect = showcaseSection.getBoundingClientRect();
        
        // Zona de exclusão: 200px antes do fim do Hero até 200px após o início do ImageShowcase
        const exclusionTop = heroRect.bottom - 200;
        const exclusionBottom = showcaseRect.top + 200;
        
        const orbCenterY = rect.top + rect.height / 2;
        const orbRadius = rect.height / 2;
        
        // Verificar se qualquer parte do orb está na zona de exclusão
        return (orbCenterY - orbRadius) <= exclusionBottom && (orbCenterY + orbRadius) >= exclusionTop;
      }
      
      return false;
    };
    
    // Configurar animação baseada no caminho
    let keyframes;
    
    // Calcular posição Y que evite a zona de exclusão
    const getYPosition = () => {
      const heroSection = document.getElementById('hero');
      const showcaseSection = document.getElementById('showcase');
      
      if (heroSection && showcaseSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const showcaseRect = showcaseSection.getBoundingClientRect();
        const exclusionTop = heroRect.bottom - 200;
        const exclusionBottom = showcaseRect.top + 200;
        const exclusionZoneHeight = exclusionBottom - exclusionTop;
        
        // Se a zona de exclusão existe, evitar essa área
        if (exclusionZoneHeight > 0) {
          const randomY = Math.random() * 100 - 50;
          const viewportY = (randomY / 100) * window.innerHeight;
          
          // Se estaria na zona de exclusão, mover para cima ou para baixo
          if (viewportY >= exclusionTop && viewportY <= exclusionBottom) {
            return randomY < 0 ? Math.min(-50, randomY - 30) : Math.max(50, randomY + 30);
          }
        }
      }
      
      return Math.random() * 100 - 50;
    };
    
    switch (path) {
      case 'horizontal':
        const yPos = getYPosition();
        keyframes = [
          { transform: `translateX(-${size}px) translateY(${yPos}px)`, opacity: 0.3 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(${yPos}px)`, opacity: 0.7 }
        ];
        break;
      case 'diagonal':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(-${size}px)`, opacity: 0.3 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(calc(100vh + ${size}px))`, opacity: 0.7 }
        ];
        break;
      case 'wave':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(0px)`, opacity: 0.3 },
          { transform: `translateX(25vw) translateY(80px)`, opacity: 0.6 },
          { transform: `translateX(50vw) translateY(-80px)`, opacity: 0.8 },
          { transform: `translateX(75vw) translateY(60px)`, opacity: 0.6 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(0px)`, opacity: 0.3 }
        ];
        break;
      case 'circular':
        keyframes = [
          { transform: `translateX(50vw) translateY(50vh) rotate(0deg) translateX(${size * 2}px) rotate(0deg)`, opacity: 0.4 },
          { transform: `translateX(50vw) translateY(50vh) rotate(360deg) translateX(${size * 2}px) rotate(-360deg)`, opacity: 0.7 }
        ];
        break;
      case 'zigzag':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(20vh)`, opacity: 0.3 },
          { transform: `translateX(20vw) translateY(80vh)`, opacity: 0.6 },
          { transform: `translateX(40vw) translateY(20vh)`, opacity: 0.8 },
          { transform: `translateX(60vw) translateY(80vh)`, opacity: 0.6 },
          { transform: `translateX(80vw) translateY(20vh)`, opacity: 0.7 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(80vh)`, opacity: 0.3 }
        ];
        break;
      default:
        keyframes = [
          { transform: `translateX(-${size}px)`, opacity: 0.3 },
          { transform: `translateX(calc(100vw + ${size}px))`, opacity: 0.7 }
        ];
    }
    
    // Identificador único para este orbe específico
    const orbUniqueId = `orb-${orbId}`;
    
    // Se já existe uma animação global para este orbe, use o mesmo progresso
    let animation: Animation;
    
    if (globalAnimations[orbUniqueId]) {
      // Usar o progresso da animação existente para sincronizar
      const existingAnimation = globalAnimations[orbUniqueId];
      const currentTime = existingAnimation.currentTime;
      
      animation = orb.animate(keyframes, {
        duration: duration,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      
      // Sincronizar com a animação existente
      if (currentTime !== null) {
        animation.currentTime = currentTime;
      }
    } else {
      // Criar uma nova animação
      animation = orb.animate(keyframes, {
        duration: duration,
        delay: delay,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      
      // Armazenar para sincronização
      globalAnimations[orbUniqueId] = animation;
    }
    
    // Monitor em tempo real para esconder orbs na zona de exclusão
    const monitorExclusionZone = () => {
      if (orb && isInExclusionZone(orb)) {
        orb.style.opacity = '0';
        orb.style.visibility = 'hidden';
      } else if (orb) {
        orb.style.opacity = '0.4';
        orb.style.visibility = 'visible';
      }
    };
    
    const monitorInterval = setInterval(monitorExclusionZone, 50);
    
    return () => {
      animation.cancel();
      clearInterval(monitorInterval);
      // Não remova do globalAnimations para manter a sincronização entre seções
    };
  }, [delay, duration, path, size, sectionId, orbId]);
  
  return (
    <div
      ref={orbRef}
      className="absolute pointer-events-none blur-xl"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: color,
        top: `${Math.random() * 80 + 10}%`,
        left: '-100px',
        zIndex: 0,
        opacity: 0.4,
        boxShadow: `0 0 ${size * 0.8}px ${size * 0.4}px ${color}`,
        mixBlendMode: 'lighten'
      }}
    />
  );
};

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ 
  orbCount = 6, // Reduzido de 8 para 6
  sectionId, 
  enableMouseFollow = true 
}) => {
  // Detectar dispositivo móvel para reduzir orbs
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const finalOrbCount = isMobile ? Math.min(orbCount, 3) : orbCount; // Máximo 3 em mobile
  
  // Cores expandidas para mais variedade
  const orbColors = [
    'rgba(147, 51, 234, 0.8)',   // Violet
    'rgba(79, 70, 229, 0.8)',    // Indigo
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(139, 92, 246, 0.8)',   // Purple
  ];
  
  const orbPaths: ('horizontal' | 'diagonal' | 'wave' | 'circular' | 'zigzag')[] = [
    'horizontal', 'diagonal', 'wave', 'circular', 'zigzag'
  ];
  
  // Variação maior de tamanhos
  const orbSizes = [120, 150, 180, 200, 220, 250, 100, 130];
  
  // Durações variadas para mais dinamismo
  const orbDurations = [15000, 20000, 25000, 30000, 18000, 22000, 28000, 16000];
  
  // Orbs que seguem o mouse
  const mouseFollowOrbs = enableMouseFollow ? [
    { color: 'rgba(147, 51, 234, 0.2)', size: 80, followSpeed: 0.02 },
    { color: 'rgba(236, 72, 153, 0.15)', size: 120, followSpeed: 0.015 },
    { color: 'rgba(59, 130, 246, 0.18)', size: 100, followSpeed: 0.025 }
  ] : [];
  
  const floatingOrbs = Array.from({ length: finalOrbCount }).map((_, index) => {
    const size = orbSizes[index % orbSizes.length];
    const delay = index * 1500; // Atrasos menores para mais movimento
    const duration = orbDurations[index % orbDurations.length];
    const color = orbColors[index % orbColors.length];
    const path = orbPaths[index % orbPaths.length];
    
    return (
      <Orb
        key={`${sectionId}-orb-${index}`}
        color={color}
        size={size}
        delay={delay}
        duration={duration}
        path={path}
        sectionId={sectionId}
        orbId={index}
      />
    );
  });
  
  return (
    <>
      {/* Orbs flutuantes */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {floatingOrbs}
      </div>
      
      {/* Orbs que seguem o mouse */}
      {mouseFollowOrbs.map((orb, index) => (
        <MouseFollowOrb
          key={`${sectionId}-mouse-orb-${index}`}
          color={orb.color}
          size={orb.size}
          followSpeed={orb.followSpeed}
          orbId={index + 1000} // ID único para evitar conflitos
        />
      ))}
    </>
  );
}; 