import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const OwlGlow = ({ className = '' }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const glowMeshRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const hoverRef = useRef(0);
  const frameRef = useRef(null);

  // Orange accent color
  const accentColor = useMemo(() => new THREE.Color(0xf5a623), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Wait for container to have dimensions
    if (width === 0 || height === 0) {
      width = 600;
      height = 750;
    }

    console.log('OwlGlow initializing:', { width, height });
    console.log('Container element:', container);

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    console.log('Canvas appended:', renderer.domElement);

    // Create central glow mesh
    const glowGeometry = new THREE.PlaneGeometry(4.5, 5.5, 1, 1);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uColor: { value: accentColor }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);

          // Simple radial glow
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);

          // Breathing effect
          float breath = sin(uTime * 0.8) * 0.15 + 0.85;
          glow *= breath;

          gl_FragColor = vec4(uColor, glow * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);
    glowMeshRef.current = glowMesh;

    // Create particles - ember-like spread
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      // Wider spread like embers
      const radius = 0.5 + Math.random() * 4;
      positions[i * 3] = Math.cos(theta) * radius + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      // Upward drift like embers rising
      velocities[i * 3] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = Math.random() * 0.015 + 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      // Much more varied sizes - some tiny, some large
      const sizeRandom = Math.random();
      if (sizeRandom > 0.9) {
        sizes[i] = 15 + Math.random() * 20; // Large embers
      } else if (sizeRandom > 0.6) {
        sizes[i] = 6 + Math.random() * 10; // Medium
      } else {
        sizes[i] = 2 + Math.random() * 4; // Small sparks
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: accentColor },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying float vSize;

        void main() {
          vec3 pos = position;

          // Ember-like rising drift with slight sway
          float uniqueOffset = position.x * 0.5 + position.z * 0.3;
          pos.x += sin(uTime * 0.4 + uniqueOffset) * 0.3;
          pos.y += sin(uTime * 0.2 + position.x * 0.5) * 0.15;

          // Slow upward float
          pos.y += mod(uTime * 0.3 + position.y, 8.0) - 4.0;

          // Mouse attraction
          vec2 toMouse = uMouse * 3.0 - pos.xy;
          float mouseDist = length(toMouse);
          float attraction = 0.8 / (mouseDist * 0.5 + 1.0);
          pos.xy += normalize(toMouse + 0.001) * attraction;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (3.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          // Alpha based on distance from center - wider falloff
          vAlpha = 1.0 - smoothstep(0.0, 5.0, length(pos.xy));
          vSize = size;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vAlpha * 0.9;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = { mesh: particles, velocities };

    // Global mouse move handler - tracks across entire page
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      // Calculate mouse position relative to container center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to -1 to 1 range based on distance from container center
      mouseRef.current.targetX = (e.clientX - centerX) / (rect.width / 2);
      mouseRef.current.targetY = -(e.clientY - centerY) / (rect.height / 2);
    };

    // Hover handlers for glow intensity
    const handleMouseEnter = () => {
      hoverRef.current = 1;
    };

    const handleMouseLeave = () => {
      hoverRef.current = 0;
    };

    // Listen globally for mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.016;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Update glow shader
      if (glowMeshRef.current) {
        glowMeshRef.current.material.uniforms.uTime.value = time;
        glowMeshRef.current.material.uniforms.uMouse.value.set(
          mouseRef.current.x,
          mouseRef.current.y
        );
        // Smooth hover transition
        const currentHover = glowMeshRef.current.material.uniforms.uHover.value;
        glowMeshRef.current.material.uniforms.uHover.value +=
          (hoverRef.current - currentHover) * 0.1;
      }

      // Update particles
      if (particlesRef.current) {
        particlesRef.current.mesh.material.uniforms.uTime.value = time;
        particlesRef.current.mesh.material.uniforms.uMouse.value.set(
          mouseRef.current.x * 2,
          mouseRef.current.y * 2
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);

      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      glowGeometry.dispose();
      glowMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [accentColor]);

  return (
    <div
      ref={containerRef}
      className={`owl-glow ${className}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '250%',
        height: '250%',
        pointerEvents: 'auto',
        zIndex: 0
      }}
    />
  );
};

export default OwlGlow;
