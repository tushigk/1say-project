"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import TermOfServiceModal from "../../../components/auth/TermOfServiceModal";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
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
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#050203] text-white selection:bg-accent-crimson selection:text-white">
            {/* Cinematic Noise Overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            <AuthBanner />

            {/* Premium Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-crimson/15 rounded-full blur-[140px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#f7e7ce]/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-linear-to-b from-[#050203]/40 via-[#050203]/80 to-[#050203]" />
            </div>

            <div className="relative z-10 w-full max-w-[540px] perspective-1000">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0f080a]/80 p-10 md:p-16 text-center backdrop-blur-2xl transition-all duration-700 hover:shadow-[0_0_80px_rgba(230,30,56,0.1)] group border border-white/5">
                    
                    {/* Golden/Crimson Gradient Border Inner Overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-linear-to-b from-white/5 to-transparent opacity-20" />
                    <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border-[0.5px] border-white/10 mix-blend-overlay" />
                    
                    {/* Top ambient highlight inside the card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-accent-crimson/10 blur-3xl rounded-full" />

                    {/* Branding */}
                    <div className="flex flex-col items-center mb-10 relative z-10">
                        <div className="relative mb-8 group-hover:scale-105 transition-transform duration-700">
                            <div className="absolute inset-0 rounded-full bg-accent-crimson/30 blur-2xl animate-pulse" />
                            <div className="relative flex overflow-hidden h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-black/80 shadow-[0_10px_50px_rgba(230,30,56,0.3)] backdrop-blur-xl">
                                <Image src="/logo.jpeg" alt="Logo" fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f7e7ce] text-[10px] font-bold tracking-[0.3em] uppercase backdrop-blur-md">
                                <Sparkles size={12} className="mr-2 text-accent-crimson animate-pulse" />
                                Нууцхан Таалал
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] leading-tight">
                            Шөнийн <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent-crimson to-[#ff4d6d] italic font-light inline-block mt-2">Таалал</span>
                        </h1>
                    </div>

                    <div className="space-y-6 mb-12 relative z-10">
                        <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
                            Та дээд зэргийн дотно байдал болон нууцлаг харилцааны халуухан ертөнцөд орох гэж байна.
                        </p>
                        <div className="flex items-center justify-center gap-3 py-2.5 px-6 rounded-full bg-accent-crimson/10 border border-accent-crimson/20 w-fit mx-auto shadow-[0_0_20px_rgba(230,30,56,0.1)]">
                            <Flame size={16} className="text-accent-crimson animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.25em]">18+ Насанд Хүрэгчдэд</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 relative z-10">
                        <Button
                            onClick={handleEnter}
                            className="group relative flex h-16 md:h-[72px] w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-linear-to-r from-[#1a0b0e] via-[#3d1118] to-[#1a0b0e] bg-size-[200%_auto] text-white shadow-[0_0_40px_rgba(230,30,56,0.2)] transition-all duration-700 hover:bg-position-[100%_auto] hover:shadow-[0_0_60px_rgba(230,30,56,0.4)] hover:border-accent-crimson/50 active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_2s_infinite]" />
                            <span className="relative z-10 flex items-center font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                                Хаалга Нээх
                                <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform duration-500" />
                            </span>
                        </Button>

                        <button
                            onClick={handleLeave}
                            className="w-full py-4 text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-zinc-300 transition-colors cursor-pointer"
                        >
                            Буцах
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 mt-8 border-t border-white/5 relative z-10">
                        <p className="text-[10px] md:text-[11px] text-zinc-500 leading-relaxed uppercase tracking-[0.2em]">
                            Үргэлжлүүлснээр та 18 нас хүрснээ баталж, <br className="hidden md:block" />
                            <button onClick={() => setIsTosOpen(true)} className="text-[#f7e7ce] hover:text-white mx-1 underline decoration-white/20 underline-offset-4 transition-colors">нөхцөлийг</button>
                            зөвшөөрч байгаа болно.
                        </p>
                    </div>
                </div>
            </div>
            
            <TermOfServiceModal isOpen={isTosOpen} onClose={() => setIsTosOpen(false)} />
        </div>
    );
}
