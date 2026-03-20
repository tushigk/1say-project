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
import { Sparkles, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden py-16">
            <AuthBanner />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[520px] glass rounded-[3rem] p-8 md:p-12 border-white/10 shadow-2xl flex flex-col items-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center font-black text-3xl mb-8 rotate-3 shadow-2xl">
                    N
                </div>

                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 rounded-xl bg-accent-crimson/10 border border-accent-crimson/20 text-accent-crimson text-xs font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <Input
                        placeholder="Хэрэглэгчийн нэр"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="bg-white/5 border-white/10 focus:border-white/30"
                        required
                    />

                    <div className="flex gap-3">
                        {['male', 'female']?.map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: g })}
                                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border ${formData.gender === g
                                    ? "bg-white text-black border-white shadow-lg"
                                    : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"
                                    }`}
                            >
                                {g === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="password"
                            placeholder="Нууц үг"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-white/5 border-white/10 focus:border-white/30 text-sm"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Давтах"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="bg-white/5 border-white/10 focus:border-white/30 text-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent-crimson focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px] text-zinc-500 font-medium">
                            Би 18 нас хүрсэн бөгөөд <button type="button" onClick={() => setIsTosOpen(true)} className="text-white hover:underline transition-all font-bold">Нөхцөлийг</button> зөвшөөрч байна.
                        </span>
                    </div>

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full py-5 text-lg group bg-white text-black hover:bg-zinc-200 transition-all rounded-2xl cursor-pointer"
                    >
                        Бүртгүүлэх
                        <UserPlus className="ml-2 group-hover:scale-110 transition-transform" size={20} />
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        Бүртгэлтэй юу? <span className="text-white ml-2">Нэвтрэх</span>
                    </Link>
                </div>
            </motion.div>

            <TermOfServiceModal isOpen={isTosOpen} onClose={() => setIsTosOpen(false)} />
        </div>
    );
}
