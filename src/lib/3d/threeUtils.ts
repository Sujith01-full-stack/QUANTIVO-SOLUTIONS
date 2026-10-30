/**
 * Three.js 3D Utilities for Quantivo Solutions
 * Core Three.js utilities, scene management, and WebGL detection
 */

import * as THREE from 'three';

// WebGL/Three.js capability detection
export const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

export const isWebGL2Available = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGL2RenderingContext &&
      canvas.getContext('webgl2')
    );
  } catch (e) {
    return false;
  }
};

export const getWebGLInfo = (): { 
  webgl: boolean; 
  webgl2: boolean; 
  renderer: string;
  vendor: string;
} => {
  if (typeof document === 'undefined') {
    return { webgl: false, webgl2: false, renderer: 'SSR', vendor: 'SSR' };
  }
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) {
    return { webgl: false, webgl2: false, renderer: 'none', vendor: 'none' };
  }
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) 
    : 'Unknown';
  const vendor = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) 
    : 'Unknown';
  
  return {
    webgl: !!canvas.getContext('webgl'),
    webgl2: !!canvas.getContext('webgl2'),
    renderer,
    vendor
  };
};

// Theme-aware color utilities
export const getThemeColors = (isDark: boolean) => {
  if (isDark) {
    return {
      background: 0x080808,
      surface: 0x101010,
      primary: 0xff6a00,
      primaryLight: 0xff8533,
      text: 0xffffff,
      textSecondary: 0xbdbdbd,
      border: 0x333333,
      glow: 0xff6a00,
      cardBg: 0x151515,
      cardBorder: 0x333333,
    };
  }
  
  return {
    background: 0xffffff,
    surface: 0xf8fafc,
    primary: 0xff6a00,
    primaryLight: 0xff8533,
    text: 0x111111,
    textSecondary: 0x555555,
    border: 0xe5e7eb,
    glow: 0xff6a00,
    cardBg: 0xffffff,
    cardBorder: 0xeaeaea,
  };
};

// Create a theme-aware material
export const createThemeMaterial = (
  isDark: boolean,
  type: 'standard' | 'physical' | 'meshBasic' = 'standard',
  options: Record<string, any> = {}
) => {
  const colors = getThemeColors(isDark);
  
  const baseOptions = {
    color: options.color || colors.surface,
    metalness: options.metalness ?? 0.1,
    roughness: options.roughness ?? 0.8,
    ...options
  };
  
  switch (type) {
    case 'physical':
      return new THREE.MeshPhysicalMaterial({
        ...baseOptions,
        clearcoat: options.clearcoat ?? 0.1,
        clearcoatRoughness: options.clearcoatRoughness ?? 0.5,
      });
    case 'meshBasic':
      return new THREE.MeshBasicMaterial({
        color: options.color || colors.surface,
        transparent: options.transparent ?? false,
        opacity: options.opacity ?? 1,
      });
    default:
      return new THREE.MeshStandardMaterial(baseOptions);
  }
};

// Create a glow material for highlights
export const createGlowMaterial = (isDark: boolean, color: number = 0xff6a00) => {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
};

// Create a glass/morph material for premium cards
export const createGlassMaterial = (isDark: boolean) => {
  return new THREE.MeshPhysicalMaterial({
    color: isDark ? 0x151515 : 0xffffff,
    metalness: 0,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.5,
    ior: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.95,
  });
};

// Create an animated shader material for floating shapes
export const createAnimatedShapeMaterial = (isDark: boolean, baseColor: number = 0xff6a00) => {
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.2,
    roughness: 0.6,
    emissive: baseColor,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: 0.9,
  });
};

// Create a starfield background
export const createStarfield = (count: number = 500, isDark: boolean = true) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  
  const colorsDark = [0xff6a00, 0xff8533, 0xffaa44, 0xffffff];
  const colorsLight = [0xff6a00, 0xff8533, 0xffaa44, 0x111111];
  
  for (let i = 0; i < count; i++) {
    const radius = 50 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    const colorArray = isDark ? colorsDark : colorsLight;
    const color = new THREE.Color(colorArray[Math.floor(Math.random() * colorArray.length)]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    sizes[i] = Math.random() * 2 + 0.5;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });
  
  return new THREE.Points(geometry, material);
};

