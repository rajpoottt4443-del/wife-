import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  symbol: string;
}

export const BackgroundHearts: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const symbols = ['❤️', '💖', '🌸', '✨', '💕', '🤍', '🌹'];
    const generated: Particle[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.floor(Math.random() * 14) + 12,
      opacity: Math.random() * 0.4 + 0.15,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
      symbol: symbols[Math.floor(Math.random() * symbols.length)]
    }));
    setParticles(generated);
  }, []);

  const handleGlobalClick = (e: React.MouseEvent) => {
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY
    };
    setClickHearts(prev => [...prev.slice(-6), newHeart]);

    setTimeout(() => {
      setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
      onClick={handleGlobalClick}
    >
      {/* Soft gradient ambient blurs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 w-[32rem] h-[32rem] rounded-full bg-rose-100/60 blur-3xl" />

      {/* Floating particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute select-none animate-float transition-all"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(225,29,72,0.15))'
          }}
        >
          {p.symbol}
        </span>
      ))}

      {/* Click ripple hearts */}
      {clickHearts.map(h => (
        <span
          key={h.id}
          className="absolute text-xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{
            left: h.x,
            top: h.y,
            animation: 'softFloat 1s forwards'
          }}
        >
          💖
        </span>
      ))}
    </div>
  );
};
