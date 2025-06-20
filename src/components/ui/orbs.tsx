import React, { useEffect, useRef } from 'react';

interface OrbProps {
  color: string;
  size: number;
  delay: number;
  duration: number;
  path: 'horizontal' | 'diagonal' | 'wave';
  sectionId: string;
  orbId: number;
}

interface FloatingOrbsProps {
  orbCount?: number;
  sectionId: string;
}

// Armazenamento global de animações para sincronização entre seções
const globalAnimations: Record<string, Animation> = {};

const Orb: React.FC<OrbProps> = ({ color, size, delay, duration, path, sectionId, orbId }) => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;
    
    // Configurar animação baseada no caminho
    let keyframes;
    
    switch (path) {
      case 'horizontal':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(${Math.random() * 50 - 25}px)`, opacity: 0.4 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(${Math.random() * 50 - 25}px)`, opacity: 0.8 }
        ];
        break;
      case 'diagonal':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(-${size}px)`, opacity: 0.4 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(calc(100% + ${size}px))`, opacity: 0.8 }
        ];
        break;
      case 'wave':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(0px)`, opacity: 0.4 },
          { transform: `translateX(25vw) translateY(50px)`, opacity: 0.8 },
          { transform: `translateX(50vw) translateY(-50px)`, opacity: 0.9 },
          { transform: `translateX(75vw) translateY(30px)`, opacity: 0.8 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(0px)`, opacity: 0.4 }
        ];
        break;
      default:
        keyframes = [
          { transform: `translateX(-${size}px)`, opacity: 0.4 },
          { transform: `translateX(calc(100vw + ${size}px))`, opacity: 0.8 }
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
    
    return () => {
      animation.cancel();
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
        zIndex: 5,
        opacity: 0.4,
        boxShadow: `0 0 ${size * 0.8}px ${size * 0.4}px ${color}`,
        mixBlendMode: 'lighten'
      }}
    />
  );
};

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ orbCount = 3, sectionId }) => {
  // Cores mais vivas para maior visibilidade
  const orbColors = [
    'rgba(147, 51, 234, 0.9)',  // Violet
    'rgba(79, 70, 229, 0.9)',   // Indigo
    'rgba(236, 72, 153, 0.9)',  // Pulse
  ];
  
  const orbPaths: ('horizontal' | 'diagonal' | 'wave')[] = ['horizontal', 'diagonal', 'wave'];
  
  // Tamanhos maiores para os orbes
  const orbSizes = [200, 220, 180];
  
  // Duração consistente para todos os orbes para sincronização
  const orbDurations = [20000, 25000, 22000];
  
  const orbs = Array.from({ length: orbCount }).map((_, index) => {
    const size = orbSizes[index % orbSizes.length];
    const delay = index * 2000; // Escalonar os atrasos
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
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {orbs}
    </div>
  );
}; 