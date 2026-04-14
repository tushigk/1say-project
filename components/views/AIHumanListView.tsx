'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import Image from 'next/image';
import { aiHumanApi } from '@/apis';
import { AIHuman } from '@/apis/aiHuman';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export function AIHumanListView() {
    const [selectedPersona, setSelectedPersona] = useState<AIHuman | null>(null);
    const router = useRouter();
    const { data: aiHumansData, isLoading } = useSWR('ai-humans', () => aiHumanApi.listAIHumans());

    const aiHumans: AIHuman[] = aiHumansData?.data || [];

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loading text="Persona-нуудыг ачаалж байна..." />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-4 md:p-12 space-y-8 md:space-y-12 overflow-y-auto relative custom-scrollbar">
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="relative space-y-2 md:space-y-4 max-w-4xl">
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none animate-in fade-in slide-in-from-left-6 duration-1000">
                    AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">Personas</span>
                </h1>
                <p className="text-zinc-500 max-w-2xl text-sm md:text-lg font-medium leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                    Өвөрмөц зан чанартай AI-г нээгээрэй. Аялал бүр ганцхан мессежээр эхэлдэг...
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-8">
                {aiHumans.map((persona, index) => (
                    <motion.div
                        key={persona._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        whileHover={{ y: -12 }}
                        onClick={() => setSelectedPersona(persona)}
                        className="group relative cursor-pointer"
                    >
                        <div className="relative bg-zinc-900/40 border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden backdrop-blur-xl transition-all duration-700 h-full group-hover:border-rose-500/30 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">

                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                    alt={persona.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />

                                <div className="absolute top-3 left-3 md:top-5 md:left-5 flex flex-col gap-1.5 md:gap-2">
                                    <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[7px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] w-fit">
                                        {persona.gender}
                                    </div>
                                    {persona.age && (
                                        <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-rose-500/90 backdrop-blur-md text-[7px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] w-fit">
                                            {persona.age} yrs
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 md:p-6 space-y-2.5 md:space-y-5 flex flex-col justify-between flex-1">
                                <div className="space-y-1.5 md:space-y-4">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                                        <span className="text-[7px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Active now</span>
                                    </div>
                                    <h3 className="text-base md:text-3xl font-serif font-bold text-white group-hover:text-rose-500 transition-colors duration-700 leading-tight tracking-tight italic truncate">
                                        {persona.name}
                                    </h3>
                                    <p className="text-[10px] md:text-[13px] text-zinc-500 line-clamp-2 leading-snug md:leading-relaxed font-medium transition-colors group-hover:text-zinc-400">
                                        {persona.shortBio || "Step into a world of mystery..."}
                                    </p>
                                </div>

                                <div className="pt-1 md:pt-2 mt-auto">
                                    <div
                                        className="relative group/btn-container overflow-hidden rounded-[8px] md:rounded-xl z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/ai-human?personaId=${persona._id}`);
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative w-full h-8 md:h-12 bg-white/[0.04] border border-white/5 flex items-center justify-between px-3 md:px-6 transition-all duration-500 group-hover:bg-transparent group-hover:border-transparent">
                                            <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">Чатлах</span>
                                            <div className="w-5 h-5 md:w-7 md:h-7 rounded-[6px] md:rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-rose-600 transition-all duration-500 shadow-lg">
                                                <MessageCircle size={10} fill="currentColor" className="opacity-40 group-hover:opacity-100 scale-100 md:scale-125" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -inset-2 bg-rose-500/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                    </motion.div>
                ))}
            </div>
            <AnimatePresence>
                {selectedPersona && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedPersona(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                                <Image
                                    src={selectedPersona.image?.url || `https://ui-avatars.com/api/?name=${selectedPersona.name}&background=random`}
                                    alt={selectedPersona.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                                <button
                                    onClick={() => setSelectedPersona(null)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:bg-black hover:text-white transition-all backdrop-blur-md"
                                >
                                    <X size={16} />
                                </button>

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Active now</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white italic truncate">
                                        {selectedPersona.name}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                        {selectedPersona.gender}
                                    </div>
                                    {selectedPersona.age && (
                                        <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                            {selectedPersona.age} yrs
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                    {selectedPersona.greeting || selectedPersona.shortBio || selectedPersona.shortBio || "Step into a world of mystery. Start chatting to discover more about my personality and life."}
                                </p>

                                <button
                                    onClick={() => router.push(`/ai-human?personaId=${selectedPersona._id}`)}
                                    className="w-full h-12 md:h-14 bg-gradient-to-r from-rose-600 to-rose-500 rounded-xl flex items-center justify-center gap-3 text-white font-bold tracking-wider hover:opacity-90 transition-all shadow-[0_10px_40px_-10px_rgba(244,63,94,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <MessageCircle size={18} />
                                    <span>ЧАТЛАХ</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
