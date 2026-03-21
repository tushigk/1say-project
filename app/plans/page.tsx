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
        "Хязгааргүй зурвас илгээж, шинээр танилцах",
        "Таны профайлыг хэн үзсэнийг цаг тухайд нь мэдэх",
        "Түвшин болон Exp 2 дахин хурдан ахих боломж",
        "Бусдаас ялгарах VIP тэмдэг, онцгой хүрээ",
        "Зар сурталчилгаагүй, илүү тав тухтай орчин",
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center w-full bg-[#050203] text-white overflow-x-hidden selection:bg-accent-crimson selection:text-white">
            {/* Ambient Background Effects - More Layered */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-accent-crimson/15 rounded-full blur-[160px] animate-pulse-slow mix-blend-screen" />
                <div className="absolute top-[10%] right-[-15%] w-[800px] h-[800px] bg-[#1a0b12] rounded-full blur-[140px] mix-blend-overlay" />
                <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-lighten" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#050203] opacity-80" />
            </div>

            <main className="relative z-10 w-full container mx-auto px-4 py-28 md:py-32 flex flex-col items-center">
                {/* Fixed Header/Navigation */}
                <nav className="fixed top-0 inset-x-0 z-50 px-4 py-4 md:px-12 md:py-6 flex items-center justify-between pointer-events-auto bg-black/40 backdrop-blur-2xl border-b border-white/5">
                    <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={() => router.push("/")}>
                        <Image src="/logo.png" alt="Logo" width={100} height={100} />
                    </div>

                    {isAuthenticated && (
                        <button
                            onClick={() => {
                                logout();
                                router.push("/");
                            }}
                            className="flex cursor-pointer items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 backdrop-blur-xl group"
                        >
                            <LogOut size={14} className="md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform duration-500" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Гарах</span>
                        </button>
                    )}
                </nav>

                {/* Header Section - Refined Typography */}
                <div className="text-center mb-24 max-w-3xl mx-auto space-y-8">
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-accent-crimson/50" />
                        <span className="px-5 py-2 rounded-full bg-accent-crimson/10 border border-accent-crimson/20 text-accent-crimson text-[10px] font-black tracking-[0.4em] uppercase backdrop-blur-2xl shadow-2xl animate-pulse">
                            Special Offer: 50% OFF
                        </span>
                        <span className="h-px w-8 bg-accent-crimson/50" />
                    </div>

                    <h1 className="text-5xl md:text-8xl font-serif font-bold leading-[1.1] tracking-tight">
                        Ухаалаг Сонголт <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-white/90 to-white/40">Тансаг Хэрэглээ</span>
                    </h1>

                    <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Энэ бол <span className="text-accent-crimson font-bold">50% ХӨНГӨЛӨЛТТЭЙ</span>-гөөр <span className="text-white font-medium italic">онцгой боломжийг</span> нээх таны хамгийн зөв цаг хугацаа.
                    </p>
                </div>

                {/* Plans Grid - Improved Elevation and Depth */}
                <div className="w-full max-w-6xl px-4">
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[1, 2, 3]?.map((i) => (
                                <div key={i} className="h-[650px] rounded-[3rem] bg-white/5 animate-pulse border border-white/5 relative overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-48 bg-white/5" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-accent-crimson/10 flex items-center justify-center border border-accent-crimson/20">
                                <svg className="w-8 h-8 text-accent-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">Холболтын алдаа</h2>
                                <p className="text-zinc-500 mb-6">Мэдээлэл ачаалахад алдаа гарлаа. Та интернэтээ шалгана уу.</p>
                                <Button onClick={() => mutate()} variant="outline" className="rounded-full px-10">Дахин оролдох</Button>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && displayedPlans.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
                            {displayedPlans?.map((plan) => {
                                const isBest = plan._id === bestValueId;

                                return (
                                    <div
                                        key={plan._id}
                                        className={`
                                            group relative flex flex-col rounded-[3rem] transition-all duration-700 ease-out
                                            ${isBest ? 'scale-105 z-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),0_0_80px_rgba(230,30,56,0.15)]' : 'hover:scale-[1.02] hover:-translate-y-2 shadow-2xl'}
                                        `}
                                    >
                                        {/* Premium Backdrop & Border Integration */}
                                        <div className={`
                                            absolute inset-0 rounded-[3rem] overflow-hidden backdrop-blur-3xl border
                                            ${isBest ? 'bg-[#0a0506]/95 border-white/20 ring-1 ring-accent-crimson/40 shadow-[inset_0_0_60px_rgba(230,30,56,0.08)]' : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'}
                                            transition-all duration-500
                                        `} />

                                        {/* Featured Image Background (Top Half) */}
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-[3rem]">
                                            {plan.image?.url && (
                                                <Image 
                                                    src={plan.image.url} 
                                                    alt={plan.title} 
                                                    fill 
                                                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 blur-sm"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/40 to-[#0a0506]" />
                                        </div>

                                        {/* Content Wrapper */}
                                        <div className="relative z-20 flex flex-col h-full flex-1">
                                            {/* Tag for Highlighted Plan */}
                                            {isBest && (
                                                <div className="mt-8 mx-auto self-center bg-accent-crimson text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-lg shadow-accent-crimson/20 animate-bounce-subtle">
                                                    Хамгийн их эрэлттэй
                                                </div>
                                            )}

                                            {/* Top Visual Section */}
                                            <div className="p-10 pb-4 text-center">
                                                <h3 className={`text-[10px] tracking-[0.4em] uppercase font-black mb-8 ${isBest ? 'text-accent-crimson' : 'text-zinc-500'}`}>
                                                    {plan.title}
                                                </h3>

                                                <div className="flex flex-col items-center justify-center py-4 relative">
                                                    {/* Price Background Glow */}
                                                    <div className={`absolute -inset-4 rounded-full blur-3xl opacity-20 ${isBest ? 'bg-accent-crimson' : 'bg-white'}`} />
                                                    
                                                    <div className="relative flex flex-col items-center justify-center">
                                                        <div className="flex items-center gap-3 mb-2 translate-y-2">
                                                            <span className="text-sm md:text-base text-zinc-600 line-through opacity-40 font-bold">
                                                                ₮{(plan.price * 2).toLocaleString()}
                                                            </span>
                                                            <div className="bg-accent-crimson/20 text-accent-crimson text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.2em] border border-accent-crimson/20 flex items-center gap-1">
                                                                <Flame size={10} />
                                                                -50% Off
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start">
                                                            <span className="text-xl font-bold text-zinc-600 mt-2 mr-1">₮</span>
                                                            <span className="text-6xl md:text-7xl font-serif font-black tracking-tighter text-white">
                                                                {plan.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4 opacity-70 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                            {plan.months} сарын хугацаатай
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="px-12 py-4">
                                                <div className={`h-px w-full ${isBest ? 'bg-gradient-to-r from-transparent via-accent-crimson/40 to-transparent' : 'bg-white/5'}`} />
                                            </div>

                                            {/* Benefits List */}
                                            <div className="px-10 py-6 flex-1">
                                                <ul className="space-y-4">
                                                    {benefits?.map((benefit, idx) => (
                                                        <li key={idx} className="flex items-start gap-4 group/item">
                                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 ${isBest ? 'border-accent-crimson/40 bg-accent-crimson/10 text-accent-crimson shadow-[0_0_15px_rgba(230,30,56,0.3)]' : 'border-white/10 bg-white/5 text-zinc-500'}`}>
                                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <span className={`text-[13px] leading-relaxed font-medium transition-colors ${isBest ? 'text-zinc-200' : 'text-zinc-500 group-hover/item:text-zinc-300'}`}>
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Action Button */}
                                            <div className="p-10 pt-0 mt-auto">
                                                <Button
                                                    onClick={() => handleChoosePlan(plan._id)}
                                                    disabled={!!loadingById[plan._id]}
                                                    className={`
                                                        w-full h-16 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all duration-500 relative overflow-hidden group/btn
                                                        ${isBest
                                                            ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-[0_20px_40px_-10px_rgba(255,255,255,0.15)] overflow-hidden'
                                                            : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white shadow-none'
                                                        }
                                                    `}
                                                >
                                                    {isBest && (
                                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                                                    )}
                                                    
                                                    {loadingById[plan._id] ? (
                                                        <div className="flex items-center justify-center gap-3 cursor-pointer">
                                                            <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                                                            <span>Process...</span>
                                                        </div>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-2">
                                                            Сонгох
                                                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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

                {/* Footer Trust Indicators */}
                <div className="mt-32 w-full max-w-2xl py-12 px-8 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-around gap-10 opacity-60">
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Security Guaranteed</span>
                    </div>

                    <div className="h-4 w-px bg-white/10 hidden md:block" />

                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Instant Activation</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
