'use client';

import React from 'react';
import { Heart, BookOpen, MessageCircle, Users, LogOut, Sparkles } from 'lucide-react';
import { NavItem } from './NavItem';
import Image from 'next/image';
import { useAuth } from '../providers/AuthProvider';
import useSWR from 'swr';
import { chatApi } from '@/apis';
import { useSocket } from '../providers/SocketProvider';
import { useRouter } from 'next/navigation';

interface Chat {
    _id: string;
    type: 'direct' | 'group';
    unread?: boolean;
}

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: 'discover' | 'stories' | 'chat' | 'groups' | 'profile' | 'ai-human') => void;
    onNavigateToProfile?: (id: string) => void;
}

export function Sidebar({ activeTab, setActiveTab, onNavigateToProfile }: SidebarProps) {
    const { logout, user } = useAuth();
    const { socket } = useSocket();
    const router = useRouter();

    const { data: chatsData, mutate: mutateChats } = useSWR(user ? 'chats' : null, () => chatApi.listChats());

    React.useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => mutateChats();
        socket.on('chat:message', handleUpdate);
        socket.on('notification:new', handleUpdate);
        return () => {
            socket.off('chat:message', handleUpdate);
            socket.off('notification:new', handleUpdate);
        };
    }, [socket, mutateChats]);

    const chats: Chat[] = chatsData?.data || chatsData || [];
    const directUnreadCount = Array.isArray(chats)
        ? chats.filter((c) => c.type === 'direct' && c.unread).length
        : 0;

    const groupUnreadCount = Array.isArray(chats)
        ? chats.filter((c) => c.type === 'group' && c.unread).length
        : 0;

    return (
        <aside className="hidden md:flex flex-col w-72 border-r border-zinc-800/50 bg-black/40 backdrop-blur-2xl relative z-30">
            {/* Logo only */}
            <div className="p-8 flex items-start justify-start">
                <div className="relative flex h-16 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(255,255,255,0.06)]">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain cursor-pointer"
                        priority
                        onClick={() => router.push("/")}
                    />
                </div>
            </div>

            <nav className="flex-1 px-6 py-8 space-y-1.5">
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4 ml-4">Үндсэн</div>

                <NavItem
                    icon={<Heart />}
                    label="Танилцах"
                    isActive={activeTab === 'discover'}
                    onClick={() => setActiveTab('discover')}
                />

                <NavItem
                    icon={<BookOpen />}
                    label="Түүхүүд"
                    isActive={activeTab === 'stories'}
                    onClick={() => setActiveTab('stories')}
                />

                <NavItem
                    icon={<Sparkles />}
                    label="AI Personas"
                    isActive={activeTab === 'ai-human'}
                    onClick={() => setActiveTab('ai-human')}
                />

                <div className="pt-6 mb-4">
                    <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-4 ml-4">Харилцаа</div>

                    <NavItem
                        icon={<MessageCircle />}
                        label="Чат"
                        isActive={activeTab === 'chat'}
                        onClick={() => setActiveTab('chat')}
                        badge={directUnreadCount > 0 ? directUnreadCount.toString() : undefined}
                    />

                    <NavItem
                        icon={<Users />}
                        label="Грүпп чат"
                        isActive={activeTab === 'groups'}
                        onClick={() => setActiveTab('groups')}
                        badge={groupUnreadCount > 0 ? groupUnreadCount.toString() : undefined}
                    />
                </div>
            </nav>

            <div className="p-6 space-y-4">
                <div
                    onClick={() => user?._id && onNavigateToProfile?.(user._id)}
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
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-zinc-500 hover:text-rose-500 hover:border-rose-500/30 transition-all text-xs font-bold uppercase tracking-widest group cursor-pointer"
                >
                    <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Гарах
                </button>
            </div>
        </aside>
    );
}