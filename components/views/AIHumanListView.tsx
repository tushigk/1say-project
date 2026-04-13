'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { aiHumanApi } from '@/apis';
import { AIHuman } from '@/apis/aiHuman';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

export function AIHumanListView() {
    const router = useRouter();
    const { data: aiHumansData, isLoading } = useSWR('ai-humans', () => aiHumanApi.listAIHumans());

    const aiHumans: AIHuman[] = aiHumansData?.data || [];

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-6 md:p-12 space-y-12 overflow-y-auto relative custom-scrollbar">
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="relative space-y-4 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none animate-in fade-in slide-in-from-left-6 duration-1000">
                    AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">Personas</span>
                </h1>
                <p className="text-zinc-500 max-w-2xl text-lg font-medium leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                    Өвөрмөц зан чанартай AI-г нээгээрэй. Аялал бүр ганцхан мессежээр эхэлдэг...
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {aiHumans.map((persona, index) => (
                    <motion.div
                        key={persona._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        whileHover={{ y: -12 }}
                        onClick={() => router.push(`/ai-human?personaId=${persona._id}`)}
                        className="group relative cursor-pointer"
                    >
                        <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl transition-all duration-700 h-full group-hover:border-rose-500/30 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">

                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                    alt={persona.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />

                                <div className="absolute top-5 left-5 flex flex-col gap-2">
                                    <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black text-white uppercase tracking-[0.2em] w-fit">
                                        {persona.gender}
                                    </div>
                                    {persona.age && (
                                        <div className="px-3 py-1 rounded-full bg-rose-500/90 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-[0.2em] w-fit">
                                            {persona.age} yrs
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Active now</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white group-hover:text-rose-500 transition-colors duration-700 leading-none tracking-tight italic truncate">
                                        {persona.name}
                                    </h3>
                                    <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed font-medium transition-colors group-hover:text-zinc-400">
                                        {persona.shortBio || "Step into a world of mystery..."}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <div className="relative group/btn-container overflow-hidden rounded-xl">
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative w-full h-12 bg-white/[0.04] border border-white/5 flex items-center justify-between px-6 transition-all duration-500 group-hover:bg-transparent group-hover:border-transparent">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">Чатлах</span>
                                            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-rose-600 transition-all duration-500 shadow-lg">
                                                <MessageCircle size={14} fill="currentColor" className="opacity-40 group-hover:opacity-100" />
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
        </div>
    );
}
