'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const LEAF_TYPES = ['🍂', '🍁'];
const NUM_LEAVES = 15;

interface Leaf {
  id: number;
  style: React.CSSProperties;
  char: string;
}

export default function FallingLeaves() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const generatedLeaves = Array.from({ length: NUM_LEAVES }, (_, i) => {
            const duration = Math.random() * 5 + 10; // 10 to 15 seconds
            const delay = Math.random() * 10;
            const initialX = Math.random() * window.innerWidth;
            const fontSize = Math.random() * 1.5 + 1; // 1rem to 2.5rem
            
            return {
                id: i,
                style: {
                    left: `${initialX}px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    fontSize: `${fontSize}rem`,
                },
                char: LEAF_TYPES[Math.floor(Math.random() * LEAF_TYPES.length)],
            };
        });
        setLeaves(generatedLeaves);
    }
  }, []);

  if (!mounted || theme !== 'lofi-september') {
    return null;
  }

  return (
    <div className="leaves-container">
      {leaves.map((leaf) => (
        <span key={leaf.id} className="leaf" style={leaf.style}>
          {leaf.char}
        </span>
      ))}
    </div>
  );
}
