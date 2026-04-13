'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1, ease: [0.45, 0, 0.55, 1] }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030001] overflow-hidden"
                >
                    {/* Ambient Glows */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px]"
                    />

                    {/* Content Container */}
                    <div className="relative flex flex-col items-center">
                        {/* Animated Logo/Symbol */}
                        <div className="relative mb-8">
                            {/* Silk Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 rounded-full border border-rose-500/10 border-t-rose-500/40 blur-[1px]"
                            />

                            {/* Inner Pulsing Ring */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-2 rounded-full border border-rose-500/20 bg-rose-500/5 blur-[2px]"
                            />

                            {/* Center Heart */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.5,
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        filter: ["blur(0px) drop-shadow(0 0 10px rgba(244,63,94,0.5))", "blur(1px) drop-shadow(0 0 20px rgba(244,63,94,0.8))", "blur(0px) drop-shadow(0 0 10px rgba(244,63,94,0.5))"]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Heart size={48} className="text-rose-500 fill-rose-500" />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Title Animation */}
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                                className="text-4xl md:text-5xl font-serif font-black text-white tracking-[0.2em] uppercase text-center"
                            >
                                Шөнийн таалал
                            </motion.h1>
                        </div>
                    </div>

                    {/* Loading Progress Line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent origin-center"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
