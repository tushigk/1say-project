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
        <div className="flex-1 flex flex-col p-6 md:p-10 space-y-10 overflow-y-auto">
            <div className="space-y-2">
                <h1 className="text-4xl font-serif font-bold text-white tracking-tight">AI Personas</h1>
                <p className="text-zinc-500 max-w-2xl font-medium">Эрхэм хэрэглэгч та өөрийн хүссэн AI дүртэйгээ холбогдон хөгжилтэй яриа өрнүүлээрэй.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {aiHumans.map((persona, index) => (
                    <motion.div
                        key={persona._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-sm hover:border-rose-500/30 transition-all duration-500"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                                src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                alt={persona.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

                            {/* Tags */}
                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                <span className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                                    {persona.gender}
                                </span>
                                {persona.age && (
                                    <span className="px-4 py-1.5 rounded-full bg-rose-500/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest">
                                        {persona.age} years
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white group-hover:text-rose-400 transition-colors uppercase tracking-tight">{persona.name}</h3>
                                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed font-medium">
                                    {persona.shortBio}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center gap-3">
                                <button
                                    onClick={() => router.push(`/ai-human?personaId=${persona._id}`)}
                                    className="flex-1 h-14 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xl shadow-white/5 active:scale-95"
                                >
                                    <MessageCircle size={18} />
                                    <span>Чатлах</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
