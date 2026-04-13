'use client';

import React from 'react';
import Loading from './Loading';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-2xl cursor-pointer font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-accent-crimson text-black shadow-glow hover:shadow-glow-strong hover:bg-rose-600 cursor-pointer",
        secondary: "bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer",
        outline: "bg-transparent border border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-white cursor-pointer",
        ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <Loading size="sm" text="Уншиж байна..." />
            ) : children}
        </button>
    );
}
