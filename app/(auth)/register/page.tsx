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
import { Sparkles, UserPlus, Check } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

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
                router.push("/");
            }
        } catch (err: unknown) {
            const errorResponse = err as { message?: string };
            setError(errorResponse.message || "Бүртгэлд алдаа гарлаа.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
            <AuthBanner />

            {/* Background overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.10),transparent_35%)]" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Decorative glow */}
            <div className="absolute top-16 left-10 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute bottom-16 right-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full bg-red-400/10 blur-2xl" />

            {/* Tiny particles */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-20" />
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-20" />
            <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-20" />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[560px]"
                >
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-10 md:p-12">
                        {/* inner border */}
                        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-white/5" />
                        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

                        {/* Header */}
                        <div className="mb-8 flex flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="relative mb-5"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
                                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(255,255,255,0.06)] backdrop-blur-xl">
                                    <Image
                                        src="/logo.png"
                                        alt="Noir Logo"
                                        width={68}
                                        height={68}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300"
                            >
                                <Sparkles size={14} className="text-red-400" />
                                Шөнийн таалал!
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl"
                            >
                                Шинэ бүртгэл
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.5 }}
                                className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400"
                            >
                                Noir-д нэгдэж өөрийн хувийн орон зайг нээгээрэй.
                            </motion.p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-300"
                                >
                                    {error}
                                </motion.div>
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
                                    className="h-14 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-0"
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
                                                className={`group relative h-14 rounded-2xl border text-sm font-semibold transition-all duration-300 ${active
                                                    ? "border-white bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
                                                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
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
                                        className="h-14 rounded-2xl border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-0"
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
                                        className="h-14 rounded-2xl border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
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
                                        <div className="flex h-5 w-5 items-center justify-center rounded-md border border-white/15 bg-white/5 transition-all peer-checked:border-white peer-checked:bg-white">
                                            {formData.agreeToTerms && (
                                                <Check size={13} className="text-black" />
                                            )}
                                        </div>
                                    </div>

                                    <span className="text-xs leading-relaxed text-zinc-400">
                                        Би <span className="font-semibold text-white">18 нас хүрсэн</span>{" "}
                                        бөгөөд{" "}
                                        <button
                                            type="button"
                                            onClick={() => setIsTosOpen(true)}
                                            className="font-semibold text-white underline underline-offset-4 transition-opacity hover:opacity-80"
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
                                    className="group relative h-14 w-full overflow-hidden rounded-2xl bg-white text-base font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-100 active:scale-[0.99]"
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
                </motion.div>
            </div>

            <TermOfServiceModal isOpen={isTosOpen} onClose={() => setIsTosOpen(false)} />
        </div>
    );
}