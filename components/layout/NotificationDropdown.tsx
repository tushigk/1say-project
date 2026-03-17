'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Bell, Check, X, Loader2, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { chatApi } from '@/apis';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/components/providers/SocketProvider';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface Invite {
    _id: string;
    room: {
        _id: string;
        title: string;
        type: string;
    };
    invitedBy: {
        username: string;
        name: string;
        avatar?: string;
    };
    createdAt: string;
}

interface Message {
    body: string;
    sender: string;
    createdAt: string;
}

interface Chat {
    _id: string;
    type: 'direct' | 'group';
    title?: string;
    memberCount: number;
    unreadCount?: number;
    lastMessage?: Message;
    counterpart?: {
        _id: string;
        username?: string;
        name?: string;
        avatar?: string;
    };
}

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const { socket } = useSocket();

    const { data: invitesData, mutate: mutateInvites, isLoading: isInvitesLoading } = useSWR('invites', () => chatApi.listChatInvites());
    const { data: chatsData, mutate: mutateChats, isLoading: isChatsLoading } = useSWR('chats', () => chatApi.listChats());

    const invites: Invite[] = useMemo(() => invitesData?.data || invitesData || [], [invitesData]);
    const chats: Chat[] = useMemo(() => chatsData?.data || chatsData || [], [chatsData]);
    
    const unreadChats = useMemo(() => chats.filter((c) => (c.unreadCount || 0) > 0), [chats]);
    const totalUnreadCount = unreadChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    const badgeCount = totalUnreadCount + invites.length;

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            mutateInvites();
            mutateChats();
        };

        const onChatMessage = (msg: { room: string }) => {
            if (params?.id && msg.room === params.id) return;
            mutateChats();
        };

        socket.on('notification:new', handleUpdate);
        socket.on('chat:message', onChatMessage);

        return () => {
            socket.off('notification:new', handleUpdate);
            socket.off('chat:message', onChatMessage);
        };
    }, [socket, mutateInvites, mutateChats, params?.id]);

    const handleRespondInvite = async (chatId: string, accept: boolean) => {
        try {
            await chatApi.respondToChatInvite(chatId, accept);
            toast.success(accept ? 'Урилга зөвшөөрлөө' : 'Урилгаас татгалзлаа');
            mutateInvites();
            mutateChats();
            if (accept) {
                router.push(`/?tab=groups&chatId=${chatId}`);
                setIsOpen(false);
            }
        } catch (err) {
            console.error('Respond invite error:', err);
            toast.error('Алдаа гарлаа');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 border cursor-pointer ${
                    isOpen 
                    ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800/50'
                }`}
            >
                <Bell size={20} className={badgeCount > 0 ? 'animate-wiggle' : ''} />
                {badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-lg border-2 border-zinc-950 px-1 shadow-lg">
                        {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:top-full md:mt-4 md:w-96 bg-zinc-950 border border-zinc-800/50 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-200 backdrop-blur-3xl"
                        >
                            <div className="p-6 border-b border-zinc-900/50 flex items-center justify-between bg-zinc-900/20">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Мэдэгдэл</h3>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Таны сүүлийн үеийн идэвх</p>
                                </div>
                                {(isInvitesLoading || isChatsLoading) && (
                                    <Loader2 className="size-4 animate-spin text-rose-500" />
                                )}
                            </div>

                            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                                {badgeCount === 0 ? (
                                    <div className="py-20 px-10 text-center flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50">
                                            <Inbox className="size-8 text-zinc-700" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Мэдэгдэл алга</p>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Танд одоогоор шинэ мэдэгдэл ирээгүй байна.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-4">
                                        {/* Invites Section */}
                                        {invites.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 px-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Шинэ урилгууд</span>
                                                </div>
                                                {invites.map((invite) => (
                                                    <div key={invite._id} className="p-4 rounded-3xl bg-rose-500/5 border border-rose-500/10 space-y-4 group hover:bg-rose-500/10 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl overflow-hidden relative border border-rose-500/20 shadow-lg ring-2 ring-rose-500/10">
                                                                <Image 
                                                                    src={invite.invitedBy.avatar || `https://picsum.photos/seed/${invite.invitedBy.username}/100/100`} 
                                                                    alt="Inviter" 
                                                                    fill 
                                                                    className="object-cover" 
                                                                />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs font-bold text-white truncate uppercase tracking-tight">
                                                                    {invite.room.title || 'Нууц өрөө'}
                                                                </p>
                                                                <p className="text-[10px] text-zinc-500 font-medium leading-none mt-1.5 flex items-center gap-1.5">
                                                                    <span className="text-rose-500 font-black">@{invite.invitedBy.username}</span>
                                                                    <span>таныг урьсан</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleRespondInvite(invite.room._id, true)}
                                                                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-all text-[9px] font-black uppercase tracking-[0.2em] border border-rose-400/20 flex items-center justify-center gap-2 cursor-pointer"
                                                            >
                                                                <Check size={14} />
                                                                Зөвшөөрөх
                                                            </button>
                                                            <button
                                                                onClick={() => handleRespondInvite(invite.room._id, false)}
                                                                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.2em] border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
                                                            >
                                                                <X size={14} />
                                                                Татгалзах
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Unread Chats Section */}
                                        {unreadChats.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 px-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Уншаагүй зурвасууд</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {unreadChats.slice(0, 5).map((chat) => {
                                                        const title = chat.title || chat.counterpart?.username || 'Нууц хэрэглэгч';
                                                        const avatar = chat.counterpart?.avatar || `https://picsum.photos/seed/${chat._id}/100/100`;

                                                        return (
                                                            <button
                                                                key={chat._id}
                                                                onClick={() => {
                                                                    router.push(`/?tab=${chat.type === 'group' ? 'groups' : 'chat'}&chatId=${chat._id}`);
                                                                    setIsOpen(false);
                                                                }}
                                                                className="w-full text-left p-3 rounded-3xl bg-zinc-900/30 border border-zinc-900/50 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all group cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-zinc-800/50">
                                                                        <Image src={avatar} alt="Avatar" fill className="object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <p className="text-xs font-bold text-white group-hover:text-rose-500 transition-colors uppercase tracking-tight truncate">{title}</p>
                                                                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                                                                        </div>
                                                                        <p className="text-[10px] text-zinc-500 truncate mt-1">
                                                                            {chat.lastMessage?.body || 'Шинэ зурвас ирсэн байна...'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {badgeCount > 0 && (
                                <div className="p-4 bg-zinc-900/20 border-t border-zinc-900/50">
                                    <button 
                                        onClick={() => {
                                            router.push('/?tab=chat');
                                            setIsOpen(false);
                                        }}
                                        className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-zinc-800/50 cursor-pointer"
                                    >
                                        Бүх чатыг үзэх
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
