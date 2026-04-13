'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, BookOpen, MessageCircle, Users, LogOut, Sparkles } from 'lucide-react';
import { NavItem } from '@/components/layout/NavItem';
import { useSearchParams } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname.startsWith('/discover')) return 'Танилцах';
    if (pathname.startsWith('/stories')) return 'Түүхүүд';
    if (pathname.startsWith('/chat')) return 'Зурвасууд';
    if (pathname.startsWith('/groups')) return 'Грүпп чат';
    if (pathname.startsWith('/profile')) return 'Профайл';
    if (pathname.startsWith('/ai-human')) return 'AI Personas';
    if (pathname === '/plans') return 'Гишүүнчлэл';
    if (pathname.startsWith('/payment')) return 'Төлбөр төлөх';
    return 'Noir';
  };

  const searchParams = useSearchParams();
  const isChattingWithAI = pathname.startsWith('/ai-human') && searchParams.get('personaId');
  const isSpecialPage = pathname === '/plans' || pathname.startsWith('/payment');
  const showSidebar = !isSpecialPage && !isChattingWithAI;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 overflow-hidden noise-bg font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-900/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      {showSidebar && <Sidebar />}

      <AnimatePresence>
        {(showSidebar || isChattingWithAI) && isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-110"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-[280px] bg-zinc-950 border-r border-zinc-900 z-[1000] p-6 flex flex-col"
            >
              <div className="flex items-center justify-center mb-10 mt-4">
                <div className="relative flex h-14 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(255,255,255,0.06)]">
                  <Image
                    src="/logo.png"
                    fill
                    alt="Logo"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <nav className="space-y-1">
                <NavItem icon={<Heart />} label="Танилцах" isActive={pathname === '/discover'} onClick={() => { router.push('/discover'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<BookOpen />} label="Түүхүүд" isActive={pathname === '/stories'} onClick={() => { router.push('/stories'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Sparkles />} label="AI Personas" isActive={pathname.startsWith('/ai-human')} onClick={() => { router.push('/ai-human'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<MessageCircle />} label="Зурвасууд" isActive={pathname.startsWith('/chat')} onClick={() => { router.push('/chat'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Users />} label="Грүпп чат" isActive={pathname.startsWith('/groups')} onClick={() => { router.push('/groups'); setIsMobileMenuOpen(false); }} />
              </nav>

              <div className="mt-auto p-6 space-y-4">
                <div
                  onClick={() => {
                    if (user?._id) {
                      router.push(`/profile/${user._id}`);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="rounded-3xl p-1.5 bg-zinc-900/50 border border-zinc-800/50 hover:border-rose-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-800/50 transition-colors">
                    <div className="w-11 h-11 shrink-0 rounded-2xl overflow-hidden relative ring-2 ring-zinc-800 group-hover:ring-rose-500/50 transition-all">
                      <Image
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                        alt="Profile"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user?.username || 'Хэрэглэгч'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-500 hover:text-rose-500 hover:border-rose-500/30 transition-all text-xs font-bold uppercase tracking-widest group cursor-pointer"
                >
                  <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Гарах
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative flex flex-col z-10 pt-20 md:pt-0">
        {/* On desktop, hide header if chatting with AI. On mobile, always show header. */}
        <div className={isChattingWithAI ? 'md:hidden' : ''}>
          <Header
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            activeTabTitle={getPageTitle()}
          />
        </div>

        <div className={`flex-1 flex flex-col h-full ${(['/chat', '/groups', '/ai-human'].some(p => pathname.startsWith(p))) ? 'overflow-hidden' : 'overflow-y-auto scroll-smooth'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 flex flex-col h-full min-h-0 relative">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
