'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Bomb, Sparkles } from 'lucide-react';

interface HotPotatoProps {
  isTicking: boolean;
  isExploding?: boolean;
  onExplosionComplete?: () => void;
}

export function HotPotato({ isTicking, isExploding, onExplosionComplete }: HotPotatoProps) {
  const [exploded, setExploded] = useState(false);

  const particles = React.useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15) * Math.PI / 180;
      const distance = 200 + Math.random() * 100;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: Math.random() * 2 + 0.5,
        duration: 0.6 + Math.random() * 0.6
      };
    });
  }, []);

  useEffect(() => {
    if (isExploding && !exploded) {
      setExploded(true);
      const timer = setTimeout(() => {
        if (onExplosionComplete) onExplosionComplete();
      }, 2500); // Wait for sequence to complete
      return () => clearTimeout(timer);
    }
  }, [isExploding, exploded, onExplosionComplete]);

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      {/* Ambient Flame Glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-rose-600/30 blur-[80px]"
        animate={isExploding ? { 
          scale: [1, 2.5, 0], 
          opacity: [0.8, 1, 0],
          backgroundColor: ["rgba(225,29,72,0.5)", "rgba(234,88,12,0.8)", "rgba(0,0,0,0)"]
        } : isTicking ? { 
          scale: [1, 1.3, 1], 
          opacity: [0.5, 0.9, 0.5] 
        } : { scale: 1, opacity: 0.4 }}
        transition={isExploding ? { duration: 0.6, ease: 'easeOut' } : { duration: 0.35, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Shockwave Effect when Exploding */}
      <AnimatePresence>
        {isExploding && (
          <motion.div
            className="absolute inset-0 rounded-full border-[6px] border-orange-500"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* The Potato (Bomb/Flame Element) */}
      <motion.div
        className="relative z-10 w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(225,29,72,0.6)] border-4 border-orange-300 backdrop-blur-xl overflow-hidden bg-zinc-950"
        animate={isExploding ? {
          scale: [1, 1.8, 0],
          rotate: [0, -30, 30, -30, 30, 0],
          opacity: [1, 1, 0],
        } : isTicking ? {
          scale: [1, 1.05, 1],
          rotate: [0, -5, 5, -5, 5, 0],
        } : {}}
        transition={isExploding ? {
          duration: 0.6,
        } : {
          duration: 0.25,
          repeat: Infinity,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/30 via-orange-500/20 to-zinc-900 z-0" />
        
        {/* Core Icon */}
        <AnimatePresence mode="wait">
            {isExploding ? (
            <motion.div 
                key="explosion"
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                exit={{ scale: 0 }}
                className="z-10 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,1)]"
            >
                <Sparkles size={100} />
            </motion.div>
            ) : (
            <motion.div 
                key="ticking"
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                exit={{ scale: 0 }}
                className="z-10 text-rose-500 drop-shadow-[0_0_15px_rgba(225,29,72,1)]"
            >
                <Flame size={100} />
            </motion.div>
            )}
        </AnimatePresence>

      </motion.div>
      
      {/* Explosion Particles */}
      {isExploding && particles.map((p, i) => (
         <motion.div
           key={i}
           className="absolute top-1/2 left-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-r from-yellow-300 to-orange-500 z-20 shadow-[0_0_15px_rgba(251,146,60,0.9)]"
           initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 1 }}
           animate={{
             x: `calc(-50% + ${p.x}px)`,
             y: `calc(-50% + ${p.y}px)`,
             scale: [0, p.scale, 0],
             opacity: [1, 0]
           }}
           transition={{ duration: p.duration, ease: "easeOut" }}
         />
      ))}
    </div>
  );
}
