'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Lightning() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && theme === 'lofi-dark-september') {
      const scheduleFlash = () => {
        const delay = Math.random() * 15000 + 5000; // 5 to 20 seconds
        setTimeout(() => {
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 300); // Duration of the animation
          scheduleFlash();
        }, delay);
      };
      const timeoutId = scheduleFlash();
      
      // Cleanup on component unmount or theme change
      return () => clearTimeout(timeoutId);
    }
  }, [mounted, theme]);

  if (!mounted || theme !== 'lofi-dark-september') {
    return null;
  }

  return (
    <div
      className={cn(
        'lightning-container',
        'bg-white',
        isFlashing && 'lightning-flash'
      )}
    ></div>
  );
}

    