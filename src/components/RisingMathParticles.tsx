import React, { useEffect, useRef } from 'react';

interface MathParticle {
  x: number;
  y: number;
  symbol: string;
  size: number;
  speedY: number;
  swaySpeed: number;
  swayAmount: number;
  swayOffset: number;
  alpha: number;
  baseAlpha: number;
  hue: number;
  rotation: number;
  rotSpeed: number;
}

const MATH_SYMBOLS = ['π', '∑', '∞', '√x', '+', '×', 'θ', 'Δ', '∫', 'α', 'β', '÷', '='];

export const RisingMathParticles: React.FC<{ className?: string }> = ({ className = '' }) => {
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

    // Create particle array
    const particleCount = 36;
    const particles: MathParticle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      size: Math.floor(Math.random() * 7) + 10, // 10px - 16px (tiny & elegant)
      speedY: Math.random() * 0.4 + 0.25, // Gentle upward rise
      swaySpeed: Math.random() * 0.015 + 0.005,
      swayAmount: Math.random() * 1.2 + 0.4,
      swayOffset: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.35 + 0.15, // Subtle, soft opacity
      alpha: 0.2,
      hue: Math.random() > 0.4 ? 45 : 180, // Soft Gold / Cyan aura
      rotation: (Math.random() - 0.5) * 0.4,
      rotSpeed: (Math.random() - 0.5) * 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now();

      particles.forEach((p) => {
        // Move upward & sway horizontally
        p.y -= p.speedY;
        p.x += Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmount * 0.3;
        p.rotation += p.rotSpeed;

        // Subtle pulsing glow opacity
        p.alpha = p.baseAlpha + Math.sin(time * 0.002 + p.swayOffset) * 0.1;
        const currentAlpha = Math.max(0.08, Math.min(0.55, p.alpha));

        // Reset to bottom when rising past top boundary
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
          p.symbol = MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)];
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Soft ambient glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, ${currentAlpha * 0.8})`;

        ctx.font = `600 ${p.size}px "Inter", "Lora", serif`;
        ctx.fillStyle = `hsla(${p.hue}, 85%, 85%, ${currentAlpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);

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
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
