'use client';

import React, { useState, useEffect, useRef } from 'react';

const styles = `
    @keyframes progressShine {
      0% { transform: translateX(0); }
      100% { transform: translateX(800%); }
    }
    @keyframes heartEroticPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.28); }
    }
    @keyframes shimmer {
      0% { background-position: -300% 0; }
      100% { background-position: 300% 0; }
    }
    @keyframes fireErotic {
      0%, 100% { transform: scale(1) rotate(-10deg); }
      50% { transform: scale(1.45) rotate(18deg); }
    }
    @keyframes sparkErotic {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      100% { transform: translateY(-220px) scale(0.1); opacity: 0; }
    }
    @keyframes electricErotic {
      0%, 100% { opacity: 1; filter: brightness(1); }
      50% { opacity: 0.25; filter: brightness(2.5); }
    }
    @keyframes petalFloat {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(-200px) rotate(720deg); }
    }

    .shimmer-bg {
      background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%);
      animation: shimmer 2.8s linear infinite;
      background-size: 200% 100%;
    }
`;

export interface HeatLevelSelectorProps {
  level: number; // 0, 1, 2
  onChange: (level: number) => void;
  variant?: 'compact' | 'full';
}

export function HeatLevelSelector({ level, onChange, variant = 'full' }: HeatLevelSelectorProps) {
  const [trackWidth, setTrackWidth] = useState(540); // default for SSR
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbXState, setThumbXState] = useState(0);

  // Compute snap positions based on current width
  const snapPositions = trackWidth > 0 ? [52, trackWidth / 2, trackWidth - 52] : [52, 270, 488];

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.clientWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Derived state to avoid cascading renders
  const thumbX = isDragging ? thumbXState : (snapPositions[level] || 52);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateThumbPosition(e.clientX);
  };

  const updateThumbPosition = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(52, Math.min(x, rect.width - 52));
    setThumbXState(x);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      updateThumbPosition(e.clientX);
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      let closest = 0;
      let minDist = Infinity;
      snapPositions.forEach((pos, i) => {
        const dist = Math.abs(thumbXState - pos);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      onChange(closest);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, thumbXState, onChange, snapPositions]);

  const percent = trackWidth > 0 ? (thumbX / trackWidth) * 100 : (level === 0 ? 0 : level === 1 ? 50 : 100);

  const [sparks, setSparks] = useState<{ id: number; left: string; delay: string; dur: string }[]>([]);

  useEffect(() => {
    let initTimer: NodeJS.Timeout;
    let cleanTimer: NodeJS.Timeout;

    if (level === 1 || level === 2) {
      initTimer = setTimeout(() => {
        const newSparks = Array.from({ length: level === 2 ? 18 : 10 }).map(() => ({
          id: Math.random(),
          left: `${20 + Math.random() * 60}%`,
          delay: `-${Math.random() * 0.5}s`,
          dur: `${0.9 + Math.random() * 0.7}s`
        }));
        setSparks(newSparks);
      }, 10);

      cleanTimer = setTimeout(() => setSparks([]), 2500);

      return () => {
        clearTimeout(initTimer);
        clearTimeout(cleanTimer);
      };
    }
  }, [level]);

  let trackShadow = variant === 'full' ? '0 30px 60px -15px rgb(0 0 0 / 0.5)' : '0 15px 30px -10px rgb(0 0 0 / 0.5)';
  let trackBorder = '#f8d7e8';
  if (level === 2) {
    trackShadow = variant === 'full'
      ? '0 30px 60px -15px rgb(236 72 153 / 0.9), 0 0 40px 10px rgb(249 115 22 / 0.3)'
      : '0 15px 30px -10px rgb(236 72 153 / 0.7), 0 0 20px 5px rgb(249 115 22 / 0.2)';
    trackBorder = '#fda4af';
  } else if (level === 1) {
    trackShadow = variant === 'full'
      ? '0 30px 60px -15px rgb(251 191 36 / 0.8), 0 0 40px 10px rgb(251 191 36 / 0.3)'
      : '0 15px 30px -10px rgb(251 191 36 / 0.6), 0 0 20px 5px rgb(251 191 36 / 0.2)';
    trackBorder = '#fde047';
  }

  return (
    <div className={`w-full shrink-0 select-none max-w-2xl mx-auto font-['Inter'] relative transition-all ${variant === 'full' ? 'my-8' : 'my-2'}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Header */}
      {variant === 'full' && (
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_30px_#ec4899] animate-pulse">
            ХАЛУУХАН LEVEL
          </h1>
          <p className="text-rose-300 text-lg md:text-3xl font-medium flex items-center justify-center gap-3">
            Насанд хүрэгчдийн тоглоом
            <span
              className="text-2xl md:text-4xl drop-shadow-[0_0_20px_#f43f5e]"
              style={{ animation: level === 2 ? 'heartEroticPulse 0.5s infinite' : 'none' }}
            >❤️</span>
          </p>
          <div className="text-pink-400 text-[10px] md:text-sm mt-3 tracking-[4px] font-bold">CHOOSE YOUR HEAT • ТҮВШИНЭЭ СОНГО</div>
        </div>
      )}

      {/* Main Slider */}
      <div className={`flex justify-center w-full px-4 ${variant === 'full' ? 'mb-6 md:mb-8' : 'mb-4'}`}>
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          className="relative rounded-full cursor-pointer transition-all duration-300 ease-out w-full"
          style={{
            height: variant === 'full' ? 78 : 56,
            background: 'linear-gradient(90deg, #1f0f1f 0%, #3b1a2e 100%)',
            border: `${variant === 'full' ? 8 : 4}px solid ${trackBorder}`,
            boxShadow: `${trackShadow}, inset 0 ${variant === 'full' ? '10px' : '4px'} ${variant === 'full' ? '20px' : '10px'} -5px rgba(255,255,255,0.3), inset 0 -${variant === 'full' ? '10px' : '4px'} ${variant === 'full' ? '20px' : '10px'} -5px rgba(0,0,0,0.5)`,
            touchAction: 'none'
          }}
        >
          {/* We wrap backgrounds to clip them beautifully inside the border without spilling */}
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #4a2a3a, #2a1a28)' }}>

            {/* Progress */}
            <div
              className="absolute left-0 top-0 h-full"
              style={{
                width: `${percent}%`,
                background: 'linear-gradient(90deg, #67e8f9, #f472b6, #e11d48)',
                boxShadow: variant === 'full' ? '0 0 30px 8px rgb(236 72 153), inset 0 6px 12px rgba(255,255,255,0.6)' : '0 0 15px 4px rgb(236 72 153), inset 0 3px 6px rgba(255,255,255,0.6)',
                transition: isDragging ? 'none' : 'width 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
              }}
            >
              <div className="absolute -top-[60%] -left-[180%] w-[50%] h-[220%] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-75" style={{ animation: 'progressShine 1.8s linear infinite' }} />
            </div>

            {/* Shimmer Highlight inside track */}
            <div className="absolute inset-0 shimmer-bg pointer-events-none" />

            {/* Snap dots perfectly matching thumb snap pixel boundaries! */}
            <div className={`absolute top-1/2 left-[52px] -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-inner ring-2 ring-white/30 ${variant === 'full' ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3'} pointer-events-none`} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-inner ring-2 ring-white/30 ${variant === 'full' ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3'} pointer-events-none`} />
            <div className={`absolute top-1/2 right-[52px] translate-x-1/2 -translate-y-1/2 bg-white/70 rounded-full shadow-inner ring-2 ring-white/30 ${variant === 'full' ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3'} pointer-events-none`} />
          </div>

          {/* Thumb OVERFLOWS track (placed outside overflow-hidden) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 z-50 cursor-grab active:cursor-grabbing ${variant === 'full' ? 'text-4xl md:text-5xl' : 'text-[28px]'}`}
            style={{
              left: thumbX,
              transform: 'translate(-50%, -50%)',
              filter: variant === 'full'
                ? 'drop-shadow(0 10px 15px rgb(236 72 153)) drop-shadow(0 0 25px rgb(249 115 22))'
                : 'drop-shadow(0 4px 6px rgb(236 72 153)) drop-shadow(0 0 10px rgb(249 115 22))',
              transition: isDragging ? 'none' : 'left 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              animation: isDragging ? 'heartEroticPulse 0.7s infinite ease-in-out' : 'none'
            }}
          >
            ❤️
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-white font-semibold px-2 md:px-4 mx-auto">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={`flex items-center gap-1 md:gap-2 rounded-2xl transition-all duration-300 ${level === 0 ? 'bg-orange-500/25 scale-110 shadow-[0_15px_30px_-5px_#ec4899]' : 'bg-white/5 hover:bg-white/10'} ${variant === 'full' ? 'px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg' : 'px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-xs'}`}
        >
          🌹 <span>Энгийн</span>
        </button>
        <button
          type="button"
          onClick={() => onChange(1)}
          className={`flex items-center gap-1 md:gap-2 rounded-2xl transition-all duration-300 ${level === 1 ? 'bg-amber-500/25 scale-110 shadow-[0_15px_30px_-5px_#f59e0b]' : 'bg-white/5 hover:bg-white/10'} ${variant === 'full' ? 'px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg' : 'px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-xs'}`}
        >
          ⚡ <span>Дундаж</span>
        </button>
        <button
          type="button"
          onClick={() => onChange(2)}
          className={`flex items-center gap-1 md:gap-2 rounded-2xl transition-all duration-300 ${level === 2 ? 'bg-rose-500/25 scale-110 shadow-[0_15px_30px_-5px_#e11d48]' : 'bg-white/5 hover:bg-white/10'} ${variant === 'full' ? 'px-3 md:px-6 py-2 md:py-3 text-sm md:text-lg' : 'px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-xs'}`}
        >
          🔥 <span>Халуухан</span>
        </button>
      </div>

      {/* Effects Area */}
      {variant === 'full' && (
        <div className="min-h-[140px] md:min-h-[220px] mt-6 md:mt-10 relative flex flex-col items-center justify-center w-full mx-auto overflow-visible pointer-events-none">
          {level === 2 && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 md:gap-2 text-5xl md:text-8xl drop-shadow-[0_0_40px_#e11d48]">
                🔥<span style={{ animation: 'fireErotic 0.4s infinite' }}>🔥</span>
                🔥<span style={{ animation: 'fireErotic 0.55s infinite' }}>🔥</span>
                🔥<span style={{ animation: 'fireErotic 0.45s infinite' }}>🔥</span>
                🔥<span style={{ animation: 'fireErotic 0.6s infinite' }}>🔥</span>
                🔥<span style={{ animation: 'fireErotic 0.5s infinite' }}>🔥</span>
              </div>
              <div className="mt-4 md:mt-6 text-rose-200 text-2xl md:text-4xl font-black tracking-[8px] md:tracking-[10px] animate-pulse drop-shadow-2xl">
                ХАЛУУХАН
              </div>
              {sparks.map(s => (
                <div
                  key={s.id}
                  className="absolute top-[65%] text-xl md:text-2xl text-rose-500"
                  style={{ left: s.left, animation: `sparkErotic ${s.dur} ease-out forwards`, animationDelay: s.delay }}
                >🔥</div>
              ))}
            </div>
          )}

          {level === 1 && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 md:gap-6 text-4xl md:text-7xl">
                <span style={{ animation: 'electricErotic 0.25s infinite' }}>⚡</span>
                <span className="text-amber-300 text-xl md:text-4xl font-black tracking-widest drop-shadow-[0_0_25px_#fcd34d]">ДУНДАЖ</span>
                <span style={{ animation: 'electricErotic 0.25s infinite' }}>⚡</span>
              </div>
              {sparks.map(s => (
                <div
                  key={s.id}
                  className="absolute top-[65%] text-xl md:text-2xl text-amber-300"
                  style={{ left: s.left, animation: `sparkErotic ${s.dur} ease-out forwards`, animationDelay: s.delay }}
                >✨</div>
              ))}
            </div>
          )}

          {level === 0 && (
            <div className="flex flex-col items-center">
              <div className="flex gap-4 md:gap-14 text-3xl md:text-6xl relative">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                  <span
                    key={i}
                    style={{ animation: `petalFloat ${3 + i * 0.5}s infinite ease-in-out`, animationDelay: `-${i * 0.4}s` }}
                  >🌹</span>
                ))}
              </div>
              <div className="mt-6 md:mt-8 text-pink-200 text-sm md:text-3xl font-light tracking-widest">
                ЭНГИЙН • ТАЙВАН
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Text */}
      {variant === 'full' && (
        <div className="text-center text-white/50 text-[10px] md:text-xs mt-4 md:mt-8 tracking-[2px] md:tracking-widest uppercase pb-6">
          ❤️-г чирж өөрийн хүссэн халуун түвшинг сонго
        </div>
      )}
    </div>
  );
}
