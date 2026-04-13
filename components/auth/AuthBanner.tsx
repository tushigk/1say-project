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

            {/* Luxurious Red Vignette Overlay */}
            <div className="absolute inset-0 z-10 bg-linear-to-t from-[#030001] via-transparent to-[#030001]/40" />
            <div className="absolute inset-0 z-10 bg-linear-to-r from-[#030001]/60 via-transparent to-transparent md:from-[#030001]/20" />
            <div className="absolute inset-0 z-10 ring-1 ring-inset ring-red-500/10" />
        </div>
    );
}