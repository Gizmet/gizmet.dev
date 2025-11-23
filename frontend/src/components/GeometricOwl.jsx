import React from 'react';
import OwlGlow from './OwlGlow';

export default function GeometricOwl({ className = '' }) {
  return (
    <div className={`geometric-owl ${className}`}>
      <OwlGlow />
      <img
        src="/owl-reference.png"
        alt="Gizmet Owl"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1
        }}
      />
    </div>
  );
}
