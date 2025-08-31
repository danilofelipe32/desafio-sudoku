
import React, { useEffect, useRef } from 'react';

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const pieces: { x: number; y: number; size: number; speed: number; rotation: number; color: string; opacity: number }[] = [];
    const numberOfPieces = 200;
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];

    for (let i = 0; i < numberOfPieces; i++) {
      pieces.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 5 + 2,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() + 0.2
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      pieces.forEach(p => {
        p.y += p.speed;
        p.rotation += p.speed / 2;
        if (p.y > height) {
          p.x = Math.random() * width;
          p.y = -20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const timeoutId = setTimeout(() => {
        // Stop animation after 5 seconds to prevent performance issues
        cancelAnimationFrame(animationFrameId);
    }, 5000);


    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />;
};
