"use client";

import { bannerApi } from "@/apis";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
    _id: string;
    title: string;
    image: { _id: string; url: string };
}

export default function AuthBanner({ className }: { className?: string }) {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const res = await bannerApi.listBanners();
                setBanners(res.data || []);
            } catch (err) {
                console.error("Failed to fetch banners", err);
            }
        }
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 6000); // Slower cycle for more premium feel
        return () => clearInterval(interval);
    }, [banners]);

    if (banners.length === 0) return (
        <div className="absolute inset-0 z-0 bg-black" />
    );

    return (
        <div className={`absolute inset-0 z-0 overflow-hidden bg-black ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <motion.div
                        initial={{ scale: 1.1, x: 0 }}
                        animate={{
                            scale: 1,
                            x: -20
                        }}
                        transition={{
                            duration: 10,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${banners[currentIndex].image.url}')`,
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Premium Overlays */}
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px]" />

            {/* Dark Gradients for Content Visibility */}
            <div className="absolute inset-0 z-20 bg-linear-to-t from-[#050203] via-[#050203]/60 to-transparent" />
            <div className="absolute inset-0 z-20 bg-linear-to-b from-[#050203]/40 via-transparent to-transparent" />

            {/* Organic Noise/Grain Overlay */}
            <div className="absolute inset-0 z-30 opacity-[0.05] pointer-events-none mix-blend-overlay animate-grain bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            <style jsx>{`
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-1%, -1%); }
                    30% { transform: translate(1%, 1%); }
                    50% { transform: translate(-0.5%, 1.5%); }
                    70% { transform: translate(1.5%, -0.5%); }
                    90% { transform: translate(-1%, 0.5%); }
                }
                .animate-grain {
                    animation: grain 8s steps(10) infinite;
                    background-size: 200px;
                }
            `}</style>

            {/* Subtle Title Display (Desktop Only) */}
            <div className="hidden md:block absolute bottom-12 left-12 z-40">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.4, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 1 }}
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                            {banners[currentIndex].title || "Noir Community"}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}