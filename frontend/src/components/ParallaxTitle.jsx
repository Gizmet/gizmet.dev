import React, { useRef, useEffect, useState } from 'react';

const ParallaxTitle = ({ children, className = '' }) => {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center of element
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Even more subtle on mobile
      const multiplier = isMobile ? 0.3 : 1;
      setTransform({
        x: deltaX * 5 * multiplier,
        y: deltaY * 3 * multiplier,
        rotateX: -deltaY * 1.5 * multiplier,
        rotateY: deltaX * 1.5 * multiplier
      });
    };

    const handleMouseLeave = () => {
      setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className={`parallax-title-container ${className}`}
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%'
      }}
    >
      {/* Shadow/depth layer */}
      <h1
        className="hero-title parallax-shadow"
        style={{
          position: 'absolute',
          transform: `translate3d(${transform.x * 0.3}px, ${transform.y * 0.3}px, -30px) rotateX(${transform.rotateX * 0.5}deg) rotateY(${transform.rotateY * 0.5}deg)`,
          transition: 'transform 0.15s ease-out',
          opacity: 0.15,
          filter: 'blur(8px)',
          color: 'var(--accent)',
          pointerEvents: 'none'
        }}
      >
        {children}
      </h1>

      {/* Mid layer - subtle accent glow */}
      <h1
        className="hero-title parallax-glow"
        style={{
          position: 'absolute',
          transform: `translate3d(${transform.x * 0.5}px, ${transform.y * 0.5}px, -15px) rotateX(${transform.rotateX * 0.7}deg) rotateY(${transform.rotateY * 0.7}deg)`,
          transition: 'transform 0.12s ease-out',
          opacity: 0.08,
          filter: 'blur(4px)',
          color: 'var(--accent)',
          pointerEvents: 'none'
        }}
      >
        {children}
      </h1>

      {/* Main text layer */}
      <h1
        className="hero-title"
        style={{
          position: 'relative',
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </h1>
    </div>
  );
};

export default ParallaxTitle;
