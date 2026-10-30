/**
 * 3D Animation System for Quantivo Solutions
 * High-level animation utilities built on Framer Motion and CSS
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'framer-motion';

// Intersection Observer hook for scroll-triggered animations
export const useScrollAnimation = (
  options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    delay?: number;
  } = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
  } = options;
  
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated || !triggerOnce) {
              setTimeout(() => {
                setIsVisible(true);
                setHasAnimated(true);
              }, delay);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1, rootMargin }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);
  
  return { ref, isVisible, hasAnimated };
};

// Staggered animation hook for lists
export const useStaggeredAnimation = (
  itemCount: number,
  baseDelay: number = 100,
  staggerDelay: number = 100
) => {
  const delays = useMemo(
    () => Array.from({ length: itemCount }, (_, i) => baseDelay + i * staggerDelay),
    [itemCount, baseDelay, staggerDelay]
  );
  
  return delays;
};

// Parallax hook for scroll-based effects
export const useParallax = (
  speed: number = 0.5,
  axis: 'x' | 'y' | 'both' = 'y'
) => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const scrolled = window.scrollY;
      const rate = scrolled * speed;
      
      if (axis === 'y' || axis === 'both') {
        setOffset(prev => ({ ...prev, y: rate }));
      }
      if (axis === 'x' || axis === 'both') {
        setOffset(prev => ({ ...prev, x: rate }));
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, axis]);
  
  return { ref, offset };
};

// Mouse position tracking hook
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mousePosition;
};

// Element-relative mouse position
export const useElementMousePosition = (elementRef: React.RefObject<HTMLElement>) => {
  const [position, setPosition] = useState({ x: 0, y: 0, xNorm: 0, yNorm: 0 });
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xNorm = (x / rect.width) * 2 - 1; // -1 to 1
      const yNorm = (y / rect.height) * 2 - 1;
      
      setPosition({ x, y, xNorm, yNorm });
    };
    
    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0, xNorm: 0, yNorm: 0 });
    };
    
    const element = elementRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [elementRef]);
  
  return position;
};

// 3D tilt hook for cards
export const useCardTilt = (
  options: {
    maxTilt?: number;
    perspective?: number;
    scale?: number;
    speed?: number;
  } = {}
) => {
  const { maxTilt = 10, perspective = 1000, scale = 1.02 } = options;
  const elementRef = useRef<HTMLElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      const rotateY = deltaX * 15; // max 15deg
      const rotateX = -deltaY * 15;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return elementRef;
};

// Floating animation hook
export const useFloatAnimation = (
  amplitude: number = 10,
  duration: number = 3000
) => {
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const y = Math.sin(elapsed / duration * 1000 * Math.PI * 2) * 10;
      
      element.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    };
    
    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [amplitude, duration]);
  
  return elementRef;
};

// Scroll progress hook
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return progress;
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return reduced;
};

// Touch device detection
export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);
  
  return isTouch;
};

// GPU-accelerated transform helper
export const useGPUTransform = () => {
  return useCallback((
    element: HTMLElement,
    transforms: {
      x?: number;
      y?: number;
      z?: number;
      rotateX?: number;
      rotateY?: number;
      rotateZ?: number;
      scale?: number;
    }
  ) => {
    const transformsList: string[] = [];
    
    if (transforms.x !== undefined) transforms.push(`translateX(${transforms.x}px)`);
    if (transforms.y !== undefined) transforms.push(`translateY(${transforms.y}px)`);
    if (transforms.z !== undefined) transforms.push(`translateZ(${transforms.z}px)`);
    if (transforms.rotateX !== undefined) transforms.push(`rotateX(${transforms.rotateX}deg)`);
    if (transforms.rotateY !== undefined) transforms.push(`rotateY(${transforms.rotateY}deg)`);
    if (transforms.rotateZ !== undefined) transforms.push(`rotateZ(${transforms.rotateZ}deg)`);
    if (transforms.scale !== undefined) transforms.push(`scale(${transforms.scale})`);
    
    return `translate3d(0, 0, 0) ${transforms.join(' ')}`;
  }, []);
};

// Performance-optimized animation frame scheduler
export const useAnimationFrame = (callback: (time: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  useEffect(() => {
    let frameId: number;
    let previousTime = 0;
    
    const animate = (time: number) => {
      callback(time - previousTime);
      previousTime = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
};

// Export all hooks
export const animationHooks = {
  useScrollAnimation,
  useStaggeredAnimation,
  useParallax,
  useMousePosition,
  useElementMousePosition,
  useCardTilt,
  useFloatAnimation,
  useScrollProgress,
  useReducedMotion,
  useTouchDevice,
  useGPUTransform,
  useAnimationFrame,
};

export default {
  useScrollAnimation,
  useStaggeredAnimation,
  useParallax,
  useMousePosition,
  useElementMousePosition,
  useCardTilt,
  useFloatAnimation,
  useScrollProgress,
  useReducedMotion,
  useTouchDevice,
  useGPUTransform,
  useAnimationFrame,
};