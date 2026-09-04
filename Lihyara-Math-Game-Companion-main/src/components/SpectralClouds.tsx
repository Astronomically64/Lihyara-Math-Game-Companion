import React, { useEffect, useRef } from 'react';

import { RisingMathParticles } from './RisingMathParticles';

export const SpectralClouds: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate floating spectral light dust particles
    const particleCount = 24;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.3 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      hue: Math.random() > 0.5 ? 45 : 170, // Warm Gold or Spectral Cyan
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

        // Wrap around screens
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = Math.max(0.1, Math.min(0.7, p.alpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 75%, 0.7)`;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Cloud Blob 1: Top-Left Drifting Emerald / Cyan Spectral Light */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-radial-spectral-1 opacity-60 blur-3xl animate-cloud-drift-1" />

      {/* Cloud Blob 2: Center-Right Glowing Golden Amber Aura */}
      <div className="absolute top-1/4 -right-16 w-96 h-96 rounded-full bg-radial-spectral-2 opacity-50 blur-3xl animate-cloud-drift-2" />

      {/* Cloud Blob 3: Bottom-Left Crimson / Magenta Ethereal Cloud */}
      <div className="absolute -bottom-24 -left-16 w-88 h-88 rounded-full bg-radial-spectral-3 opacity-55 blur-3xl animate-cloud-drift-3" />

      {/* Cloud Blob 4: Bottom-Right Deep Oceanic Azure Cloud */}
      <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-radial-spectral-4 opacity-50 blur-3xl animate-cloud-drift-4" />

      {/* Floating Spectral Light Dust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Rising Math Symbol Particles */}
      <RisingMathParticles />
    </div>
  );
};
