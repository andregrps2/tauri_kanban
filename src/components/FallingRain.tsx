'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const NUM_RAINDROPS = 100;

interface Raindrop {
  id: number;
  style: React.CSSProperties;
}

export default function FallingRain() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const generatedRaindrops = Array.from({ length: NUM_RAINDROPS }, (_, i) => {
            const duration = Math.random() * 0.5 + 0.3; // 0.3 to 0.8 seconds
            const delay = Math.random() * 5;
            const initialX = Math.random() * window.innerWidth;
            
            return {
                id: i,
                style: {
                    left: `${initialX}px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                },
            };
        });
        setRaindrops(generatedRaindrops);
    }
  }, []);

  if (!mounted || theme !== 'lofi-dark-japanese') {
    return null;
  }

  return (
    <div className="rain-container">
      {raindrops.map((drop) => (
        <div key={drop.id} className="raindrop" style={drop.style}></div>
      ))}
    </div>
  );
}
