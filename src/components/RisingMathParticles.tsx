import React, { useEffect, useRef } from 'react';

interface MathParticle {
  // Stored as 0-1 fractions so resize recomputes px coords without distortion
  fx: number;
  fy: number;
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

const MATH_SYMBOLS = ['π', '∑', '∞', '√', '+', '×', 'θ', 'Δ', '∫', 'α', 'β', '÷', '=', '%', '≈', '∠'];

// Lihyara-themed hues: Forest Green (120), Gold (45), Teal (175), Terracotta (15)
const PARTICLE_HUES = [120, 45, 175, 15, 200];

export const RisingMathParticles: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      const el = canvas.parentElement ?? document.documentElement;
      width = el.clientWidth || window.innerWidth;
      height = el.clientHeight || window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      // Physical pixel size — prevents blurry text on HiDPI screens
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      // CSS size stays at logical pixels
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    setSize();

    const handleResize = () => {
      setSize();
      // Re-scale context after resize resets it
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    const particleCount = 40;
    // Particles store fractional positions (0-1) so they stay proportional on resize
    const particles: MathParticle[] = Array.from({ length: particleCount }).map(() => ({
      fx: Math.random(),
      fy: Math.random(),
      symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      size: Math.floor(Math.random() * 8) + 10, // 10–17px – fixed point size, not scaled by canvas
      speedY: Math.random() * 0.00045 + 0.00025, // fraction of height per frame
      swaySpeed: Math.random() * 0.015 + 0.005,
      swayAmount: Math.random() * 1.5 + 0.5,
      swayOffset: Math.random() * Math.PI * 2,
      baseAlpha: Math.random() * 0.35 + 0.15,
      alpha: 0.2,
      hue: PARTICLE_HUES[Math.floor(Math.random() * PARTICLE_HUES.length)],
      rotation: (Math.random() - 0.5) * 0.4,
      rotSpeed: (Math.random() - 0.5) * 0.005,
    }));

    const render = () => {
      // Clear at logical pixel size
      ctx.clearRect(0, 0, width, height);

      const time = Date.now();

      particles.forEach((p) => {
        // Move upward & sway — using fraction-of-screen units
        p.fy -= p.speedY;
        p.fx += (Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmount * 0.3) / width;
        p.rotation += p.rotSpeed;

        // Pulse opacity
        p.alpha = p.baseAlpha + Math.sin(time * 0.002 + p.swayOffset) * 0.1;
        const currentAlpha = Math.max(0.08, Math.min(0.55, p.alpha));

        // Wrap boundaries
        if (p.fy < -30 / height) {
          p.fy = 1 + 20 / height;
          p.fx = Math.random();
          p.symbol = MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)];
        }
        if (p.fx < -30 / width) p.fx = 1 + 20 / width;
        if (p.fx > 1 + 30 / width) p.fx = -20 / width;

        // Convert to logical-pixel coords for drawing
        const px = p.fx * width;
        const py = p.fy * height;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rotation);

        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, ${currentAlpha * 0.8})`;

        // p.size is always the same pt size regardless of canvas resolution
        ctx.font = `600 ${p.size}px "Inter", serif`;
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
      {/* Canvas fills parent; CSS sets logical size; JS sets physical HiDPI size */}
      <canvas ref={canvasRef} style={{ display: 'block', position: 'absolute', inset: 0 }} />
    </div>
  );
};
