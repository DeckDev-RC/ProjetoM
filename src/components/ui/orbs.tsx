import React, { useEffect, useRef, useState } from 'react';
import { usePerformanceDetection, getPerformanceConfig } from '../../hooks/usePerformanceDetection';

interface OrbProps {
  color: string;
  size: number;
  delay: number;
  duration: number;
  path: 'horizontal' | 'diagonal' | 'wave';
  sectionId: string;
  orbId: number;
  enableAnimations: boolean;
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
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    // Throttle mouse events para melhor performance
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateTime.current < 16) return; // ~60fps max
      
      lastUpdateTime.current = now;
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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

  // Verificar se o mouse está na zona de exclusão (versão simplificada)
  const isMouseInExclusionZone = () => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return false;
    
    const heroRect = heroSection.getBoundingClientRect();
    const exclusionTop = heroRect.bottom - 100;
    const exclusionBottom = heroRect.bottom + 100;
    
    return mousePosition.y >= exclusionTop && mousePosition.y <= exclusionBottom;
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
        opacity: isMouseInExclusionZone() ? 0 : 0.2,
        visibility: isMouseInExclusionZone() ? 'hidden' : 'visible',
        boxShadow: `0 0 ${size * 0.8}px ${size * 0.4}px ${color}`,
        mixBlendMode: 'lighten',
        transition: 'opacity 0.3s ease, visibility 0.3s ease'
      }}
    />
  );
};

const Orb: React.FC<OrbProps> = ({ color, size, delay, duration, path, sectionId, orbId, enableAnimations }) => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;
    
    // Simplificar verificação de zona de exclusão
    const isInExclusionZone = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const heroSection = document.getElementById('hero');
      
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        const exclusionTop = heroRect.bottom - 100;
        const exclusionBottom = heroRect.bottom + 100;
        
        const orbCenterY = rect.top + rect.height / 2;
        return orbCenterY >= exclusionTop && orbCenterY <= exclusionBottom;
      }
      
      return false;
    };
    
    // Configurar animação baseada no caminho (versões simplificadas)
    let keyframes;
    
    switch (path) {
      case 'horizontal':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(${Math.random() * 200 - 100}px)`, opacity: 0.3 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(${Math.random() * 200 - 100}px)`, opacity: 0.6 }
        ];
        break;
      case 'diagonal':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(-${size}px)`, opacity: 0.3 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(calc(100vh + ${size}px))`, opacity: 0.6 }
        ];
        break;
      case 'wave':
        keyframes = [
          { transform: `translateX(-${size}px) translateY(0px)`, opacity: 0.3 },
          { transform: `translateX(50vw) translateY(60px)`, opacity: 0.5 },
          { transform: `translateX(calc(100vw + ${size}px)) translateY(0px)`, opacity: 0.3 }
        ];
        break;
      default:
        keyframes = [
          { transform: `translateX(-${size}px)`, opacity: 0.3 },
          { transform: `translateX(calc(100vw + ${size}px))`, opacity: 0.6 }
        ];
    }
    
    // Identificador único para este orbe específico
    const orbUniqueId = `orb-${orbId}`;
    
    // Criar animação simplificada
    const animation = orb.animate(keyframes, {
      duration: duration,
      delay: delay,
      iterations: Infinity,
      easing: 'linear' // Usar linear para melhor performance
    });
    
    globalAnimations[orbUniqueId] = animation;
    
    // Monitor simplificado para zona de exclusão (menos frequente)
    const monitorExclusionZone = () => {
      if (orb && isInExclusionZone(orb)) {
        orb.style.opacity = '0';
        orb.style.visibility = 'hidden';
      } else if (orb) {
        orb.style.opacity = '0.3';
        orb.style.visibility = 'visible';
      }
    };
    
    const monitorInterval = setInterval(monitorExclusionZone, 200); // Reduzido de 50ms para 200ms
    
    return () => {
      animation.cancel();
      clearInterval(monitorInterval);
    };
  }, [delay, duration, path, size, sectionId, orbId]);
  
  return (
    <div
      ref={orbRef}
      className="absolute pointer-events-none blur-lg" // Reduzido blur de xl para lg
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: color,
        top: `${Math.random() * 80 + 10}%`,
        left: '-100px',
        zIndex: 0,
        opacity: 0.3, // Reduzida de 0.4 para 0.3
        boxShadow: `0 0 ${size * 0.6}px ${size * 0.3}px ${color}`, // Reduzido shadow
        mixBlendMode: 'lighten'
      }}
    />
  );
};

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ 
  orbCount = 6,
  sectionId, 
  enableMouseFollow = true 
}) => {
  const devicePerformance = usePerformanceDetection();
  const performanceConfig = getPerformanceConfig(devicePerformance);
  
  // Ajustar contagem de orbs baseado na performance
  let finalOrbCount = orbCount;
  let mouseFollowEnabled = enableMouseFollow;
  
  switch (devicePerformance) {
    case 'mobile':
      finalOrbCount = Math.min(orbCount, 3);
      mouseFollowEnabled = false; // Desabilitar mouse follow no mobile
      break;
    case 'low':
      finalOrbCount = Math.min(orbCount, 4);
      mouseFollowEnabled = false; // Desabilitar mouse follow em dispositivos lentos
      break;
    case 'medium':
      finalOrbCount = Math.min(orbCount, 5);
      mouseFollowEnabled = enableMouseFollow;
      break;
    case 'high':
      finalOrbCount = Math.min(orbCount, 6); // Reduzido de 8 para 6 mesmo em high performance
      mouseFollowEnabled = enableMouseFollow;
      break;
  }
  
  // Cores reduzidas para menos variedade mas melhor performance
  const orbColors = [
    'rgba(147, 51, 234, 0.6)',   // Violet
    'rgba(79, 70, 229, 0.6)',    // Indigo
    'rgba(236, 72, 153, 0.6)',   // Pink
    'rgba(59, 130, 246, 0.6)',   // Blue
  ];
  
  const orbPaths: ('horizontal' | 'diagonal' | 'wave')[] = [
    'horizontal', 'diagonal', 'wave' // Removidos circular e zigzag por serem mais pesados
  ];
  
  // Tamanhos menores para melhor performance
  const orbSizes = [100, 120, 140, 160];
  
  // Durações maiores para menos movimento
  const orbDurations = [20000, 25000, 30000, 35000];
  
  // Orbs que seguem o mouse (reduzidos)
  const mouseFollowOrbs = mouseFollowEnabled ? [
    { color: 'rgba(147, 51, 234, 0.15)', size: 60, followSpeed: 0.015 },
    { color: 'rgba(59, 130, 246, 0.12)', size: 80, followSpeed: 0.01 }
  ] : [];
  
  const floatingOrbs = Array.from({ length: finalOrbCount }).map((_, index) => {
    const size = orbSizes[index % orbSizes.length];
    const delay = index * 2000; // Atrasos maiores
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
        enableAnimations={performanceConfig.enableAnimations}
      />
    );
  });
  
  return (
    <>
      {/* Orbs flutuantes */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {floatingOrbs}
      </div>
      
      {/* Orbs que seguem o mouse (apenas se habilitado) */}
      {mouseFollowOrbs.map((orb, index) => (
        <MouseFollowOrb
          key={`${sectionId}-mouse-orb-${index}`}
          color={orb.color}
          size={orb.size}
          followSpeed={orb.followSpeed}
          orbId={index + 1000}
        />
      ))}
    </>
  );
};