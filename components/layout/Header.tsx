'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { LogOut } from 'lucide-react';

interface HeaderProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    activeTabTitle: string;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen, activeTabTitle }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();

    const isSpecialPage = pathname === '/plans' || pathname.startsWith('/payment');

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            <header className="hidden md:flex h-20 items-center justify-between px-10 border-b border-zinc-900/50 bg-black/20 backdrop-blur-xl relative z-20">
                <div className="flex items-center gap-8">
                    {isSpecialPage && (
                        <div className="relative flex h-10 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_20px_rgba(255,255,255,0.05)] cursor-pointer" onClick={() => router.push('/discover')}>
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={60}
                                height={24}
                                className="object-contain"
                                priority
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <NotificationDropdown />

                    {isSpecialPage && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-500 hover:text-rose-500 hover:border-rose-500/30 transition-all font-bold text-[10px] uppercase tracking-widest"
                        >
                            <LogOut size={14} />
                            Гарах
                        </button>
                    )}
                </div>
            </header>

            <div className="md:hidden fixed top-0 left-0 right-0 h-20 border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl z-100 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_20px_rgba(255,255,255,0.05)]">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="object-contain"
                            priority
                            onClick={() => router.push('/discover')}
                        />
                    </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-white font-serif font-bold text-sm uppercase tracking-[0.2em] opacity-80">{activeTabTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                    <NotificationDropdown />
                    {isSpecialPage ? (
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                            <LogOut size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 cursor-pointer"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}