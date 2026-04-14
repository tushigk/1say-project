'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import useSWR from 'swr';
import { profileApi, chatApi } from '@/apis';
import { toast } from 'react-hot-toast';
import { Plus, Users, X, Camera } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { mutate } from 'swr';
import { siteUrl } from '@/config/site';
import Loading from '@/components/ui/Loading';

interface GroupChat {
    _id: string;
    title: string;
    type: 'group' | 'direct';
    members?: string[];
}

interface ProfileViewProps {
    userId: string;
    onBack: () => void;
    onNavigateToChat?: (chatId: string) => void;
}

export function ProfileView({ userId, onBack, onNavigateToChat }: ProfileViewProps) {
    const { user: currentUser } = useAuth();
    const [isActionLoading, setIsActionLoading] = React.useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

    const { data, error, isLoading } = useSWR(
        userId ? `profile/public/${userId}` : null,
        () => profileApi.getPublicUserProfile(userId)
    );

    const { data: chatsData, isLoading: isGroupsLoading } = useSWR('chats', () => chatApi.listChats());

    const myGroups: GroupChat[] = React.useMemo(() => {
        const rawChats = chatsData?.data || chatsData || [];
        return rawChats.filter((chat: GroupChat) => chat.type === 'group');
    }, [chatsData]);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleAvatarClick = () => {
        if (currentUser?._id === profile?._id) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await profileApi.updateAvatar(formData);
            toast.success("Аватар амжилттай шинэчлэгдлээ");
            mutate(`profile/public/${userId}`);
            mutate(`${siteUrl}/users/me`);
        } catch (error: unknown) {
            console.error("Avatar Upload Error:", error);
            const message = error instanceof Error ? error.message : "Аватар хуулахад алдаа гарлаа";
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading text="Профайл ачаалж байна..." />
            </div>
        );
    }

    if (error || !data?.profile) {
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

    const { profile, posts, postsTotal } = data;

    const handlePM = async () => {
        if (!profile?._id) return;
        setIsActionLoading(true);
        try {
            const res = await chatApi.createDirectChat(profile._id);
            const chatId = res.data?._id || res._id;
            if (chatId) {
                onNavigateToChat?.(chatId);
            } else {
                toast.error("Чат үүсгэхэд асуудал гарлаа");
            }
        } catch (error: unknown) {
            console.error("PM Error:", error);
            const message = error instanceof Error ? error.message : "Чат үүсгэхэд алдаа гарлаа";
            toast.error(message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    };

    const handleInvite = async (chatId: string) => {
        setIsActionLoading(true);
        try {
            await chatApi.inviteToGroupChat(chatId, profile._id);
            toast.success("Урилга амжилттай илгээгдлээ");
            setIsInviteModalOpen(false);
        } catch (error: unknown) {
            console.error("Invite Error:", error);
            const message = error instanceof Error ? error.message : "Урихад алдаа гарлаа";
            toast.error(message);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[3rem] overflow-hidden border border-zinc-900/50 bg-zinc-900/20 backdrop-blur-xl"
            >
                <div className="h-48 bg-linear-to-br from-rose-900/20 to-purple-900/20 relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <button
                        onClick={onBack}
                        className="absolute top-6 left-6 p-3 bg-black/40 hover:bg-rose-500 group rounded-2xl backdrop-blur-md transition-all border border-white/10 z-10"
                    >
                        <ArrowLeft size={20} className="text-white/70 group-hover:text-white" />
                    </button>
                </div>

                <div className="px-8 pb-10 -mt-16 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left min-w-0 flex-1">
                            <div
                                onClick={handleAvatarClick}
                                className={`shrink-0 w-32 h-32 rounded-3xl overflow-hidden relative border-4 border-zinc-950 shadow-2xl bg-zinc-900 ${currentUser?._id === profile._id ? 'cursor-pointer group/avatar' : ''}`}
                            >
                                <Image
                                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=random`}
                                    alt={profile.username}
                                    fill
                                    className={`object-cover transition-transform duration-500 ${currentUser?._id === profile._id ? 'group-hover/avatar:scale-110' : ''}`}
                                />
                                {currentUser?._id === profile._id && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                        {isUploading ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Camera className="text-white" size={24} />
                                        )}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="space-y-1 pb-2 min-w-0 w-full md:w-auto md:flex-1 px-2 md:px-0">
                                <div className="flex items-center gap-2 justify-center md:justify-start min-w-0 overflow-hidden">
                                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight truncate min-w-0" title={profile.username}>
                                        {profile.username?.length > 10 ? `${profile.username.substring(0, 10)}...` : profile.username}
                                    </h2>
                                    <div className="shrink-0 px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-md text-[10px] font-bold uppercase tracking-widest">
                                        {profile.level?.title || 'Level 1'}
                                    </div>
                                </div>
                                <p className="text-zinc-500 font-medium capitalize truncate min-w-0 w-full md:w-auto">{profile.gender === 'male' ? 'Эрэгтэй' : profile.gender === 'female' ? 'Эмэгтэй' : profile.gender}</p>
                            </div>
                        </div>

                        {currentUser?._id !== profile._id && (
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start shrink-0">
                                <button
                                    onClick={handlePM}
                                    disabled={isActionLoading}
                                    className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    {isActionLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MessageCircle size={18} />}
                                    Мэндчилэх
                                </button>
                                <button
                                    onClick={openInviteModal}
                                    disabled={isActionLoading}
                                    className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-2xl font-bold transition-all border border-zinc-800 shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    <Plus size={18} className="text-rose-500" />
                                    Грүппт урих
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-10 border-t border-zinc-900/50">
                        <div className="space-y-6">
                            <div className="space-y-4 text-zinc-400">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500/80">Түвшин</h3>
                                <div className="space-y-4 bg-zinc-900/30 p-6 rounded-3xl border border-zinc-800/50">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Одоогийн Exp</p>
                                            <p className="text-white font-bold">{profile.exp} XP</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Дараагийн түвшин</p>
                                            <p className="text-rose-500 font-bold">{profile.nextLevel?.requiredExp || 0} XP</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-rose-500 to-purple-600 transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (profile.exp / (profile.nextLevel?.requiredExp || profile.exp)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500/80">Үзүүлэлт</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 text-center space-y-2">
                                    <MessageCircle size={24} className="mx-auto text-rose-500 opacity-50" />
                                    <p className="text-3xl font-serif font-bold text-white">{postsTotal || 0}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Нийт түүх</p>
                                </div>
                                <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/50 text-center space-y-2 text-zinc-700">
                                    <Heart size={24} className="mx-auto opacity-20" />
                                    <p className="text-3xl font-serif font-bold italic opacity-20">0</p>
                                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-20">Таалагдсан</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* User Posts Section */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500/80 px-4">Хуваалцсан түүхүүд</h3>
                <div className="grid grid-cols-1 gap-4">
                    {posts?.map((post: { _id: string, title: string, description: string, createdAt: string, likeCount: number, commentCount: number }) => (
                        <div
                            key={post._id}
                            className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-6 hover:bg-zinc-900/40 transition-colors group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-serif font-bold text-white group-hover:text-rose-400 transition-colors">{post.title}</h4>
                                <span className="text-[10px] text-zinc-600 font-bold uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{post.description}</p>
                            <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-800/30">
                                <div className="flex items-center gap-1.5 text-zinc-600">
                                    <Heart size={14} />
                                    <span className="text-xs font-bold">{post.likeCount}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-600">
                                    <MessageCircle size={14} />
                                    <span className="text-xs font-bold">{post.commentCount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!posts || posts.length === 0) && (
                        <div className="text-center py-20 bg-zinc-950/20 rounded-4xl border border-zinc-900 border-dashed">
                            <p className="text-zinc-500 text-sm">Одоогоор хуваалцсан түүх алга байна.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsInviteModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
                                <h3 className="text-xl font-serif font-bold text-white">Грүппт урих</h3>
                                <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto">
                                {isGroupsLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : myGroups.length > 0 ? (
                                    myGroups?.map((group: GroupChat) => (
                                        <button
                                            key={group._id}
                                            onClick={() => handleInvite(group._id)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900/50 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-left group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-rose-500">
                                                <Users size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-white group-hover:text-rose-500 transition-colors">{group.title}</p>
                                                <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{group.members?.length || 0} гишүүнтэй</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-zinc-500 italic">Та одоогоор грүпп чатад байхгүй байна.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
