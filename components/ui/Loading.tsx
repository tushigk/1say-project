'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingProps {
    fullScreen?: boolean;
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ fullScreen = false, text, size = 'md' }: LoadingProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    const heartSizes = {
        sm: 16,
        md: 32,
        lg: 48
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outermost pulsing ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl"
                />

                {/* Rotating Silk Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-2 border-t-rose-500 border-r-rose-400/30 border-b-transparent border-l-transparent"
                />

                {/* Central Pulsing Heart */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: [0.9, 1.1, 0.9],
                            filter: [
                                'drop-shadow(0 0 2px rgba(225, 29, 72, 0.4))',
                                'drop-shadow(0 0 10px rgba(225, 29, 72, 0.8))',
                                'drop-shadow(0 0 2px rgba(225, 29, 72, 0.4))'
                            ]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="text-rose-500"
                    >
                        <Heart size={heartSizes[size]} fill="currentColor" />
                    </motion.div>
                </div>
            </div>

            {text && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500/60 animate-pulse"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[999] bg-[#030001] flex items-center justify-center">
                {/* Background ambient glow */}
                <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 to-transparent opacity-50" />
                {content}
            </div>
        );
    }

    return content;
}
