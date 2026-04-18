'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, User, RefreshCcw, Info, Trophy, BrainCircuit, X } from 'lucide-react';
import Image from 'next/image';
import { gameZoneApi } from '@/apis';
import { GameZone, GameZonePlayResponse } from '@/apis/gameZone';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import { RouletteWheel } from '@/components/ui/RouletteWheel';

interface GameZonePlayViewProps {
    gameId: string;
}

export function GameZonePlayView({ gameId }: GameZonePlayViewProps) {
    const router = useRouter();
    const [game, setGame] = useState<GameZone | null>(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [players, setPlayers] = useState<string[]>([]);
    const [currentPlayerName, setCurrentPlayerName] = useState('');
    const [result, setResult] = useState<GameZonePlayResponse['data'] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDeciding, setIsDeciding] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await gameZoneApi.getGameZoneDetail(gameId);
                setGame(response.data);
            } catch (err) {
                console.error(err);
                setError('Тоглоомын мэдээллийг авахад алдаа гарлаа.');
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [gameId]);

    const addPlayer = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (currentPlayerName.trim() && !players.includes(currentPlayerName.trim())) {
            setPlayers([...players, currentPlayerName.trim()]);
            setCurrentPlayerName('');
            setError(null);
        }
    };

    const removePlayer = (name: string) => {
        setPlayers(players.filter(p => p !== name));
    };

    const handlePlayArea = async () => {
        if (players.length === 0) {
            setError('Дор хаяж нэг тоглогч нэмнэ үү.');
            return;
        }

        setError(null);
        setCountdown(3);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    startGameExecution();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startGameExecution = async () => {
        setPlaying(true);
        try {
            const joinedNames = players.join(', ');
            const response = await gameZoneApi.playGameZone(gameId, { playerName: joinedNames });

            setIsDeciding(true);
            setTimeout(() => {
                setResult(response.data);
                setPlaying(false);
                setIsDeciding(false);
            }, 2000);
        } catch (err) {
            console.error(err);
            setError('Тоглоход алдаа гарлаа. Дахин оролдоно уу.');
            setPlaying(false);
            setIsDeciding(false);
        }
    };

    const handleSpinAgain = () => {
        setResult(null);
        setError(null);
        handlePlayArea();
    };

    const handleRestart = () => {
        setResult(null);
        setError(null);
        setPlayers([]);
        setCurrentPlayerName('');
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loading text="Тоглоомыг бэлдэж байна..." />
            </div>
        );
    }

    if (!game) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <p className="text-zinc-500">Тоглоом олдсонгүй.</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-all"
                >
                    Буцах
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-black">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={game.image?.url || `https://images.unsplash.com/photo-1614027164847-1b28006879b2?q=80&w=1600&auto=format&fit=crop`}
                    alt={game.title}
                    fill
                    className="object-cover opacity-20 blur-sm scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/40 md:hidden">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Back to Zone</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <h1 className="text-xs md:text-sm font-black text-white uppercase tracking-tighter leading-none">{game.title}</h1>
                        <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">{game.type}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-white/10">
                        <Image
                            src={game.image?.url || `https://images.unsplash.com/photo-1614027164847-1b28006879b2?q=80&w=100&auto=format&fit=crop`}
                            alt={game.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl">
                    <AnimatePresence mode="wait">
                        {countdown !== null ? (
                            <motion.div
                                key="countdown"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-center justify-center"
                            >
                                <span className="text-[12rem] md:text-[20rem] font-black text-white italic drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                                    {countdown}
                                </span>
                            </motion.div>
                        ) : playing ? (
                            <motion.div
                                key="spinning"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center justify-center space-y-12"
                            >
                                <RouletteWheel players={players} isSpinning={true} isStopping={isDeciding} />
                                <div className="text-center space-y-3">
                                    <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter animate-pulse">
                                        {isDeciding ? (
                                            <>Finalizing <span className="text-cyan-400">Outcome...</span></>
                                        ) : (
                                            <>Spinning the <span className="text-indigo-500">Wheel...</span></>
                                        )}
                                    </h3>
                                    <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest">
                                        {isDeciding ? "Хувь заяа тань шийдэгдэж байна" : "AI таны хувь заяаг шийдэж байна"}
                                    </p>
                                </div>
                            </motion.div>
                        ) : !result ? (
                            <motion.div
                                key="setup"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                        <Sparkles size={12} />
                                        <span>Ready to play?</span>
                                    </div>
                                    <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
                                        Who is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Playing?</span>
                                    </h2>
                                    <p className="text-zinc-500 text-sm md:text-lg max-w-xl mx-auto font-medium">
                                        Тоглох хүмүүсийн нэрсийг нэг нэгээр нь нэмнэ үү.
                                    </p>
                                </div>

                                <div className="max-w-xl mx-auto space-y-8">
                                    {/* Player Input Area */}
                                    <form onSubmit={addPlayer} className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                                        <div className="relative flex gap-3">
                                            <div className="relative flex-1">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={currentPlayerName}
                                                    onChange={(e) => setCurrentPlayerName(e.target.value)}
                                                    placeholder="Тоглогчийн нэр..."
                                                    className="w-full h-16 bg-zinc-900/80 border border-white/10 rounded-2xl pl-16 pr-6 text-white text-lg font-bold placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                    disabled={playing}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={playing || !currentPlayerName.trim()}
                                                className="h-16 px-6 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl font-black tracking-widest transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <span>ADD</span>
                                                <Sparkles size={16} />
                                            </button>
                                        </div>
                                    </form>

                                    {/* Players List Tags */}
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <AnimatePresence>
                                            {players.map((name) => (
                                                <motion.div
                                                    key={name}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="group flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-white"
                                                >
                                                    <span className="text-sm font-bold">{name}</span>
                                                    <button
                                                        onClick={() => removePlayer(name)}
                                                        className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Start Game Button */}
                                    <div className="pt-4 flex justify-center">
                                        <button
                                            onClick={handlePlayArea}
                                            disabled={playing || players.length === 0 || countdown !== null}
                                            className="h-16 px-12 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] hover:shadow-indigo-500/40 disabled:opacity-50 disabled:grayscale flex items-center gap-4 group"
                                        >
                                            <span>Start Game</span>
                                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                    </div>

                                    {error && (
                                        <p className="text-center text-xs font-bold text-rose-500 animate-pulse">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                                    {[
                                        { icon: BrainCircuit, title: "AI Powered", desc: "Ухаалаг алгоритм" },
                                        { icon: Trophy, title: "Level Up", desc: "Түвшин ахих" },
                                        { icon: Info, title: "Dynamic", desc: "Хувьсах орчин" }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-white tracking-widest">{item.title}</p>
                                                <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-wider">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="w-full max-w-2xl mx-auto flex flex-col items-center"
                            >
                                <div className="relative w-full">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-1 w-24 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full blur-sm opacity-50" />

                                    <div className="bg-zinc-900/60 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
                                        {/* Result Header */}
                                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                                    <BrainCircuit size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase tracking-tight">Тоглогчид: {result.playerName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* The AI Content */}
                                        <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                                            <p className="text-white text-lg md:text-2xl font-medium leading-relaxed italic font-serif">
                                                {result.response}
                                            </p>
                                        </div>

                                        {/* Stats Bar */}
                                        <div className="mt-12 pt-8 border-t border-white/5 flex gap-4 items-center justify-center">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handleRestart}
                                                    title="Reset Players"
                                                    className="p-3 rounded-full bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-all border border-white/5 group"
                                                >
                                                    <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                                                </button>
                                                <button
                                                    onClick={handleSpinAgain}
                                                    className="px-6 h-12 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/40"
                                                >
                                                    Spin Again
                                                </button>
                                            </div>
                                        </div>

                                        {/* Decorative elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -z-10" />
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -z-10" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Ambient Background Glows */}
            <div className="fixed top-1/2 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10 animate-pulse delay-700 pointer-events-none" />
        </div>
    );
}
