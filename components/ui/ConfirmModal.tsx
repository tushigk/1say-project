'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from './Loading';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Тийм',
    cancelText = 'Үгүй',
    isLoading = false,
    variant = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            bgIcon: 'bg-rose-500/10',
            textIcon: 'text-rose-500',
            borderIcon: 'border-rose-500/20',
            shadowIcon: 'shadow-[0_0_40px_rgba(244,63,94,0.1)]',
            bgConfirm: 'bg-rose-600 hover:bg-rose-500',
            shadowConfirm: 'shadow-[0_10px_20px_rgba(225,29,72,0.2)]'
        },
        warning: {
            bgIcon: 'bg-amber-500/10',
            textIcon: 'text-amber-500',
            borderIcon: 'border-amber-500/20',
            shadowIcon: 'shadow-[0_0_40px_rgba(245,158,11,0.1)]',
            bgConfirm: 'bg-amber-600 hover:bg-amber-500',
            shadowConfirm: 'shadow-[0_10px_20px_rgba(245,158,11,0.2)]'
        },
        info: {
            bgIcon: 'bg-blue-500/10',
            textIcon: 'text-blue-500',
            borderIcon: 'border-blue-500/20',
            shadowIcon: 'shadow-[0_0_40px_rgba(59,130,246,0.1)]',
            bgConfirm: 'bg-blue-600 hover:bg-blue-500',
            shadowConfirm: 'shadow-[0_10px_20px_rgba(59,130,246,0.2)]'
        }
    };

    const styles = variantStyles[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className={`w-20 h-20 rounded-[2rem] ${styles.bgIcon} flex items-center justify-center ${styles.textIcon} border ${styles.borderIcon} ${styles.shadowIcon}`}>
                                    <AlertTriangle size={32} />
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-xl font-serif font-bold text-white tracking-wide">{title}</h3>
                                    <p className="text-xs font-medium text-zinc-500 leading-relaxed max-w-[240px] uppercase tracking-widest">{description}</p>
                                </div>

                                <div className="flex flex-col gap-3 w-full pt-4">
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className={`w-full h-14 ${styles.bgConfirm} text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${styles.shadowConfirm} flex items-center justify-center disabled:opacity-50 active:scale-95`}
                                    >
                                        {isLoading ? <Loading size="sm" /> : confirmText}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-zinc-800 flex items-center justify-center active:scale-95"
                                    >
                                        {cancelText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
