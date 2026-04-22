'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import useSWRInfinite from 'swr/infinite';
import { membershipApi, chatApi } from '@/apis';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/providers/AuthProvider';
import Loading from '@/components/ui/Loading';


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
    const { user } = useAuth();
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all');
    const [isGreeting, setIsGreeting] = useState<string | null>(null);
    const [hasSetInitialGender, setHasSetInitialGender] = useState(false);

    useEffect(() => {
        if (user?.gender && !hasSetInitialGender) {
            setSelectedGender(user.gender === 'male' ? 'female' : 'male');
            setHasSetInitialGender(true);
        }
    }, [user?.gender, hasSetInitialGender]);

    const getKey = (pageIndex: number, previousPageData: MembershipResponse | null) => {
        if (previousPageData && previousPageData.page >= previousPageData.totalPages) return null;
        return [`users`, selectedGender, pageIndex + 1];
    };

    const { data: infiniteData, size, setSize, isLoading, isValidating } = useSWRInfinite<MembershipResponse>(
        getKey,
        ([, gender, p]) => membershipApi.listActiveMembershipUsers({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            gender: gender === 'all' ? undefined : (gender as any),
            page: p as number
        }),
        { revalidateOnFocus: false }
    );

    const users = infiniteData ? infiniteData.flatMap(page => page.data || []) : [];
    const hasMore = infiniteData ? (infiniteData[infiniteData.length - 1].page < infiniteData[infiniteData.length - 1].totalPages) : true;

    const handleFilterChange = (gender: 'male' | 'female' | 'all') => {
        setSelectedGender(gender);
        setSize(1);
    };

    const loadMore = () => {
        if (!isLoading && !isValidating && hasMore) {
            setSize(size + 1);
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
        <div className="flex-1 flex flex-col h-full overflow-y-auto relative custom-scrollbar p-4 md:p-10">
            <div className="max-w-7xl mx-auto w-full space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-[0.3em]">
                                <Sparkles size={14} />
                                <span>Санал болгож буй</span>
                            </div>
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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-8">
                    {users?.map((profile, index) => (
                        <motion.div
                            key={profile._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            whileHover={{ y: -12 }}
                            onClick={() => onNavigateToProfile?.(String(profile._id))}
                            className="group relative cursor-pointer"
                        >
                            <div className="relative bg-zinc-900/40 border border-white/5 rounded-2xl md:rounded-[2.5rem] overflow-hidden backdrop-blur-xl transition-all duration-700 h-full group-hover:border-rose-500/30 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">

                                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                                    <Image
                                        src={profile.avatar || ""}
                                        alt={profile.username}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        priority={index < 4}
                                        className="object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://ui-avatars.com/api/?name=${profile.username}&background=random`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />

                                    <div className="absolute top-3 left-3 md:top-5 md:left-5 flex flex-col gap-1.5 md:gap-2">
                                        <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[7px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] w-fit">
                                            {profile.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
                                        </div>
                                        {profile.age && (
                                            <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-rose-500/90 backdrop-blur-md text-[7px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] w-fit">
                                                {profile.age} yrs
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-3 md:p-6 space-y-2.5 md:space-y-5 flex flex-col justify-between flex-1">
                                    <div className="space-y-1.5 md:space-y-4">
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${profile.isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-zinc-600'}`} />
                                            <span className="text-[7px] md:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{profile.isOnline ? 'Онлайн' : 'Офлайн'}</span>
                                        </div>
                                        <h3 className="text-base md:text-3xl font-serif font-bold text-white group-hover:text-rose-500 transition-colors duration-700 leading-tight tracking-tight italic truncate">
                                            {profile.username}
                                        </h3>
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="px-2 py-0.5 md:px-3 md:py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] md:text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                                                {profile.exp} EXP
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-1 md:pt-2 mt-auto">
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleGreet(profile._id);
                                            }}
                                            className={`relative group/btn-container overflow-hidden rounded-[8px] md:rounded-xl cursor-pointer ${isGreeting === profile._id ? 'opacity-70 pointer-events-none' : ''}`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="relative w-full h-8 md:h-12 bg-white/[0.04] border border-white/5 flex items-center justify-between px-3 md:px-6 transition-all duration-500 group-hover:bg-transparent group-hover:border-transparent">
                                                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
                                                    {isGreeting === profile._id ? 'Уншиж байна...' : 'Мэндчилэх'}
                                                </span>
                                                <div className="w-5 h-5 md:w-7 md:h-7 rounded-[6px] md:rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-rose-600 transition-all duration-500 shadow-lg">
                                                    {isGreeting === profile._id ? (
                                                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Heart size={10} fill="currentColor" className="opacity-40 group-hover:opacity-100 scale-100 md:scale-125" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -inset-2 bg-rose-500/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
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
                                    <Loading size="sm" />
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
        </div>
    );
}
