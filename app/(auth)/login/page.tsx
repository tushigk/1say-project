"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../components/providers/AuthProvider";
import { authApi } from "../../../apis";
import AuthBanner from "../../../components/auth/AuthBanner";
import { Eye, EyeOff, Lock, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <AuthBanner />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[460px] glass rounded-[3rem] p-10 md:p-14 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col items-center"
            >
                {/* Logo Decor */}
                <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center font-black text-3xl mb-8 rotate-3 shadow-2xl">
                    N
                </div>
                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-2xl bg-accent-crimson/10 border border-accent-crimson/20 text-accent-crimson text-xs font-bold text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <Input
                            placeholder="Хэрэглэгчийн нэр"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="bg-white/5 border-white/10 focus:border-white/30 text-center"
                            autoComplete="username"
                            required
                        />

                        <div className="relative group">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Нууц үг"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-white/5 border-white/10 focus:border-white/30 text-center"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full py-5 text-lg group bg-white text-black hover:bg-zinc-200 transition-all rounded-2xl cursor-pointer"
                    >
                        Нэвтрэх
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>
                </form>

                <div className="mt-10 flex flex-col items-center gap-6">
                    <Link href="/register" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                        Бүртгэлгүй юу? <span className="text-white font-bold ml-1">Шинээр нээх</span>
                    </Link>
                </div>
            </motion.div>

            {/* Floating Elements Decor */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent-crimson rounded-full animate-ping opacity-20" />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-20" />
        </div>
    );
}
