"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../components/providers/AuthProvider";
import { authApi } from "../../../apis";
import AuthBanner from "../../../components/auth/AuthBanner";
import TermOfServiceModal from "../../../components/auth/TermOfServiceModal";
import { UserPlus, Check } from "lucide-react";

export default function RegisterPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [isTosOpen, setIsTosOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        gender: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Нууц үг зөрүүтэй байна.");
            return;
        }

        if (!formData.agreeToTerms) {
            setError("Үйлчилгээний нөхцөлийг зөвшөөрнө үү.");
            return;
        }

        if (!formData.gender) {
            setError("Хүйсээ сонгоно уу.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await authApi.register({
                username: formData.username,
                gender: formData.gender,
                password: formData.password,
            });

            if (res.token) {
                login(res.token);
                router.push("/discover");
            }
        } catch (err: unknown) {
            const errorResponse = err as { message?: string };
            setError(errorResponse.message || "Бүртгэлд алдаа гарлаа.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#030001] text-white">
            {/* Cinematic Noise Overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* Deep red ambient glows */}
            <div className="pointer-events-none absolute -left-[20%] top-[-10%] h-[700px] w-[700px] rounded-full bg-red-950/20 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="pointer-events-none absolute -right-[20%] bottom-[-10%] h-[700px] w-[700px] rounded-full bg-rose-950/20 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a0002]/40 blur-[180px]" />
            {/* Main content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-5xl">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-red-500/20 bg-[#050002]/70 shadow-[0_45px_120px_rgba(0,0,0,1)] backdrop-blur-3xl grid md:grid-cols-2">
                        {/* Inner stroke for ultra premium look */}
                        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border-[0.5px] border-white/5 mix-blend-overlay" />

                        {/* Banner Side */}
                        <div className="relative block min-h-[240px] sm:min-h-[300px] md:h-auto md:min-h-[600px]">
                            <AuthBanner />
                        </div>

                        {/* Form Side */}
                        <div className="relative flex flex-col justify-center p-8 sm:p-10 md:p-12">
                            {/* inner border */}
                            <div className="pointer-events-none absolute inset-0 md:rounded-l-none rounded-[2.5rem] border-l border-white/5" />
                            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

                            {/* Header */}
                            <div className="hidden md:flex mb-8 flex-col items-center text-center">
                                <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    Хүслээ Нээх
                                </h1>

                                <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500 font-light tracking-wide">
                                    Бидэнтэй нэгдэж, нууцлаг бөгөөд халуухан ертөнцөд өөрийн орон зайг бүтээгээрэй.
                                </p>
                            </div>

                            {/* Form */}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-300">
                                        {error}
                                    </div>
                                )}

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-zinc-300">
                                        Хэрэглэгчийн нэр
                                    </label>
                                    <Input
                                        placeholder="Хэрэглэгчийн нэр"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                        className="h-14 rounded-2xl border-white/5 bg-white/2 text-white placeholder:text-zinc-700 transition-all duration-300 focus:border-red-600/50 focus:bg-white/4 focus:shadow-[0_0_20px_rgba(229,9,20,0.1)] focus:ring-0"
                                        required
                                    />
                                </div>

                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-zinc-300">
                                        Хүйс
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["male", "female"].map((g) => {
                                            const active = formData.gender === g;
                                            return (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: g })}
                                                    className={`group relative h-14 rounded-2xl border text-sm font-semibold transition-all duration-500 ${active
                                                        ? "border-red-600/40 bg-red-950/40 text-red-50 shadow-[0_0_25px_rgba(229,9,20,0.15)]"
                                                        : "border-white/5 bg-white/2 text-zinc-600 hover:border-red-900/30 hover:text-zinc-400 hover:bg-white/4"
                                                        }`}
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        {active && <Check size={16} />}
                                                        {g === "male" ? "Эрэгтэй" : "Эмэгтэй"}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Passwords */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-zinc-300">
                                            Нууц үг
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Нууц үг"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                            className="h-14 rounded-2xl border-white/5 bg-white/2 text-sm text-white placeholder:text-zinc-700 transition-all duration-300 focus:border-red-600/50 focus:bg-white/4 focus:shadow-[0_0_20px_rgba(229,9,20,0.1)] focus:ring-0"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-zinc-300">
                                            Давтах
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Давтах"
                                            value={formData.confirmPassword}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            className="h-14 rounded-2xl border-white/5 bg-white/2 text-sm text-white placeholder:text-zinc-700 transition-all duration-300 focus:border-red-600/50 focus:bg-white/4 focus:shadow-[0_0_20px_rgba(229,9,20,0.1)] focus:ring-0"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="rounded-2xl border border-white/5 bg-white/2 p-4">
                                    <label className="flex cursor-pointer items-start gap-3">
                                        <div className="relative mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreeToTerms}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        agreeToTerms: e.target.checked,
                                                    })
                                                }
                                                className="peer sr-only"
                                            />
                                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-white/10 bg-black/40 transition-all peer-checked:border-red-500 peer-checked:bg-red-950/50 peer-checked:shadow-[0_0_10px_rgba(229,9,20,0.3)]">
                                                {formData.agreeToTerms && (
                                                    <Check size={13} className="text-red-400" />
                                                )}
                                            </div>
                                        </div>

                                        <span className="text-xs leading-relaxed text-zinc-400">
                                            Би <span className="font-semibold text-white">18 нас хүрсэн</span>{" "}
                                            бөгөөд{" "}
                                            <button
                                                type="button"
                                                onClick={() => setIsTosOpen(true)}
                                                className="font-semibold text-red-400 underline underline-offset-4 transition-opacity hover:opacity-80"
                                            >
                                                Үйлчилгээний нөхцөл
                                            </button>
                                            -ийг зөвшөөрч байна.
                                        </span>
                                    </label>
                                </div>

                                {/* Submit */}
                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        isLoading={isLoading}
                                        className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl border border-red-500/40 bg-linear-to-r from-red-950 via-[#700000] to-red-950 bg-size-[200%_auto] text-base font-semibold text-white shadow-[0_0_30px_rgba(229,9,20,0.3)] transition-all duration-700 hover:bg-position-[100%_auto] hover:shadow-[0_0_60px_rgba(229,9,20,0.5)] hover:border-red-500/60 active:scale-[0.98]"
                                    >
                                        <span className="relative z-10 flex items-center justify-center">
                                            Бүртгүүлэх
                                            <UserPlus
                                                className="ml-2 transition-transform duration-300 group-hover:scale-110"
                                                size={20}
                                            />
                                        </span>
                                    </Button>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                                >
                                    Бүртгэлтэй юу?
                                    <span className="ml-1 font-bold text-white">Нэвтрэх</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TermOfServiceModal isOpen={isTosOpen} onClose={() => setIsTosOpen(false)} />
        </div>
    );
}