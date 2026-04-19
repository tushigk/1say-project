'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Play, Info, X, Star, Trophy } from 'lucide-react';
import Image from 'next/image';
import { gameZoneApi } from '@/apis';
import { GameZone } from '@/apis/gameZone';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import { HeatLevelSelector } from '@/components/ui/HeatLevelSelector';

export function GameZoneListView() {
    const [selectedGame, setSelectedGame] = useState<GameZone | null>(null);
    const [heatLevel, setHeatLevel] = useState(1);
    const router = useRouter();
    const { data: gameZonesData, isLoading } = useSWR('game-zones', () => gameZoneApi.listGameZones());

    const gameZones: GameZone[] = gameZonesData?.data || [];

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loading text="Тоглоомуудыг ачаалж байна..." />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-4 md:p-12 space-y-8 md:space-y-12 overflow-y-auto relative custom-scrollbar">
            {/* Ambient Background Elements */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="relative space-y-2 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-3 mb-2"
                >
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <Gamepad2 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Entertainment</span>
                </motion.div>

                <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                    Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">Zone</span>
                </h1>
                <p className="text-zinc-500 max-w-2xl text-xs md:text-base font-medium leading-relaxed">
                    AI-д суурилсан хөгжөөнт тоглоомуудын ертөнцөөр аялаарай. Өөрийн авхаалж самбаагаа сорьж, шинэ туршлагыг мэдэр.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {gameZones.map((game, index) => (
                    <motion.div
                        key={game._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        onClick={() => setSelectedGame(game)}
                        className="group relative cursor-pointer"
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition duration-500" />

                        <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl transition-all duration-500 h-full flex flex-col group-hover:border-white/10">

                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={game.image?.url || `https://images.unsplash.com/photo-1614027164847-1b28006879b2?q=80&w=800&auto=format&fit=crop`}
                                    alt={game.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-wider">
                                        {game.type.replace('_', ' ')}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-wider">
                                        {game.level}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300 mb-2">
                                    {game.title}
                                </h3>
                                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-6">
                                    {game.description || "Explore this exciting AI-powered game and discover new possibilities."}
                                </p>

                                <div className="mt-auto flex items-center justify-end">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all duration-500 shadow-xl group-hover:shadow-indigo-500/20">
                                        <Play size={16} fill="currentColor" className="ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pt-24 md:pt-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedGame(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row max-h-[85vh] overflow-y-auto overflow-x-hidden"
                        >
                            <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto overflow-hidden">
                                <Image
                                    src={selectedGame.image?.url || `https://images.unsplash.com/photo-1614027164847-1b28006879b2?q=80&w=800&auto=format&fit=crop`}
                                    alt={selectedGame.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />

                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:bg-black hover:text-white transition-all backdrop-blur-md border border-white/10 md:hidden"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 md:p-12 w-full md:w-1/2 flex flex-col shrink-0">
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-wider">
                                            {selectedGame.type}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedGame(null)}
                                        className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 uppercase tracking-tighter">
                                    {selectedGame.title}
                                </h2>

                                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                    <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-h-[80px] md:max-h-none overflow-y-auto pr-2">
                                        {selectedGame.description || "Experience the next generation of AI gaming. Engage in a unique adventure where your choices and interactions shape the outcome."}
                                    </p>

                                    <div className="grid grid-cols-1 gap-2 pt-2 md:pt-4">
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 w-full flex-1">
                                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Difficulty</p>
                                            <div className="flex items-center gap-1 text-xs font-bold text-zinc-300 uppercase">
                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                {selectedGame.level}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6 pt-2 w-full">
                                        <HeatLevelSelector level={heatLevel} onChange={setHeatLevel} variant="compact" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/game-zone/play/${selectedGame._id}?heatLevel=${heatLevel}`)}
                                    className="group/play w-full h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-black tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-xl hover:shadow-indigo-500/40 active:scale-95"
                                >
                                    <span>ЭХЛЭХ</span>
                                    <Play size={18} fill="currentColor" className="group-hover/play:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