// Floating animation utility
export const createFloatingAnimation = (
  mesh: THREE.Mesh | THREE.Object3D,
  options: {
    amplitude?: number;
    speed?: number;
    rotationSpeed?: number;
    axis?: 'x' | 'y' | 'z';
  } = {}
) => {
  const {
    amplitude = 0.5,
    speed = 1,
    rotationSpeed = 0.2,
    axis = 'y',
  } = options;
  
  const startY = mesh.position.y;
  const startRotation = mesh.rotation[axis];
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = (Date.now() - startTime) * 0.001 * speed;
    
    // Floating motion
    mesh.position.y = startY + Math.sin(elapsed) * amplitude;
    
    // Gentle rotation
    if (rotationSpeed > 0) {
      mesh.rotation[axis] = startRotation + elapsed * rotationSpeed;
    }
    
    requestAnimationFrame(animate);
  };
  
  animate();
  
  return () => {
    // Cleanup would go here if we tracked the animation frame
  };
};

// Mouse-following 3D tilt effect
export const createMouseTiltEffect = (
  element: HTMLElement,
  mesh: THREE.Object3D,
  options: {
    maxTilt?: number;
    perspective?: number;
    scale?: number;
  } = {}
) => {
  const { maxTilt = 0.15, perspective = 1000, scale = 1.02 } = options;
  
  let rafId: number;
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    targetRotation.x = -deltaY * maxTilt;
    targetRotation.y = deltaX * maxTilt;
  };
  
  const handleMouseLeave = () => {
    targetRotation = { x: 0, y: 0 };
  };
  
  const animate = () => {
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
    
    mesh.rotation.x = currentRotation.x;
    mesh.rotation.y = currentRotation.y;
    
    rafId = requestAnimationFrame(animate);
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  animate();
  
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    cancelAnimationFrame(rafId);
  };
};

