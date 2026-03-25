"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { LogOut, Flame, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import * as membershipApi from "@/apis/membership";
import { IMembershipPlan } from "@/components/models/membership";
import { userApi } from "../../apis/index";
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

export default function PlansPage() {
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
        <div className="relative min-h-screen flex flex-col items-center w-full bg-[#030001] text-white overflow-x-hidden selection:bg-rose-600 selection:text-white">
            {/* Ambient Background Effects - Erotic & Seductive Layered */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-rose-900/15 rounded-full blur-[180px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
                <div className="absolute top-[20%] right-[-15%] w-[900px] h-[900px] bg-red-950/30 rounded-full blur-[150px] mix-blend-multiply" />
                <div className="absolute bottom-[-15%] left-[5%] w-[800px] h-[800px] bg-rose-800/10 rounded-full blur-[130px] mix-blend-color-dodge animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.04] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#030001]/60 via-[#030001]/90 to-[#030001] opacity-90" />
            </div>

            <main className="relative z-10 w-full container mx-auto px-4 py-28 md:py-32 flex flex-col items-center">
                {/* Fixed Header/Navigation */}
                <nav className="fixed top-0 inset-x-0 z-50 px-4 py-4 md:px-12 md:py-6 flex items-center justify-between pointer-events-auto bg-[#030001]/60 backdrop-blur-3xl border-b border-rose-900/30">
                    <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={() => router.push("/")}>
                        <Image src="/logo.png" alt="Logo" width={100} height={100} className="drop-shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-transform duration-700 group-hover:scale-105" />
                    </div>

                    {isAuthenticated && (
                        <button
                            onClick={() => {
                                logout();
                                router.push("/");
                            }}
                            className="flex cursor-pointer items-center gap-2 md:gap-3 px-5 py-2.5 md:px-7 md:py-3.5 rounded-[2rem] bg-rose-950/20 border border-rose-900/40 text-rose-200/80 hover:text-white hover:bg-rose-900/40 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(225,29,72,0.25)] transition-all duration-500 backdrop-blur-xl group"
                        >
                            <LogOut size={14} className="md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform duration-500 text-rose-400 group-hover:text-rose-300" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Гарах</span>
                        </button>
                    )}
                </nav>

                {/* Header Section - Seductive Typography */}
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-8 relative z-10">
                    <div className="flex items-center justify-center gap-4">
                        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-rose-600 rounded-full opacity-60" />
                        <span className="px-6 py-2.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[10px] font-black tracking-[0.5em] uppercase backdrop-blur-3xl shadow-[0_0_30px_rgba(225,29,72,0.2)] animate-pulse" style={{ animationDuration: '4s' }}>
                            Intimate Offer: 50% OFF
                        </span>
                        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-rose-600 rounded-full opacity-60" />
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] tracking-tight drop-shadow-[0_0_40px_rgba(225,29,72,0.25)]">
                        Нууцлаг Хүсэл <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-rose-100 via-rose-300 to-rose-800 italic font-light drop-shadow-2xl inline-block mt-3">Тансаг Мэдрэмж</span>
                    </h1>

                    <p className="text-rose-200/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
                        Энэ бол <span className="text-rose-500 font-bold drop-shadow-[0_0_12px_rgba(225,29,72,0.5)]">50% ХӨНГӨЛӨЛТТЭЙ</span>-гөөр <span className="text-white font-medium italic">дотоод хүслээ</span> нээх таны хамгийн зөв цаг хугацаа.
                    </p>
                </div>

                {/* Plans Grid - Erotic Deep Elevation */}
                <div className="w-full max-w-6xl px-4 relative z-10">
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[1, 2, 3]?.map((i) => (
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
                                <p className="text-rose-200/50 mb-8 font-light">Мэдээлэл ачаалахад алдаа гарлаа. Та интернэтээ шалгана уу.</p>
                                <Button onClick={() => mutate()} variant="outline" className="rounded-full px-10 border-rose-900/50 text-rose-300 hover:bg-rose-950/40 hover:text-white">Дахин оролдох</Button>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && displayedPlans.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
                            {displayedPlans?.map((plan) => {
                                const isBest = plan._id === bestValueId;

                                return (
                                    <div
                                        key={plan._id}
                                        className={`
                                            group relative flex flex-col rounded-[2.5rem] transition-all duration-[800ms] ease-out
                                            ${isBest ? 'scale-105 z-20' : 'hover:scale-[1.03] hover:-translate-y-2'}
                                        `}
                                    >
                                        {/* Premium Backdrop & Border Integration */}
                                        <div className={`
                                            absolute inset-0 rounded-[2.5rem] overflow-hidden border transition-colors duration-[800ms]
                                            ${isBest ? 'bg-black/20 border-rose-500/30 ring-1 ring-rose-500/40' : 'bg-black/40 border-rose-900/20 hover:border-rose-700/40'}
                                        `} />

                                        {/* Featured Image Background */}
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
                                            {plan.image?.url && (
                                                <Image
                                                    src={plan.image.url}
                                                    alt={plan.title}
                                                    fill
                                                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0002]/90" />
                                        </div>

                                        {/* Content Wrapper */}
                                        <div className="relative z-20 flex flex-col h-full flex-1">
                                            {/* Tag for Highlighted Plan */}
                                            {isBest && (
                                                <div className="mt-7 mx-auto self-center bg-gradient-to-r from-rose-800 to-rose-600 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(225,29,72,0.4)] animate-pulse" style={{ animationDuration: '3s' }}>
                                                    Хамгийн их эрэлттэй
                                                </div>
                                            )}

                                            {/* Top Visual Section */}
                                            <div className="p-10 pb-2 text-center">
                                                <h3 className={`text-[11px] tracking-[0.5em] uppercase font-black mb-6 transition-colors duration-500 ${isBest ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(225,29,72,0.4)]' : 'text-rose-900/60 group-hover:text-rose-700/80'}`}>
                                                    {plan.title}
                                                </h3>

                                                <div className="flex flex-col items-center justify-center py-6 relative">
                                                    {/* Price Background Glow */}
                                                    <div className={`absolute -inset-8 rounded-full blur-[40px] opacity-20 transition-opacity duration-[800ms] ${isBest ? 'bg-rose-500 group-hover:opacity-40' : 'bg-rose-900/10 group-hover:opacity-30'}`} />

                                                    <div className="relative flex flex-col items-center justify-center">
                                                        <div className="flex items-center gap-3 mb-2 translate-y-3">
                                                            <span className="text-sm md:text-base text-rose-950/60 line-through opacity-70 font-medium">
                                                                ₮{(plan.price * 2).toLocaleString()}
                                                            </span>
                                                            <div className="bg-rose-950/40 text-rose-400 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] border border-rose-500/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.15)]">
                                                                <Flame size={12} className="text-rose-500 animate-pulse" />
                                                                -50% Off
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                                            <span className="text-xl font-serif italic text-rose-700 mt-4 mr-1">₮</span>
                                                            <span className="text-6xl md:text-[5rem] font-serif font-black tracking-tighter text-white">
                                                                {plan.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <span className="text-rose-200/80 text-[10px] font-black uppercase tracking-[0.3em] mt-5 opacity-80 bg-rose-950/30 px-5 py-2 rounded-full border border-rose-900/40">
                                                            {plan.months} сарын хугацаатай
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="px-12 py-6">
                                                <div className={`h-px w-full ${isBest ? 'bg-gradient-to-r from-transparent via-rose-500/40 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-900/30 to-transparent'}`} />
                                            </div>

                                            {/* Benefits List */}
                                            <div className="px-10 py-2 flex-1">
                                                <ul className="space-y-5">
                                                    {benefits?.map((benefit, idx) => (
                                                        <li key={idx} className="flex items-start gap-4 group/item">
                                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 transition-colors duration-500 ${isBest ? 'border-rose-400/30 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.2)]' : 'border-rose-900/20 bg-rose-950/10 text-rose-900/60 group-hover/item:text-rose-700 group-hover/item:border-rose-800/40'}`}>
                                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <span className={`text-[13px] leading-relaxed transition-colors duration-500 ${isBest ? 'text-rose-50 font-medium' : 'text-rose-200/50 font-light group-hover/item:text-rose-100/80'}`}>
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Action Button */}
                                            <div className="p-10 pt-8 mt-auto">
                                                <Button
                                                    onClick={() => handleChoosePlan(plan._id)}
                                                    disabled={!!loadingById[plan._id]}
                                                    className={`
                                                        w-full h-16 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] cursor-pointer transition-all duration-[800ms] relative overflow-hidden group/btn
                                                        ${isBest
                                                            ? 'bg-gradient-to-r from-rose-700 to-rose-500 text-white hover:from-rose-600 hover:to-rose-400 shadow-[0_15px_40px_-10px_rgba(225,29,72,0.5)] border-none'
                                                            : 'bg-transparent border border-rose-900/40 text-rose-300 hover:bg-rose-950/30 hover:text-white hover:border-rose-600/50 shadow-none'
                                                        }
                                                    `}
                                                >
                                                    {isBest && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/btn:animate-[shimmer_2s_infinite]" />
                                                    )}

                                                    {loadingById[plan._id] ? (
                                                        <div className="flex items-center justify-center gap-3 cursor-pointer">
                                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                            <span className="tracking-[0.4em]">Түр хүлээнэ үү...</span>
                                                        </div>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-3">
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

                {/* Footer Trust Indicators - Intimate subtle tone */}
                <div className="mt-36 w-full max-w-2xl py-10 px-8 rounded-[2.5rem] bg-[#050001]/40 border border-rose-900/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-around gap-10 opacity-70">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-rose-950/20 flex items-center justify-center group-hover:bg-rose-900/30 transition-colors duration-500 border border-rose-900/10 group-hover:border-rose-800/30">
                            <svg className="w-5 h-5 text-rose-700 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-900/60 group-hover:text-rose-400 transition-colors">Security Guaranteed</span>
                    </div>

                    <div className="h-6 w-px bg-rose-900/20 hidden md:block" />

                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-rose-950/20 flex items-center justify-center group-hover:bg-rose-900/30 transition-colors duration-500 border border-rose-900/10 group-hover:border-rose-800/30">
                            <svg className="w-5 h-5 text-rose-700 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-900/60 group-hover:text-rose-400 transition-colors">Instant Activation</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
