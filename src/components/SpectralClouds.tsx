import React, { useEffect, useRef } from 'react';
import { RisingMathParticles } from './RisingMathParticles';

/**
 * SpectralClouds — full-viewport animated background layer.
 * Renders: animated CSS blob clouds + floating dust canvas + rising math particles.
 * Designed to sit as a fixed/absolute child of a full-screen container.
 * Deviation: clouds now use Lihyara grade-themed colors (forest/gold/terracotta/ocean)
 * instead of generic teal/cyan, matching the board game's visual identity.
 */
export const SpectralClouds: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    setSize();

    const handleResize = () => setSize();
    window.addEventListener('resize', handleResize);

    // Lihyara-themed dust: forest green, gold, teal, terracotta
    const DUST_HUES = [140, 44, 175, 16];

    const particleCount = 30;
    const particles = Array.from({ length: particleCount }).map(() => ({
      fx: Math.random(),
      fy: Math.random(),
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.0002,
      speedY: -(Math.random() * 0.0003 + 0.0001),
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      hue: DUST_HUES[Math.floor(Math.random() * DUST_HUES.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.fx += p.speedX;
        p.fy += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.003;

        if (p.fy < -10 / height) p.fy = 1 + 10 / height;
        if (p.fx < -10 / width) p.fx = 1 + 10 / width;
        if (p.fx > 1 + 10 / width) p.fx = -10 / width;

        const currentAlpha = Math.max(0.1, Math.min(0.65, p.alpha));
        const px = p.fx * width;
        const py = p.fy * height;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${currentAlpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.6)`;
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
      {/* Grade-7 Forest Green cloud — top-left */}
      <div className="absolute -top-24 -left-24 w-[clamp(18rem,40vw,36rem)] h-[clamp(18rem,40vw,36rem)] rounded-full bg-radial-spectral-1 opacity-55 blur-3xl animate-cloud-drift-1" />

      {/* Grade-8 Magical Gold cloud — center-right */}
      <div className="absolute top-1/4 -right-20 w-[clamp(20rem,45vw,40rem)] h-[clamp(20rem,45vw,40rem)] rounded-full bg-radial-spectral-2 opacity-45 blur-3xl animate-cloud-drift-2" />

      {/* Grade-9 Terracotta/Crimson cloud — bottom-left */}
      <div className="absolute -bottom-28 -left-20 w-[clamp(16rem,38vw,34rem)] h-[clamp(16rem,38vw,34rem)] rounded-full bg-radial-spectral-3 opacity-50 blur-3xl animate-cloud-drift-3" />

      {/* Grade-10 Oceanic Blue cloud — bottom-right */}
      <div className="absolute bottom-8 -right-16 w-[clamp(18rem,40vw,36rem)] h-[clamp(18rem,40vw,36rem)] rounded-full bg-radial-spectral-4 opacity-45 blur-3xl animate-cloud-drift-4" />

      {/* Extra mid-screen subtle emerald glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(24rem,55vw,56rem)] h-[clamp(16rem,35vw,32rem)] rounded-full bg-radial-spectral-mid opacity-20 blur-3xl animate-cloud-drift-1" />

      {/* Floating dust canvas */}
      <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Rising math symbols */}
      <RisingMathParticles />
    </div>
  );
};
