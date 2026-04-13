'use client';

import React from 'react';
import { X, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../ui/Loading';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string) => void;
    isLoading?: boolean;
}

export function CreateGroupModal({ isOpen, onClose, onSubmit, isLoading }: CreateGroupModalProps) {
    const [title, setTitle] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSubmit(title.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-white tracking-wide">Шинэ грүпп</h3>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Грүппийн нэр</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Нэрээ энд бичнэ үү..." 
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all placeholder:text-zinc-600 font-medium font-serif"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!title.trim() || isLoading}
                                className="w-full h-14 bg-white text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <Loading size="sm" />
                                ) : (
                                    <>
                                        Үүсгэх
                                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
