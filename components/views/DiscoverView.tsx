'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import useSWR from 'swr';
import { membershipApi, chatApi } from '@/apis';
import toast from 'react-hot-toast';


interface MembershipUser {
    _id: string;
    username: string;
    gender: 'male' | 'female';
    age?: number;
    exp: number;
    isOnline: boolean;
    createdAt: string;
    avatar?: string;
}

interface MembershipResponse {
    data: MembershipUser[];
    total: number;
    page: number;
    totalPages: number;
}

export function DiscoverView({
    onNavigateToProfile,
    onNavigateToChat
}: {
    onNavigateToProfile?: (id: string) => void,
    onNavigateToChat?: (chatId: string) => void
}) {
    const [selectedGender, setSelectedGender] = React.useState<'male' | 'female' | 'all'>('all');
    const [page, setPage] = React.useState(1);
    const [users, setUsers] = React.useState<MembershipUser[]>([]);
    const [hasMore, setHasMore] = React.useState(true);
    const [isGreeting, setIsGreeting] = React.useState<string | null>(null);

    const { isLoading, isValidating } = useSWR<MembershipResponse>(
        [`users`, selectedGender, page],
        () => membershipApi.listActiveMembershipUsers({
            gender: selectedGender === 'all' ? undefined : selectedGender,
            page
        }),
        {
            onSuccess: (newData) => {
                if (page === 1) {
                    setUsers(newData.data);
                } else {
                    setUsers(prev => {
                        const existingIds = new Set(prev?.map(u => u._id));
                        const newUsers = newData.data.filter(u => !existingIds.has(u._id));
                        return [...prev, ...newUsers];
                    });
                }
                setHasMore(newData.page < newData.totalPages);
            },
            revalidateOnFocus: false
        }
    );

    const handleFilterChange = (gender: 'male' | 'female' | 'all') => {
        setSelectedGender(gender);
        setPage(1);
        setUsers([]);
        setHasMore(true);
    };

    const loadMore = () => {
        if (!isLoading && !isValidating && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const handleGreet = async (userId: string) => {
        setIsGreeting(userId);
        try {
            const res = await chatApi.createDirectChat(userId);
            if (res?._id || res?.data?._id) {
                const chatId = res?._id || res?.data?._id;
                onNavigateToChat?.(chatId);
            } else {
                toast.error('Чат үүсгэхэд алдаа гарлаа.');
            }
        } catch (error) {
            console.error('Greet error:', error);
            toast.error('Алдаа гарлаа. Дахин оролдоно уу.');
        } finally {
            setIsGreeting(null);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-[0.3em]">
                            <Sparkles size={14} />
                            <span>Санал болгож буй</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                            Танилцах
                        </h1>
                        <p className="text-zinc-500 max-w-lg leading-relaxed">
                            Өөртэйгөө ижил сонирхолтой хүмүүсийг олж нээж, шинэ харилцааг эхлүүл.
                        </p>
                    </div>

                    <div className="flex p-1.5 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800/50 w-fit">
                        {[
                            { id: 'all', label: 'Бүгд' },
                            { id: 'male', label: 'Эрэгтэй' },
                            { id: 'female', label: 'Эмэгтэй' }
                        ]?.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => handleFilterChange(filter.id as 'male' | 'female' | 'all')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${selectedGender === filter.id
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {users?.map((profile, index) => (
                    <motion.div
                        key={profile._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="group relative h-[500px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-rose-500/50 transition-all duration-500 shadow-2xl"
                    >
                        <Image
                            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=random`}
                            alt={profile.username}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                            referrerPolicy="no-referrer"
                            onClick={() => onNavigateToProfile?.(String(profile._id))}
                        />

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90"></div>
                        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <h3
                                        className="text-3xl font-serif font-bold text-white tracking-tight cursor-pointer hover:text-rose-500 transition-colors"
                                        onClick={() => onNavigateToProfile?.(String(profile._id))}
                                    >
                                        {profile.username}{profile.age ? <>, <span className="text-rose-500">{profile.age}</span></> : ''}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-zinc-300 font-medium">
                                        <div className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-zinc-500'}`} />
                                        {profile.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
                                        <span className="text-zinc-500">•</span>
                                        <span className="text-rose-400">{profile.exp} exp</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                {profile.isOnline ? 'Одоогоор идэвхтэй байна' : 'Одоогоор идэвхгүй байна'}
                            </p>

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => handleGreet(profile._id)}
                                    disabled={isGreeting === profile._id}
                                    className="flex-1 py-4 bg-white text-black hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-300 font-bold flex items-center justify-center gap-2 transform active:scale-95 shadow-lg disabled:opacity-50"
                                >
                                    {isGreeting === profile._id ? (
                                        <div className="w-5 h-5 border-2 border-zinc-900 border-t-zinc-400 rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Heart size={20} className="fill-current" />
                                            Мэндчилэх
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {hasMore && users.length > 0 && (
                <div className="flex justify-center pt-10">
                    <button
                        onClick={loadMore}
                        disabled={isLoading || isValidating}
                        className="px-10 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-bold hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                        {(isLoading || isValidating) ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span>Уншиж байна...</span>
                            </>
                        ) : (
                            <span>Цааш үзэх</span>
                        )}
                    </button>
                </div>
            )}

            {users.length === 0 && !isLoading && !isValidating && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
                        <Users size={32} className="opacity-20" />
                    </div>
                    <p className="text-lg">Энэ ангилалд хэрэглэгч олдсонгүй.</p>
                </div>
            )}
        </div>
    );
}
