"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../components/providers/AuthProvider";
import { authApi } from "../../../apis";
import AuthBanner from "../../../components/auth/AuthBanner";
import { Eye, EyeOff, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await authApi.login(formData);

            if (res.token) {
                login(res.token, res.user);
                router.push("/");
            } else {
                setError("Нэвтрэхэд алдаа гарлаа.");
            }
        } catch (err: unknown) {
            const errorResponse = err as { message?: string };
            setError(errorResponse.message || "Нууц үг эсвэл нэвтрэх нэр буруу байна.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
            {/* Main content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-4xl"
                >
                    {/* Card */}
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl grid md:grid-cols-2">
                        {/* Banner Side */}
                        <div className="relative block min-h-[240px] sm:min-h-[300px] md:h-auto md:min-h-[600px]">
                            <AuthBanner />
                        </div>

                        {/* Form Side */}
                        <div className="relative flex flex-col justify-center p-8 sm:p-10 md:p-12">
                            {/* subtle inner glow */}
                            <div className="pointer-events-none absolute inset-0 md:rounded-l-none rounded-[2.5rem] border border-white/5" />
                            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

                            {/* Logo */}
                            <div className="hidden md:flex mb-8 flex-col items-center text-center">
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
                                    Тавтай морил
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25, duration: 0.5 }}
                                    className="mt-2 text-sm leading-relaxed text-zinc-400"
                                >
                                    Өөрийн бүртгэлээр нэвтэрч үргэлжлүүлнэ үү.
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

                                <div className="space-y-4">
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
                                            className="h-14 rounded-2xl border-white/10 bg-white/5 text-center text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-0"
                                            autoComplete="username"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-zinc-300">
                                            Нууц үг
                                        </label>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Нууц үг"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, password: e.target.value })
                                                }
                                                className="h-14 rounded-2xl border-white/10 bg-white/5 text-center text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-0 pr-14"
                                                autoComplete="current-password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-transparent text-zinc-500 transition-all hover:border-white/10 hover:bg-white/5 hover:text-white"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        isLoading={isLoading}
                                        className="group relative h-14 w-full overflow-hidden rounded-2xl bg-white text-base font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-100 active:scale-[0.99]"
                                    >
                                        <span className="relative z-10 flex items-center justify-center">
                                            Нэвтрэх
                                            <ChevronRight
                                                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                                size={20}
                                            />
                                        </span>
                                    </Button>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 flex flex-col items-center gap-4 text-center">
                                <Link
                                    href="/register"
                                    className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                                >
                                    Бүртгэлгүй юу?
                                    <span className="ml-1 font-bold text-white">Шинээр нээх</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}