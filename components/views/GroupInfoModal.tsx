'use client';

import React from 'react';
import { X, Users, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Loading from '../ui/Loading';

interface Participant {
    _id: string;
    username: string;
    avatar?: string;
}

interface GroupInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    participants: Participant[];
    onLeave: () => void;
    isLeaving?: boolean;
}

export function GroupInfoModal({ 
    isOpen, 
    onClose, 
    title, 
    participants, 
    onLeave, 
    isLeaving 
}: GroupInfoModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-end md:p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md h-full md:h-[calc(100vh-2rem)] bg-zinc-950 border-l border-zinc-900 md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-zinc-900/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-white tracking-wide">Грүппийн мэдээлэл</h3>
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{participants.length} гишүүнтэй</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* Group Name Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Грүппийн нэр</label>
                            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 font-serif font-bold text-lg text-white">
                                {title}
                            </div>
                        </div>

                        {/* Participants Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Гишүүд</label>
                            </div>
                            <div className="space-y-3">
                                {participants.map((p) => (
                                    <div key={p._id} className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/30 border border-zinc-900/50 hover:bg-zinc-900/60 transition-all group">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-zinc-800">
                                            <Image 
                                                src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username || 'User')}&background=random`} 
                                                alt={p.username} 
                                                fill 
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{p.username}</p>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Гишүүн</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Shield size={14} className="text-zinc-700" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-8 border-t border-zinc-900/50 space-y-4">
                        <button
                            onClick={onLeave}
                            disabled={isLeaving}
                            className="w-full h-14 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-rose-500/20 hover:border-rose-500 flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95 group shadow-[0_0_30px_rgba(244,63,94,0.05)] hover:shadow-[0_10px_30px_rgba(244,63,94,0.2)]"
                        >
                            {isLeaving ? (
                                <Loading size="sm" />
                            ) : (
                                <>
                                    <LogOut size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    Грүппээс гарах
                                </>
                            )}
                        </button>
                        <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">
                            Грүппээс гарсан тохиолдолд та дахин урилгаар орох боломжтой
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
