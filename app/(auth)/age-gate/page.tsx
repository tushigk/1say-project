"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import TermOfServiceModal from "../../../components/auth/TermOfServiceModal";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AuthBanner from "../../../components/auth/AuthBanner";
import Image from "next/image";

export default function AgeGatePage() {
    const router = useRouter();
    const [isTosOpen, setIsTosOpen] = useState(false);

    const handleEnter = () => {
        localStorage.setItem("age_verified", "true");
        router.push("/register");
    };

    const handleLeave = () => {
        router.push("https://www.google.com");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#030001] text-white">
            {/* Cinematic Noise Overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            <AuthBanner />

            {/* Deep red ambient glows */}
            <div className="pointer-events-none absolute -left-[20%] top-[-10%] h-[700px] w-[700px] rounded-full bg-red-950/20 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="pointer-events-none absolute -right-[20%] bottom-[-10%] h-[700px] w-[700px] rounded-full bg-rose-950/20 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: [0, -10, 0] 
                }}
                transition={{ 
                    opacity: { duration: 1 },
                    scale: { duration: 1 },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-[#050002]/70 p-12 md:p-16 text-center shadow-[0_45px_120px_rgba(0,0,0,1)] backdrop-blur-3xl"
            >
                {/* Inner stroke for ultra premium look */}
                <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border-[0.5px] border-white/5 mix-blend-overlay" />

                {/* Branding */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl animate-pulse" />
                        <div className="relative flex overflow-hidden h-24 w-24 items-center justify-center rounded-full border border-red-500/30 bg-black/60 shadow-[0_10px_40px_rgba(229,9,20,0.3)] backdrop-blur-xl">
                            <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Нууцхан таалал...</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-200 to-zinc-500 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Шөнийн Таалал</h1>
                </div>

                <div className="space-y-6 mb-12">
                    <p className="text-zinc-500 text-lg font-light leading-relaxed tracking-wide">
                        Та дээд зэргийн дотно байдал болон нууцлаг харилцааны халуухан ертөнцөд орох гэж байна.
                    </p>
                    <div className="flex items-center justify-center gap-2 py-2 px-6 rounded-full bg-red-950/20 border border-red-500/20 w-fit mx-auto shadow-[0_0_15px_rgba(229,9,20,0.1)]">
                        <Flame size={14} className="text-red-600 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-100 uppercase tracking-widest">18+ Sensitive Content</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Button
                        onClick={handleEnter}
                        className="group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl border border-red-500/40 bg-linear-to-r from-red-950 via-[#700000] to-red-950 bg-size-[200%_auto] text-xl font-semibold text-white shadow-[0_0_30px_rgba(229,9,20,0.3)] transition-all duration-700 hover:bg-position-[100%_auto] hover:shadow-[0_0_60px_rgba(229,9,20,0.5)] hover:border-red-500/60 active:scale-[0.98]"
                    >
                        Хаалга Нээх
                        <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <button
                        onClick={handleLeave}
                        className="w-full py-4 text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-zinc-400 transition-colors cursor-pointer"
                    >
                        Буцах
                    </button>
                </div>

                {/* Footer */}
                <div className="pt-10 mt-10 border-t border-white/5">
                    <p className="text-[11px] text-zinc-600 leading-relaxed uppercase tracking-widest">
                        Үргэлжлүүлснээр та 18 нас хүрснээ баталж, <br />
                        <button onClick={() => setIsTosOpen(true)} className="text-zinc-500 hover:text-red-400 mx-1 underline decoration-zinc-800 underline-offset-4 transition-colors">нөхцөлийг</button>
                        зөвшөөрч байгаа болно.
                    </p>
                </div>
            </motion.div>
            <TermOfServiceModal isOpen={isTosOpen} onClose={() => setIsTosOpen(false)} />

            {/* Ambient Lighting Orbs - Extra Layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[150px] rounded-full z-0 pointer-events-none" />
        </div>
    );
}
