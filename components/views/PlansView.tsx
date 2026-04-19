'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Button from "@/components/ui/Button";
import * as membershipApi from "@/apis/membership";
import { IMembershipPlan } from "@/components/models/membership";
import { userApi } from "@/apis/index";

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
};

export function PlansView() {
    const router = useRouter();

    const { data, isLoading, error, mutate } = useSWR<MembershipListResponse>(
        "swr.membership",
        membershipApi.listMembershipPlans
    );

    const { data: me } = useSWR<Me | null>(
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

    const rawPlans = useMemo(() => data?.plans ?? data?.data ?? [], [data]);

    const plans = useMemo(() => rawPlans, [rawPlans]);

    const [loadingById, setLoadingById] = useState<Record<string, boolean>>({});

    const bestValueId = useMemo<string | undefined>(() => {
        if (!plans.length) return undefined;

        const TARGET_PRICE = 40000;

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
        "AI Human-тай хязгааргүй чатлаж, дотносох",
        "Хөгжөөнт AI тоглоомуудыг саадгүй тоглох",
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center w-full bg-[#050203] text-white overflow-x-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-crimson/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#f7e7ce]/5 rounded-full blur-[80px]" />
            </div>

            <main className="relative z-10 w-full container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">

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
                <div className="w-full max-w-6xl">
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-[600px] rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-red-400 mb-4">Алдаа гарлаа. Дахин оролдоно уу.</p>
                            <Button onClick={() => mutate()} variant="outline">Дахин ачаалах</Button>
                        </div>
                    )}

                    {!isLoading && !error && displayedPlans.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 items-stretch">
                            {displayedPlans.map((plan) => {
                                const isBest = plan._id === bestValueId;

                                return (
                                    <div
                                        key={plan._id}
                                        className={`
                                            relative flex flex-col p-1 rounded-3xl transition-all duration-500 ease-out
                                            ${isBest ? 'scale-100 md:scale-105 z-10 shadow-[0_0_50px_rgba(230,30,56,0.15)]' : 'scale-100 hover:scale-[1.02] bg-white/5'}
                                        `}
                                    >
                                        {/* Gradient Border for Best Plan */}
                                        {isBest && (
                                            <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-accent-crimson via-[#ff4d6d] to-purple-600 opacity-60 blur-sm" />
                                        )}

                                        <div className={`
                                            relative flex-1 flex flex-col h-full rounded-[22px] overflow-hidden backdrop-blur-xl border
                                            ${isBest ? 'bg-[#0f080a] border-white/10' : 'bg-[#0f080a]/80 border-white/5'}
                                        `}>
                                            {/* Best Value Badge */}
                                            {isBest && (
                                                <div className="absolute top-0 right-0 bg-accent-crimson text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-widest z-20">
                                                    Санал болгох
                                                </div>
                                            )}

                                            {/* Image/Cover */}
                                            {plan.image?.url && (
                                                <div className="relative h-48 w-full overflow-hidden">
                                                    <div className="absolute inset-0 bg-linear-to-t from-[#0f080a] to-transparent z-10" />
                                                    <img
                                                        src={plan.image.url}
                                                        alt={plan.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-6 md:p-8 flex flex-col flex-1 relative z-20 -mt-12">
                                                <h3 className={`text-2xl font-bold mb-2 ${isBest ? 'text-white' : 'text-white/90'}`}>
                                                    {plan.title}
                                                </h3>
                                                <div className="flex items-baseline gap-1 mb-6">
                                                    <span className={`text-4xl font-bold tracking-tighter ${isBest ? 'text-accent-crimson' : 'text-white'}`}>
                                                        ₮{plan.price.toLocaleString()}
                                                    </span>
                                                    <span className="text-white/40 text-sm">/ {plan.months} сар</span>
                                                </div>

                                                <div className="space-y-4 mb-8 flex-1">
                                                    <div className="h-px w-full bg-white/10" />
                                                    <ul className="space-y-3">
                                                        {benefits.map((benefit, idx) => (
                                                            <li key={idx} className="flex items-center gap-3 text-sm text-white/70">
                                                                <span className={`p-1 rounded-full bg-accent-crimson/20 text-accent-crimson`}>
                                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </span>
                                                                {benefit}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <Button
                                                    variant={isBest ? "primary" : "outline"}
                                                    size="lg"
                                                    className={`w-full font-bold tracking-wide transition-all duration-300 ${isBest ? 'shadow-[0_0_20px_rgba(230,30,56,0.4)] hover:shadow-[0_0_30px_rgba(230,30,56,0.6)]' : 'hover:bg-white/10 hover:text-white'}`}
                                                    onClick={() => handleChoosePlan(plan._id)}
                                                    disabled={!!loadingById[plan._id]}
                                                >
                                                    {loadingById[plan._id] ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Уншиж байна...
                                                        </span>
                                                    ) : "Сонгох"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Reassurance / Trust */}
                <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/5">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <span className="text-sm font-medium text-white">100% Аюулгүй, Нууцлалтай</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/5">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-sm font-medium text-white">Шууд хандах эрх</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
