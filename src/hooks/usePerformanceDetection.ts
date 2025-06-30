import { useState, useEffect } from 'react';

export type DevicePerformance = 'mobile' | 'low' | 'medium' | 'high';

export const usePerformanceDetection = (): DevicePerformance => {
  const [performance, setPerformance] = useState<DevicePerformance>('high');

  useEffect(() => {
    const detectPerformance = (): DevicePerformance => {
      if (typeof window === 'undefined') return 'high';
      
      // Verificar se é mobile
      const isMobile = window.innerWidth < 768;
      if (isMobile) return 'mobile';
      
      // Verificar especificações do hardware
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency;
      
      // Dispositivos com baixa performance
      if (memory && memory < 4) return 'low';
      if (cores && cores < 4) return 'low';
      
      // Verificar carga da página
      const elementCount = document.querySelectorAll('*').length;
      if (elementCount > 1000) return 'medium';
      
      // Verificar se há animações pesadas rodando
      const runningAnimations = document.getAnimations?.().length || 0;
      if (runningAnimations > 10) return 'medium';
      
      return 'high';
    };

    // Detectar performance inicial
    setPerformance(detectPerformance());

    // Re-detectar em mudanças de viewport
    const handleResize = () => {
      setPerformance(detectPerformance());
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    // Re-detectar após mudanças no DOM (throttled)
    let resizeTimeout: NodeJS.Timeout;
    const handleDOMChange = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setPerformance(detectPerformance());
      }, 1000);
    };

    // Observer para mudanças no DOM
    const observer = new MutationObserver(handleDOMChange);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: false
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  return performance;
};

// Configurações de performance por tipo de dispositivo
export const getPerformanceConfig = (performance: DevicePerformance) => {
  switch (performance) {
    case 'mobile':
      return {
        orbCount: 3,
        enableMouseFollow: false,
        enableParallax: false,
        enableAnimations: false,
        videoQuality: 'low',
        blurIntensity: 'sm',
        throttleMs: 100
      };
    case 'low':
      return {
        orbCount: 4,
        enableMouseFollow: false,
        enableParallax: false,
        enableAnimations: false,
        videoQuality: 'medium',
        blurIntensity: 'md',
        throttleMs: 80
      };
    case 'medium':
      return {
        orbCount: 5,
        enableMouseFollow: true,
        enableParallax: false,
        enableAnimations: true,
        videoQuality: 'medium',
        blurIntensity: 'lg',
        throttleMs: 60
      };
    case 'high':
      return {
        orbCount: 6,
        enableMouseFollow: true,
        enableParallax: true,
        enableAnimations: true,
        videoQuality: 'high',
        blurIntensity: 'xl',
        throttleMs: 32
      };
    default:
      return {
        orbCount: 6,
        enableMouseFollow: true,
        enableParallax: true,
        enableAnimations: true,
        videoQuality: 'high',
        blurIntensity: 'xl',
        throttleMs: 32
      };
  }
}; 