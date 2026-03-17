'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Heart, MessageCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import useSWR from 'swr';
import { profileApi } from '@/apis';

interface ProfileViewProps {
    userId: string;
    onBack: () => void;
}

export function ProfileView({ userId, onBack }: ProfileViewProps) {
    const { data: profile, error, isLoading } = useSWR(
        userId ? `profile/public/${userId}` : null,
        () => profileApi.getPublicUserProfile(userId)
    );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col h-full items-center justify-center space-y-4 text-zinc-500">
                <AlertCircle size={48} />
                <p>Профайл ачаалахад алдаа гарлаа.</p>
                <button onClick={onBack} className="px-6 py-2 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all">
                    Буцах
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10">
            {/* Header / Back Button */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="p-3 bg-zinc-900/50 hover:bg-rose-500 group rounded-2xl transition-all border border-zinc-800"
                >
                    <ArrowLeft size={20} className="text-zinc-400 group-hover:text-white" />
                </button>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Профайл</h1>
            </div>

            {/* Profile Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[3rem] overflow-hidden border border-zinc-900/50 bg-zinc-900/20 backdrop-blur-xl"
            >
                {/* Cover Area / Top Half */}
                <div className="h-48 bg-linear-to-br from-rose-900/20 to-purple-900/20 relative">
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="px-8 pb-10 -mt-16 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden relative border-4 border-zinc-950 shadow-2xl bg-zinc-900">
                                <Image 
                                    src={profile.avatar || `https://picsum.photos/seed/${profile._id}/200/200`}
                                    alt={profile.username}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-1 pb-2">
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <h2 className="text-4xl font-serif font-bold text-white tracking-tight">{profile.name || profile.username}</h2>
                                    {profile.isPremium && (
                                        <div className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest">
                                            Premium
                                        </div>
                                    )}
                                </div>
                                <p className="text-zinc-500 font-medium">@{profile.username}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button className="flex-1 md:flex-none px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                                Мэндчилэх
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-10 border-t border-zinc-900/50">
                        {/* About / Info */}
                        <div className="space-y-6">
                            <div className="space-y-4 text-zinc-400">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500/80">Мэдээлэл</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50">
                                        <Calendar size={18} className="text-zinc-500" />
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Нас</p>
                                            <p className="text-white font-bold">{profile.age || 'Нууц'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50">
                                        <MapPin size={18} className="text-zinc-500" />
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Байршил</p>
                                            <p className="text-white font-bold">{profile.location || 'Улаанбаатар'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500/80">Товч танилцуулга</h3>
                                <p className="text-zinc-300 leading-relaxed bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/50 italic font-medium">
                                    &quot;{profile.bio || 'Одоогоор танилцуулга бичээгүй байна.'}&quot;
                                </p>
                            </div>
                        </div>

                        {/* Stats / Activity */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500/80">Үзүүлэлт</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 text-center space-y-2">
                                    <Heart size={24} className="mx-auto text-rose-500 opacity-50" />
                                    <p className="text-3xl font-serif font-bold text-white">0</p>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Нийт таалагдсан</p>
                                </div>
                                <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 text-center space-y-2">
                                    <MessageCircle size={24} className="mx-auto text-zinc-500 opacity-50" />
                                    <p className="text-3xl font-serif font-bold text-white">0</p>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Нийт түүх</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
