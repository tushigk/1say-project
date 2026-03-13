'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    variant?: 'dark' | 'glass' | 'surreal';
}

export default function Input({
    label,
    error,
    variant = 'surreal',
    className = '',
    ...props
}: InputProps) {
    return (
        <div className="flex flex-col gap-2 w-full group">
            {label && (
                <label className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] px-1 group-focus-within:text-white transition-colors">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    className={`
            w-full h-14 rounded-2xl px-5 text-white placeholder:text-zinc-700 
            transition-all duration-500 focus:outline-none
            ${variant === 'surreal'
                            ? 'bg-white/3 border border-white/5 focus:bg-white/8 focus:border-white/20 focus:ring-4 focus:ring-white/2'
                            : variant === 'dark'
                                ? 'bg-zinc-900 border border-zinc-800 focus:border-accent-crimson/50'
                                : 'glass border border-white/5 focus:border-white/20'}
            ${error ? 'border-red-500/50 focus:ring-red-500/5' : ''}
            ${className}
          `}
                    {...props}
                />
                {/* Animated underline indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-white opacity-0 group-focus-within:w-1/2 group-focus-within:opacity-20 transition-all duration-700" />
            </div>
            {error && (
                <span className="text-red-500 text-[10px] font-bold mt-1 px-1 uppercase tracking-wider">{error}</span>
            )}
        </div>
    );
}
