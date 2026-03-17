'use client';

import React, { useState } from 'react';
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

type Tab = 'discover' | 'stories' | 'chat' | 'groups' | 'profile';

export default function AppInterface() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [prevTab, setPrevTab] = useState<Tab>('discover');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToProfile = (userId: string) => {
    setPrevTab(activeTab);
    setViewingUserId(userId);
    setActiveTab('profile');
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
        {activeTab === 'discover' && <DiscoverView onNavigateToProfile={navigateToProfile} />}
        {activeTab === 'stories' && <StoriesView onNavigateToProfile={navigateToProfile} />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'groups' && <GroupChatView />}
        {activeTab === 'profile' && viewingUserId && (
          <ProfileView 
            userId={viewingUserId} 
            onBack={() => {
              setActiveTab(prevTab === 'profile' ? 'discover' : prevTab);
              setViewingUserId(null);
            }} 
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 overflow-hidden noise-bg font-sans">
      {/* Decorative Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-900/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-900/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mobile Sidebar Overlay */}
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
              <div className="flex items-center gap-3 mb-10 mt-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 to-purple-600 flex items-center justify-center font-bold text-white">N</div>
                <span className="font-serif text-2xl font-bold text-white tracking-tighter">Noir</span>
              </div>

              <nav className="space-y-1">
                <NavItem icon={<Heart />} label="Танилцах" isActive={activeTab === 'discover'} onClick={() => { setActiveTab('discover'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<BookOpen />} label="Түүхүүд" isActive={activeTab === 'stories'} onClick={() => { setActiveTab('stories'); setIsMobileMenuOpen(false); }} />
                <NavItem icon={<MessageCircle />} label="Чат" isActive={activeTab === 'chat'} onClick={() => { setActiveTab('chat'); setIsMobileMenuOpen(false); }} badge="3" />
                <NavItem icon={<Users />} label="Грүпп чат" isActive={activeTab === 'groups'} onClick={() => { setActiveTab('groups'); setIsMobileMenuOpen(false); }} />
              </nav>

              <div className="mt-auto pb-10">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all outline-none"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest">Гарах</span>
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

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
