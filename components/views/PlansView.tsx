'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { LogOut, Flame, ArrowRight, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/components/providers/AuthProvider";
import * as membershipApi from "@/apis/membership";
import { IMembershipPlan } from "@/components/models/membership";
import { userApi } from "@/apis/index";
import Image from "next/image";

type MembershipListResponse = {
    currentPage: number;
    data?: IMembershipPlan[];
    plans?: IMembershipPlan[];
    total: number;
    totalPages: number;
};

type Me = {
    _id: string;
    username: string;
    role?: string;
    membershipExpiresAt?: string | null;
};

export function PlansView() {
    const router = useRouter();
    const { logout, isAuthenticated } = useAuth();

    const { data, isLoading: isPlansLoading, error, mutate } = useSWR<MembershipListResponse>(
        "swr.membership",
        membershipApi.listMembershipPlans
    );

    const { data: me, isLoading: isMeLoading } = useSWR<Me | null>(
        "swr.me",
        async () => {
            try {
                const res = await userApi.me();
                return res as Me;
            } catch {
                return null;
            }
        },
        { revalidateOnFocus: false }
    );

    const isLoading = isPlansLoading || isMeLoading;

    const rawPlans = useMemo(() => data?.plans ?? data?.data ?? [], [data]);
    const plans = useMemo(() => rawPlans, [rawPlans]);

    const [loadingById, setLoadingById] = useState<Record<string, boolean>>({});

    const bestValueId = useMemo<string | undefined>(() => {
        if (!plans.length) return undefined;
        const TARGET_PRICE = 50000;
        const exact = plans.find((p) => p.price === TARGET_PRICE);
        if (exact) return exact._id;
        const withMonths = plans.filter((p) => Number.isFinite(p.months));
        if (withMonths.length) {
            return [...withMonths].sort((a, b) => (b.months ?? 0) - (a.months ?? 0))[0]._id;
        }
        return plans[Math.floor(plans.length / 2)]?._id;
    }, [plans]);

    const displayedPlans = useMemo<IMembershipPlan[]>(() => {
        if (!plans.length) return [];
        const arr = [...plans].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        const featuredIndex = bestValueId ? arr.findIndex((p) => p._id === bestValueId) : -1;
        if (featuredIndex > -1 && arr.length > 1) {
            const [featured] = arr.splice(featuredIndex, 1);
            arr.splice(1, 0, featured);
        }
        return arr.slice(0, 3);
    }, [plans, bestValueId]);

    const handleChoosePlan = (planId: string) => {
        if (!me?._id) {
            router.push(`/register?next=${encodeURIComponent(`/payment/${planId}`)}`);
            return;
        }
        setLoadingById((prev) => ({ ...prev, [planId]: true }));
        router.push(`/payment/${planId}`);
    };

    const benefits = [
        "Хязгааргүй зурвас илгээж, нууцлаг харилцааг бүтээх",
        "Тан руу татагдаж буй хүмүүсийг цаг тухайд нь мэдэх",
        "Бусдаас илүү тодорч, анхаарлын төвд хурдан очих",
        "Бусдаас ялгарах халуухан VIP тэмдэг, онцгой хүрээ",
        "Саад болох зүйлгүй, зөвхөн танд зориулсан хувийн орон зай",
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center w-full bg-[#030001] text-white overflow-x-hidden selection:bg-rose-600 selection:text-white pb-32">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-red-950/20 rounded-full blur-[160px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-rose-950/15 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-linear-to-b from-[#030001]/40 via-[#030001]/90 to-[#030001]" />
            </div>

            <main className="relative z-10 w-full container mx-auto px-4 py-16 flex flex-col items-center">
                {/* Header Section */}
                <div className="text-center mb-20 max-w-3xl mx-auto space-y-8 relative z-10">
                    <div className="flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-linear-to-r from-transparent to-red-600 rounded-full opacity-60" />
                        <span className="px-6 py-2.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-300 text-[10px] font-black tracking-[0.5em] uppercase backdrop-blur-3xl shadow-[0_0_30px_rgba(225,29,72,0.2)] animate-pulse" style={{ animationDuration: '4s' }}>
                            Хугацаат хямдрал: 50% OFF
                        </span>
                        <span className="h-px w-12 bg-linear-to-l from-transparent to-red-600 rounded-full opacity-60" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-serif leading-[1.1] tracking-tight">
                        Нууцлаг Хүсэл <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-rose-200 to-rose-900 italic font-light drop-shadow-[0_0_25px_rgba(225,29,72,0.3)] inline-block mt-3">Тансаг Мэдрэмж</span>
                    </h1>
                </div>

                {/* Plans Grid */}
                <div className="w-full max-w-6xl px-4 relative z-10">
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-[650px] rounded-[2.5rem] bg-rose-950/10 animate-pulse border border-rose-900/20 relative overflow-hidden backdrop-blur-sm">
                                    <div className="absolute inset-x-0 top-0 h-48 bg-rose-900/10" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-rose-950/30 flex items-center justify-center border border-rose-900/50 shadow-[0_0_30px_rgba(225,29,72,0.15)]">
                                <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-serif text-rose-100 mb-2">Холболтын алдаа</h2>
                                <Button onClick={() => mutate()} variant="outline" className="rounded-full px-10 border-rose-900/50 text-rose-300 hover:bg-rose-950/40 hover:text-white">Дахин оролдох</Button>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && displayedPlans.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
                            {displayedPlans.map((plan) => {
                                const isBest = plan._id === bestValueId;

                                return (
                                    <div
                                        key={plan._id}
                                        className={`
                                            group relative flex flex-col rounded-[2.5rem] transition-all duration-800 ease-out
                                            ${isBest ? 'scale-105 z-20' : 'hover:scale-[1.03] hover:-translate-y-2'}
                                        `}
                                    >
                                        <div className={`
                                            absolute inset-0 rounded-[2.5rem] overflow-hidden border transition-all duration-700
                                            ${isBest ? 'bg-red-950/5 border-red-500/40 shadow-[0_0_50px_rgba(229,9,20,0.1)]' : 'bg-white/2 border-white/5 hover:border-red-900/40'}
                                        `} />

                                        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border-[0.5px] border-white/5 mix-blend-overlay" />

                                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
                                            {plan.image?.url && (
                                                <Image
                                                    src={plan.image.url}
                                                    alt={plan.title}
                                                    fill
                                                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-2000"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-[#0a0002]/90" />
                                        </div>

                                        <div className="relative z-20 flex flex-col h-full flex-1">
                                            {isBest && (
                                                <div className="mt-7 mx-auto self-center bg-linear-to-r from-red-600 to-red-400 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(225,29,72,0.4)] animate-pulse" style={{ animationDuration: '3s' }}>
                                                    Хамгийн их эрэлттэй
                                                </div>
                                            )}

                                            <div className="p-10 pb-2 text-center">
                                                <h3 className={`text-[11px] tracking-[0.5em] uppercase font-black mb-6 transition-colors duration-500 ${isBest ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(225,29,72,0.4)]' : 'text-rose-900/60 group-hover:text-rose-700/80'}`}>
                                                    {plan.title}
                                                </h3>

                                                <div className="flex flex-col items-center justify-center py-6 relative">
                                                    <div className={`absolute -inset-8 rounded-full blur-2xl opacity-20 transition-opacity duration-800 ${isBest ? 'bg-red-500 group-hover:opacity-40' : 'bg-red-900/10 group-hover:opacity-30'}`} />

                                                    <div className="relative flex flex-col items-center justify-center">
                                                        <div className="flex items-center gap-3 mb-2 translate-y-3">
                                                            <span className="text-sm md:text-base text-zinc-500 line-through opacity-70 font-medium">
                                                                ₮{(plan.price * 2).toLocaleString()}
                                                            </span>
                                                            <div className="bg-red-950/40 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] border border-red-500/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.15)]">
                                                                <Flame size={12} className="text-red-500 animate-pulse" />
                                                                -50% Off
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                                            <span className="text-xl font-serif italic text-rose-700 mt-4 mr-1">₮</span>
                                                            <span className="text-6xl md:text-7xl font-serif font-black tracking-tighter text-white">
                                                                {plan.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-5 opacity-80 bg-red-950/20 px-5 py-2 rounded-full border border-red-900/20">
                                                            {plan.months} сарын хугацаатай
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-12 py-6">
                                                <div className={`h-px w-full ${isBest ? 'bg-linear-to-r from-transparent via-red-500/40 to-transparent' : 'bg-linear-to-r from-transparent via-white/5 to-transparent'}`} />
                                            </div>

                                            <div className="px-10 py-2 flex-1">
                                                <ul className="space-y-5">
                                                    {benefits.map((benefit, idx) => (
                                                        <li key={idx} className="flex items-start gap-4 group/item">
                                                            <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 transition-colors duration-500 ${isBest ? 'border-red-400/30 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : 'border-white/10 bg-white/5 text-zinc-600 group-hover/item:text-zinc-400 group-hover/item:border-white/20'}`}>
                                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <span className={`text-[13px] leading-relaxed transition-colors duration-500 ${isBest ? 'text-zinc-50 font-medium' : 'text-zinc-400 font-light group-hover/item:text-zinc-200'}`}>
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="p-10 pt-8 mt-auto">
                                                <Button
                                                    onClick={() => handleChoosePlan(plan._id)}
                                                    disabled={!!loadingById[plan._id]}
                                                    className={`
                                                        w-full h-16 rounded-4xl text-[11px] font-black uppercase tracking-[0.3em] cursor-pointer transition-all duration-700 relative overflow-hidden group/btn
                                                        ${isBest
                                                            ? 'bg-linear-to-r from-red-950 via-[#700000] to-red-950 bg-size-[200%_auto] text-white hover:bg-position-[100%_auto] shadow-[0_15px_40px_-10px_rgba(229,9,20,0.5)] border border-red-500/30'
                                                            : 'bg-transparent border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20 shadow-none'
                                                        }
                                                    `}
                                                >
                                                    {isBest && (
                                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/btn:animate-[shimmer_2s_infinite]" />
                                                    )}

                                                    {loadingById[plan._id] ? (
                                                        <Loading size="sm" text="Түр хүлээнэ үү..." />
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-3 font-black">
                                                            {isBest ? 'Эрхээ авах' : 'Сонгох'}
                                                            <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