// Parallax effect for scroll
export const createParallaxEffect = (
  element: HTMLElement,
  options: {
    speed?: number;
    axis?: 'x' | 'y' | 'both';
  } = {}
) => {
  const { speed = 0.5, axis = 'y' } = options;
  
  const handleScroll = () => {
    const scrolled = window.scrollY;
    const rate = scrolled * speed;
    
    if (axis === 'y' || axis === 'both') {
      element.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
    if (axis === 'x' || axis === 'both') {
      element.style.transform = `translate3d(${rate}px, 0, 0)`;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Reduced motion checker
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Touch device detection
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Animation frame scheduler
export class AnimationScheduler {
  private callbacks: Map<number, () => void> = new Map();
  private running = false;
  private nextId = 0;
  
  add(callback: () => void): number {
    const id = this.nextId++;
    this.callbacks.set(id, callback);
    if (!this.running) {
      this.running = true;
      this.run();
    }
    return id;
  }
  
  remove(id: number): void {
    this.callbacks.delete(id);
    if (this.callbacks.size === 0) {
      this.running = false;
    }
  }
  
  private run = () => {
    if (this.callbacks.size === 0) {
      this.running = false;
      return;
    }
    
    this.callbacks.forEach(cb => cb());
    requestAnimationFrame(this.run);
  };
  
  clear(): void {
    this.callbacks.clear();
    this.running = false;
  }
}

// Export a singleton instance
export const animationScheduler = new AnimationScheduler();

// CSS 3D Transform utilities
export const css3d = {
  // Apply 3D transform with perspective
  perspective: (element: HTMLElement, depth: number = 1000) => {
    element.style.perspective = `${depth}px`;
    element.style.transformStyle = 'preserve-3d';
  },
  
  // Apply 3D transform to child elements
  preserve3d: (element: HTMLElement) => {
    element.style.transformStyle = 'preserve-3d';
  },
  
  // Remove 3D transforms
  flat: (element: HTMLElement) => {
    element.style.transformStyle = 'flat';
    element.style.transform = 'none';
  },
  
  // Rotate X
  rotateX: (element: HTMLElement, deg: number) => {
    element.style.transform = `rotateX(${deg}deg)`;
  },
  
  // Rotate Y
  rotateY: (element: HTMLElement, deg: number) => {
    element.style.transform = `rotateY(${deg}deg)`;
  },
  
  // Rotate X and Y
  rotateXY: (element: HTMLElement, x: number, y: number) => {
    element.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  },
  
  // Translate Z
  translateZ: (element: HTMLElement, px: number) => {
    element.style.transform = `translateZ(${px}px)`;
  },
  
  // Scale
  scale: (element: HTMLElement, scale: number) => {
    element.style.transform = `scale(${scale})`;
  },
  
  // Translate 3D
  translate3d: (element: HTMLElement, x: number, y: number, z: number) => {
    element.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  },
  
  // Combined transform
  transform: (element: HTMLElement, transforms: {
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    translateX?: number;
    translateY?: number;
    translateZ?: number;
    scale?: number;
  }) => {
    const parts: string[] = [];
    
    if (transforms.rotateX !== undefined) parts.push(`rotateX(${transforms.rotateX}deg)`);
    if (transforms.rotateY !== undefined) parts.push(`rotateY(${transforms.rotateY}deg)`);
    if (transforms.rotateZ !== undefined) parts.push(`rotateZ(${transforms.rotateZ}deg)`);
    if (transforms.translateX !== undefined) parts.push(`translateX(${transforms.translateX}px)`);
    if (transforms.translateY !== undefined) parts.push(`translateY(${transforms.translateY}px)`);
    if (transforms.translateZ !== undefined) parts.push(`translateZ(${transforms.translateZ}px)`);
    if (transforms.scale !== undefined) parts.push(`scale(${transforms.scale})`);
    
    element.style.transform = parts.join(' ');
  },
  
  // Reset all transforms
  reset: (element: HTMLElement) => {
    element.style.transform = '';
    element.style.transformStyle = '';
    element.style.perspective = '';
  },
};

// Create a floating animation for CSS elements
export const createFloatAnimation = (
  element: HTMLElement,
  options: {
    amplitude?: number;
    duration?: number;
    delay?: number;
  } = {}
) => {
  const { amplitude = 10, duration = 3000, delay = 0 } = options;
  
  const keyframes = `
    @keyframes float-${Date.now()} {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-${amplitude}px); }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = keyframes;
  document.head.appendChild(styleSheet);
  
  const animationName = `float-${Date.now()}`;
  const elementStyle = element.style;
  elementStyle.animation = `${animationName} ${duration}ms ease-in-out ${delay}ms infinite`;
  
  return () => {
    element.style.animation = '';
    styleSheet.remove();
  };
};

// 3D card tilt effect for CSS elements
export const createCardTilt = (
  element: HTMLElement,
  options: {
    maxTilt?: number;
    perspective?: number;
    scale?: number;
    speed?: number;
  } = {}
) => {
  const { maxTilt = 10, perspective = 1000, scale = 1.02, speed = 0.1 } = options;
  
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let rafId: number;
  
  const elementStyle = element.style;
  elementStyle.transformStyle = 'preserve-3d';
  elementStyle.transition = `transform ${speed}s ease-out`;
  
  const animate = () => {
    // Smooth interpolation
    const currentRotateX = parseFloat(element.style.transform.match(/rotateX\(([^)]+)\)/)?.[1] || '0');
    const currentRotateY = parseFloat(element.style.transform.match(/rotateY\(([^)]+)\)/)?.[1] || '0');
    
    // We'll use a simpler approach - just set the target and let CSS transition handle it
    rafId = requestAnimationFrame(() => {});
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    const rotateY = deltaX * 10; // max 10deg
    const rotateX = -deltaY * 10;
    
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
    element.style.transform = '';
    element.style.transition = '';
    element.style.transformStyle = '';
  };
};

export default {
  isWebGLAvailable,
  isWebGL2Available,
  getWebGLInfo,
  getThemeColors,
  createThemeMaterial,
  createGlowMaterial,
  createGlassMaterial,
  createAnimatedShapeMaterial,
  createStarfield,
  createFloatingAnimation,
  createMouseTiltEffect,
  createParallaxEffect,
  prefersReducedMotion,
  isTouchDevice,
  debounce,
  throttle,
  AnimationScheduler,
  animationScheduler,
  css3d,
  createFloatAnimation,
  createCardTilt,
};