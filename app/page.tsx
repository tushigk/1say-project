'use client';

import React, { useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DiscoverView } from '@/components/views/DiscoverView';
import { StoriesView } from '@/components/views/StoriesView';
import { ChatView } from '@/components/views/ChatView';
import { GroupChatView } from '@/components/views/GroupChatView';
import { ProfileView } from '@/components/views/ProfileView';
import { Heart, BookOpen, MessageCircle, Users, LogOut } from 'lucide-react';
import { NavItem } from '@/components/layout/NavItem';
import { useAuth } from '@/components/providers/AuthProvider';
import Image from 'next/image';

type Tab = 'discover' | 'stories' | 'chat' | 'groups' | 'profile';

function AppContent() {
  const { logout, user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab && ['discover', 'stories', 'chat', 'groups', 'profile'].includes(tab)) {
      return tab as Tab;
    }
    return 'discover';
  }, [searchParams]);

  const selectedChatId = searchParams.get('chatId');
  const viewingUserId = searchParams.get('userId');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToProfile = (userId: string) => {
    router.push(`/?tab=profile&userId=${userId}`);
  };

  const navigateToChat = (chatId: string, type: 'direct' | 'group' = 'direct') => {
    router.push(`/?tab=${type === 'group' ? 'groups' : 'chat'}&chatId=${chatId}`);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'discover': return 'Танилцах';
      case 'stories': return 'Түүхүүд';
      case 'chat': return 'Зурвасууд';
      case 'groups': return 'Грүпп чат';
      case 'profile': return 'Профайл';
      default: return 'Noir';
    }
  };

  const renderContent = () => {
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="h-full"
      >
        {activeTab === 'discover' && (
          <DiscoverView
            onNavigateToProfile={navigateToProfile}
            onNavigateToChat={navigateToChat}
          />
        )}
        {activeTab === 'stories' && <StoriesView onNavigateToProfile={navigateToProfile} />}
        {activeTab === 'chat' && (
          <ChatView
            onNavigateToProfile={navigateToProfile}
            selectedChatId={selectedChatId}
            setSelectedChatId={(id) => router.push(`/?tab=chat${id ? `&chatId=${id}` : ''}`)}
          />
        )}
        {activeTab === 'groups' && (
          <GroupChatView
            onNavigateToProfile={navigateToProfile}
            selectedChatId={selectedChatId}
            setSelectedChatId={(id) => router.push(`/?tab=groups${id ? `&chatId=${id}` : ''}`)}
          />
        )}
        {activeTab === 'profile' && viewingUserId && (
          <ProfileView
            userId={viewingUserId}
            onBack={() => {
              router.push('/?tab=discover');
            }}
            onNavigateToChat={navigateToChat}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 overflow-hidden noise-bg font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-900/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => router.push(`/?tab=${tab}`)}
        onNavigateToProfile={navigateToProfile}
      />

      <AnimatePresence>
        {isMobileMenuOpen && (
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
              className="md:hidden fixed inset-y-0 left-0 w-[280px] bg-zinc-950 border-r border-zinc-900 z-120 p-6 flex flex-col"
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
                <NavItem icon={<Heart />} label="Танилцах" isActive={activeTab === 'discover'} onClick={() => { router.push('/?tab=discover'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<BookOpen />} label="Түүхүүд" isActive={activeTab === 'stories'} onClick={() => { router.push('/?tab=stories'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<MessageCircle />} label="Чат" isActive={activeTab === 'chat'} onClick={() => { router.push('/?tab=chat'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<Users />} label="Грүпп чат" isActive={activeTab === 'groups'} onClick={() => { router.push('/?tab=groups'); setIsMobileMenuOpen(false); }} />
              </nav>

              <div className="mt-auto p-6 space-y-4">
                <div
                  onClick={() => {
                    if (user?._id) {
                      navigateToProfile(user._id);
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

      <main className="flex-1 relative flex flex-col z-10 pt-16 md:pt-0">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTabTitle={getTabTitle()}
        />

        <div className={`flex-1 ${(['chat', 'groups'].includes(activeTab)) ? 'overflow-hidden' : 'overflow-y-auto scroll-smooth'}`}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function AppInterface() {
  return (
    <Suspense fallback={<div className="h-screen bg-zinc-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <AppContent />
    </Suspense>
  );
}
