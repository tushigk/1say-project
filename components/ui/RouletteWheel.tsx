'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RouletteWheelProps {
  players: string[];
  isSpinning: boolean;
  isStopping?: boolean;
}

export function RouletteWheel({ players, isSpinning, isStopping }: RouletteWheelProps) {
  const displayPlayers = useMemo(() => {
    if (players.length === 0) return ['Luck', 'Fate', 'Chance', 'Destiny', 'Fortune', 'Mystery'];
    if (players.length === 1) return [...players, 'Fate', 'Chance', 'Destiny'];
    return players;
  }, [players]);

  const segments = displayPlayers.length;
  const rotationPerSegment = 360 / segments;

  const [randomStopOffset, setRandomStopOffset] = React.useState(0);

  React.useEffect(() => {
    if (isSpinning && !isStopping) {
      setRandomStopOffset(Math.random() * 360);
    }
  }, [isSpinning, isStopping]);

  const colors = [
    '#e11d48', // rose-600
    '#4f46e5', // indigo-600
    '#9333ea', // purple-600
    '#0891b2', // cyan-600
    '#059669', // emerald-600
    '#d97706', // amber-600
  ];

  const conicGradient = useMemo(() => {
    return displayPlayers.map((_, i) => {
      const start = i * rotationPerSegment;
      const end = (i + 1) * rotationPerSegment;
      return `${colors[i % colors.length]} ${start}deg ${end}deg`;
    }).join(', ');
  }, [displayPlayers, rotationPerSegment, colors]);

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />

      {/* Outer Rim Decoration */}
      <div className="absolute inset-[-15px] rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm" />
      <div className="absolute inset-[-10px] rounded-full border-4 border-zinc-900 shadow-[0_0_50px_rgba(99,102,241,0.2)] z-10" />

      {/* The Wheel */}
      <motion.div
        className="relative w-full h-full rounded-full border-8 border-zinc-900 shadow-2xl z-0"
        style={{
          background: `conic-gradient(${conicGradient})`,
        }}
        animate={isStopping ? {
          rotate: 360 * 15 + randomStopOffset, // Use stable random value
        } : isSpinning ? {
          rotate: 360 * 10,
        } : {
          rotate: 0,
        }}
        transition={isStopping ? {
          duration: 2, // Match the pause duration
          ease: [0.12, 0, 0.39, 0], // Custom ease-out curve
        } : isSpinning ? {
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        } : {
          duration: 0.5,
        }}
      >
        {displayPlayers.map((player, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              transform: `rotate(${i * rotationPerSegment + rotationPerSegment / 2}deg)`,
            }}
          >
            <span
              className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-black text-[9px] md:text-[11px] uppercase tracking-wider whitespace-nowrap [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {player}
            </span>
          </div>
        ))}

        {/* Hub overlay to make it look 3D-ish */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
      </motion.div>

      {/* Center hub */}
      <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-zinc-950 border-4 border-white/10 flex items-center justify-center z-20 shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-pulse" />
        </div>
      </div>

      {/* Pointer */}
      <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 z-30">
        <div className="w-6 h-8 bg-white rounded-b-full shadow-lg flex items-center justify-center">
          <div className="w-2 h-4 bg-indigo-500 rounded-full" />
        </div>
      </div>

      {/* Indicator lights */}
      <div className="absolute inset-[-20px] rounded-full pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_white]`}
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 30}deg) translate(0, -150px) rotate(-${i * 30}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
