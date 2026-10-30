/**
 * 3D Components for Quantivo Solutions
 * Reusable React Three Fiber components for 3D effects
 */

'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  Html, 
  Float, 
  Scroll, 
  ScrollControls, 
  useScroll 
} from '@react-three/drei';
import * as THREE from 'three';

// Extend Three.js types
extend(THREE);

// Simple floating shapes component
interface FloatingShapesProps {
  count?: number;
  isDark?: boolean;
  speed?: number;
  spread?: number;
}

export const SimpleFloatingShapes: React.FC<FloatingShapesProps> = ({
  count = 12,
  isDark = false,
  speed = 0.5,
  spread = 10,
}) => {
  const shapes = useMemo(() => {
    const shapesList = [];
    const geometries = [
      'box', 'sphere', 'cone', 'torus', 'octahedron', 'dodecahedron'
    ];
    
    const colors = isDark 
      ? [0xff6a00, 0xff8533, 0xffaa44, 0xffcc66, 0xff6a00, 0xff8533]
      : [0xff6a00, 0xff8533, 0xffaa44, 0xffcc66, 0xff6a00, 0xff8533];
    
    for (let i = 0; i < count; i++) {
      shapesList.push({
        geometry: geometries[i % 6],
        color: colors[i % colors.length],
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 20,
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.3 + Math.random() * 0.4,
        speed: 0.3 + Math.random() * 0.4,
        colorIndex: i % colors.length,
      });
    }
    return shapesList;
  }, [count, isDark]);
  
  return (
    <group>
      {shapes.map((shape, i) => (
        <FloatingShape
          key={i}
          geometryType={shape.geometry as any}
          color={shape.color}
          position={shape.position as [number, number, number]}
          initialRotation={shape.rotation as [number, number, number]}
          scale={shape.scale}
          speed={shape.speed}
          colorIndex={shape.colorIndex}
        />
      ))}
    </group>
  );
};

// Individual floating shape with animation
interface FloatingShapeProps {
  geometryType: 'box' | 'sphere' | 'cone' | 'torus' | 'octahedron' | 'dodecahedron';
  color: number;
  position: [number, number, number];
  initialRotation: [number, number, number];
  scale: number;
  speed: number;
  colorIndex: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  geometryType,
  color,
  position,
  initialRotation,
  scale,
  speed,
  colorIndex,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3 * speed;
      meshRef.current.rotation.y += delta * 0.5 * speed;
      meshRef.current.rotation.z += delta * 0.2 * speed;
      
      // Gentle floating
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001 * speed) * 0.15;
    }
  }, []);
  const geometryMap = {
    box: <boxGeometry args={[1, 1, 1]} />,
    sphere: <sphereGeometry args={[0.6, 32, 32]} />,
    cone: <coneGeometry args={[0.5, 1, 32]} />,
    torus: <torusGeometry args={[0.5, 0.2, 16, 32]} />,
    octahedron: <octahedronGeometry args={[0.6]} />,
    dodecahedron: <dodecahedronGeometry args={[0.6]} />,
  };
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={initialRotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      {geometryMap[geometryType]}
      <meshStandardMaterial
        color={color}
        metalness={0.1}
        roughness={0.7}
        transparent
        opacity={0.85}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
};

// 3D Card Tilt Effect Component
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1000,
  scale = 1.03,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    const rotateY = deltaX * 15;
    const rotateX = -deltaY * 15;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.1s ease-out',
      cursor: 'pointer',
    });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.3s ease-out',
    });
  }, []);
  
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// 3D Floating Card wrapper for content
interface FloatingCard3DProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  hoverLift?: number;
}

export const FloatingCard3D: React.FC<FloatingCard3DProps> = ({
  children,
  className = '',
  amplitude = 8,
  duration = 3000,
  hoverLift = 12,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Use CSS animation instead for better performance
  }, []);
  
  return (
    <div
      ref={ref}
      className={`${className} floating-card-3d`}
      style={{
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
}

// 3D Button with depth effect
interface Button3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  icon,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 28px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    border: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
  };
  
  // Calculate dynamic styles based on state
  const getDynamicStyle = () => {
    const isDarkMode = isDark;
    const isPrimary = variant === 'primary';
    
    const baseShadow = isHovered 
      ? '0 12px 32px rgba(255, 106, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.15)'
      : '0 4px 16px rgba(255, 106, 0, 0.3)';
    
    const pressedTransform = isPressed 
      ? 'translateZ(-2px) scale(0.98)' 
      : 'translateZ(0) scale(1)';
    
    const hoverTransform = isHovered && !isPressed
      ? 'translateZ(4px) scale(1.01)'
      : 'translateZ(0) scale(1)';
    
    const bgColor = isPrimary 
      ? (isDarkMode ? '#ff6a00' : '#ff6a00')
      : (isDarkMode ? '#1e1e1e' : '#f5f5f5');
    
    const textColor = isPrimary 
      ? '#ffffff' 
      : (isDarkMode ? '#ffffff' : '#111111');
    
    const borderColor = isPrimary 
      ? 'transparent' 
      : (isDarkMode ? '#333' : '#e5e7eb');
    
    return {
      ...baseStyle,
      background: baseStyle.background || bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      boxShadow: baseShadow,
      transform: `${pressedTransform} ${hoverTransform}`,
    };
  };
  
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <button
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={`btn-3d ${className}`}
      style={getDynamicStyle()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}

// 3D Perspective Container for sections
interface PerspectiveContainerProps {
  children: React.ReactNode;
  className?: string;
  perspective?: number;
  style?: React.CSSProperties;
}

export const PerspectiveContainer: React.FC<PerspectiveContainerProps> = ({
  children,
  className = '',
  perspective = 1000,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

// 3D Floating Element
interface Float3DProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  className?: string;
}

export const Float3D: React.FC<Float3DProps> = ({
  children,
  amplitude = 15,
  duration = 3000,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  useEffect(() => {
    // Use CSS animation instead
  }, []);
  
  return (
    <div
      className={`float-3d ${className}`}
      style={{
        animation: `float-3d 3s ease-in-out infinite`,
      }}
    >
      {children}
    </div>
  );
}

// 3D Grid Background
interface Grid3DProps {
  size?: number;
  divisions?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export const Grid3D: React.FC<Grid3DProps> = ({
  size = 100,
  divisions = 50,
  color = '#ff6a00',
  opacity = 0.05,
  className = '',
}) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return (
    <group>
      <gridHelper args={[size, divisions, color, color]} />
    </group>
  );
}

// 3D Background with floating particles
interface Particles3DProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: number;
  className?: string;
}

export const Particles3D: React.FC<Particles3DProps> = ({
  count = 200,
  color = '#ff6a00',
  size = 2,
  speed = 0.5,
  spread = 50,
  className = '',
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = spread * 0.5 + Math.random() * spread * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const colorObj = new THREE.Color(color);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
      
      sizes[i] = Math.random() * 2 + 1;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, [count, color, spread]);
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * speed * 0.1;
      particlesRef.current.rotation.x += delta * speed * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef} className={className}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count * 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count * 3} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 3D Scene Wrapper for pages
interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  background?: number;
  fog?: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  className = '',
  background = 0xffffff,
  fog = false,
}) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 50], fov: 50 }}
      shadows
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <color attach="background" args={[isDark ? 0x080808 : 0xffffff]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={0.4} />
      {children}
    </Canvas>
  );
}

export default {
  SimpleFloatingShapes,
  FloatingShape,
  Card3D,
  FloatingCard3D,
  Button3D,
  PerspectiveContainer,
  Float3D,
  Grid3D,
  Particles3D,
  Scene3D,
};