'use client';

import React from 'react';
import { X, User, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Loading from '../ui/Loading';

interface ChatInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    avatar?: string;
    onDelete: () => void;
    onViewProfile: () => void;
    isDeleting?: boolean;
}

export function ChatInfoModal({ 
    isOpen, 
    onClose, 
    name, 
    avatar, 
    onDelete, 
    onViewProfile,
    isDeleting 
}: ChatInfoModalProps) {
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
                    className="relative w-full max-w-sm h-full md:h-[calc(100vh-2rem)] bg-zinc-950 border-l border-zinc-900 md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-rose-500/5 blur-[100px] pointer-events-none" />

                    {/* Header */}
                    <div className="p-8 flex items-center justify-between relative z-10">
                        <h3 className="text-xl font-serif font-bold text-white tracking-wide">Хэрэглэгчийн мэдээлэл</h3>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all flex items-center justify-center"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center relative z-10">
                        {/* Profile Section */}
                        <div className="flex flex-col items-center space-y-6 w-full">
                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden relative ring-4 ring-zinc-900/50 shadow-2xl">
                                <Image 
                                    src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`} 
                                    alt={name} 
                                    fill 
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                            
                            <div className="text-center space-y-2">
                                <h4 className="text-2xl font-serif font-bold text-white leading-tight">{name}</h4>
                                <div className="flex items-center justify-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none">Online</p>
                                </div>
                            </div>

                            <button
                                onClick={onViewProfile}
                                className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-zinc-800 flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                <User size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
                                Профайл харах
                                <ExternalLink size={14} className="opacity-30" />
                            </button>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-8 border-t border-zinc-900/50 space-y-4 relative z-10">
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="w-full h-14 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-rose-500/20 hover:border-rose-500 flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95 group shadow-[0_0_30px_rgba(244,63,94,0.05)] hover:shadow-[0_10px_30px_rgba(244,63,94,0.2)]"
                        >
                            {isDeleting ? (
                                <Loading size="sm" />
                            ) : (
                                <>
                                    <Trash2 size={18} className="translate-y-0 group-hover:-translate-y-0.5 transition-transform" />
                                    Чатыг бүрмөсөн устгах
                                </>
                            )}
                        </button>
                        <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest px-4 leading-relaxed">
                            Чат устгасан тохиолдолд таны бүх зурвас устгагдахыг анхаарна уу
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
