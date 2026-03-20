'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    activeTabTitle: string;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen, activeTabTitle }: HeaderProps) {
    const router = useRouter();
    return (
        <>
            <header className="hidden md:flex h-20 items-center justify-end px-10 border-b border-zinc-900/50 bg-black/20 backdrop-blur-xl relative z-20">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Хайх..."
                            className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 w-64 transition-all"
                        />
                    </div>

                    <NotificationDropdown />
                </div>
            </header>

            <div className="md:hidden fixed top-0 left-0 right-0 h-20 border-b border-zinc-800/50 bg-black/60 backdrop-blur-xl z-100 flex items-center justify-between px-6">
                <div className="flex items-center">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_20px_rgba(255,255,255,0.05)]">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="object-contain"
                            priority
                            onClick={() => router.push('/')}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <NotificationDropdown />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 cursor-pointer"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </>
    );
}