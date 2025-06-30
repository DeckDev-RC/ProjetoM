import { useRef, useEffect, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        
        // Se triggerOnce for true, desconecta o observer após primeira interseção
        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    });
  }, [triggerOnce]);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    // Verifica se IntersectionObserver está disponível
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    observerRef.current.observe(currentElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { elementRef, isVisible };
}; 