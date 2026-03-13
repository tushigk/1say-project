"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import TermOfServiceModal from "../../../components/auth/TermOfServiceModal";
import { Lock, ArrowRight, ShieldCheck, Flame, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AuthBanner from "../../../components/auth/AuthBanner";

export default function AgeGatePage() {
    const router = useRouter();
    const [isTosOpen, setIsTosOpen] = useState(false);

    const handleEnter = () => {
        localStorage.setItem("age_verified", "true");
        router.push("/login");
    };

    const handleLeave = () => {
        router.push("https://www.google.com");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <AuthBanner />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[500px] glass rounded-4xl p-12 md:p-16 text-center shadow-2xl border-white/10"
            >
                {/* Branding */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white text-black flex items-center justify-center font-black text-4xl mb-6 shadow-2xl group transition-transform hover:rotate-6">
                        N
                    </div>
                    <div className="flex items-center gap-2 text-accent-crimson mb-2">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Private Access</span>
                    </div>
                    <h1 className="text-5xl font-serif font-bold text-white tracking-tighter">Noir Club</h1>
                </div>

                <div className="space-y-6 mb-12">
                    <p className="text-zinc-400 text-lg font-light leading-relaxed">
                        Та дээд зэргийн дотно байдал болон нууцлаг харилцааны ертөнцөд орох гэж байна.
                    </p>
                    <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/5 w-fit mx-auto">
                        <ShieldCheck size={14} className="text-accent-crimson" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">18+ Restricted Content</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <Button
                        onClick={handleEnter}
                        className="w-full py-6 text-xl group bg-white text-black hover:bg-zinc-200 transition-all rounded-4xl cursor-pointer"
                    >
                        Нэвтрэх
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
                    <p className="text-[12px] text-zinc-600 leading-relaxed uppercase tracking-wider">
                        Үргэлжлүүлснээр та 18 нас хүрснээ баталж, <br />
                        <button onClick={() => setIsTosOpen(true)} className="text-zinc-400 hover:text-white mx-1 underline decoration-zinc-800 underline-offset-4">нөхцөлийг</button>
                        зөвшөөрч байгаа болно.
                    </p>
                </div>
            </motion.div>

            {/* Ambient Lighting Orbs - Extra Layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-crimson/5 blur-[120px] rounded-full z-0 pointer-events-none" />
        </div>
    );
}
