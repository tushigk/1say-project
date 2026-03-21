'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ImageIcon, Smile, Send, Users, Plus, MessageSquare, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import useSWR from 'swr';
import { chatApi } from '@/apis';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSocket } from '@/components/providers/SocketProvider';
import { toast } from 'react-hot-toast';
import { CreateGroupModal } from './CreateGroupModal';

interface Message {
    _id: string;
    body: string;
    sender: {
        _id: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;
}

interface Invite {
    _id: string;
    title?: string;
}

interface Chat {
    _id: string;
    type: 'direct' | 'group';
    title?: string;
    participants: Array<{
        _id: string;
        username: string;
        avatar?: string;
    }>;
    lastMessage?: {
        body: string;
        createdAt: string;
    };
    unread?: boolean;
}

interface GroupChatViewProps {
    onNavigateToProfile?: (id: string) => void;
    selectedChatId?: string | null;
    setSelectedChatId?: (id: string | null) => void;
}

export function GroupChatView({ onNavigateToProfile, selectedChatId, setSelectedChatId }: GroupChatViewProps) {
    const { user: currentUser } = useAuth();
    const { socket } = useSocket();
    const [messageBody, setMessageBody] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [isCreating, setIsCreating] = React.useState(false);

    const { data: chatsData, mutate: mutateChats } = useSWR('chats', () => chatApi.listChats());
    const { data: messagesData, mutate: mutateMessages } = useSWR(
        selectedChatId ? `chats/${selectedChatId}/messages` : null,
        () => chatApi.listChatMessages(selectedChatId!)
    );
    const { data: invitesData, mutate: mutateInvites } = useSWR('invites', () => chatApi.listChatInvites());

    // Socket updates for list and messages
    React.useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            mutateChats();
            mutateInvites();
        };

        const handleNewMessage = (msg: Message & { room: string }) => {
            if (msg.room === selectedChatId) {
                mutateMessages();
                chatApi.markChatRead(selectedChatId).then(() => mutateChats()).catch(console.error);
            } else {
                handleUpdate();
            }
        };

        socket.on('chat:message', handleNewMessage);
        socket.on('notification:new', handleUpdate);

        return () => {
            socket.off('chat:message', handleNewMessage);
            socket.off('notification:new', handleUpdate);
        };
    }, [socket, selectedChatId, mutateChats, mutateMessages, mutateInvites]);

    // Mark as read when selecting chat
    React.useEffect(() => {
        if (selectedChatId) {
            chatApi.markChatRead(selectedChatId).then(() => mutateChats()).catch(console.error);
        }
    }, [selectedChatId, mutateChats]);
    const chats: Chat[] = React.useMemo(() => {
        const rawChats = chatsData?.data || chatsData || [];
        return rawChats
            .filter((c: Chat) => c.type === 'group')
            .sort((a: Chat, b: Chat) => {
                const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
                const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
                return dateB - dateA;
            });
    }, [chatsData]);

    const activeChat = chats.find(c => c._id === selectedChatId);

    const messages: Message[] = [...(messagesData?.data || messagesData || [])].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, selectedChatId]);

    React.useEffect(() => {
        if (selectedChatId && !chats.find(c => c._id === selectedChatId)) {
            mutateChats();
        }
    }, [selectedChatId, chats, mutateChats]);

    React.useEffect(() => {
        if (selectedChatId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedChatId]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!selectedChatId || !messageBody.trim() || isSending) return;

        setIsSending(true);
        try {
            await chatApi.sendMessage(selectedChatId, messageBody);
            setMessageBody('');
            mutateMessages();
            mutateChats();
        } catch (error) {
            console.error("Send Message Error:", error);
            toast.error("Зурвас илгээхэд алдаа гарлаа");
        } finally {
            setIsSending(false);
        }
    };

    const handleCreateGroup = async (title: string) => {
        setIsCreating(true);
        try {
            const res = await chatApi.createGroupChat({ title, userIds: [] });
            const newChat = res.data || res;
            if (newChat?._id) {
                await mutateChats();
                setSelectedChatId?.(newChat._id);
                setIsCreateModalOpen(false);
                toast.success('Грүпп амжилттай үүсгэлээ');
            }
        } catch (error) {
            console.error("Create Group Error:", error);
            toast.error("Грүпп үүсгэхэд алдаа гарлаа");
        } finally {
            setIsCreating(false);
        }
    };

    const invites = invitesData?.data || invitesData || [];

    const handleInviteResponse = async (chatId: string, accept: boolean) => {
        try {
            await chatApi.respondToChatInvite(chatId, accept);
            toast.success(accept ? 'Урилга хүлээн авлаа' : 'Урилгаас татгалзлаа');
            mutateInvites();
            mutateChats();
        } catch (error) {
            console.error("Invite Response Error:", error);
            toast.error("Алдаа гарлаа");
        }
    };

    return (
        <div className="flex h-full bg-black/20 overflow-hidden relative">
            {/* Group List */}
            <div className={`${selectedChatId ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-zinc-900/50 flex flex-col bg-zinc-950/20 shrink-0`}>
                <div className="p-8 border-b border-zinc-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-serif font-bold text-white">Грүппүүд</h2>
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Таны нэгдсэн өрөө</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className=" cursor-pointer w-10 h-10 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-rose-500 flex items-center justify-center transition-colors border border-zinc-800/50"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="relative group/search">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/search:text-rose-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Хайх..."
                            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl py-3 pl-12 pr-4 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {invites.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Урилгууд ({invites.length})</span>
                            </div>
                            {invites?.map((invite: Invite) => (
                                <motion.div
                                    key={invite._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 rounded-3xl bg-rose-500/5 border border-rose-500/10 space-y-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-rose-500/20">
                                            <Image
                                                src={`https://ui-avatars.com/api/?name=${invite.title || 'Group'}&background=random&color=fff`}
                                                alt="Group"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-white truncate">{invite.title || 'Шинэ грүпп'}</h4>
                                            <p className="text-[10px] text-zinc-500 truncate">Таныг урилаа</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleInviteResponse(invite._id, true)}
                                            className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-colors"
                                        >
                                            Зөвшөөрөх
                                        </button>
                                        <button
                                            onClick={() => handleInviteResponse(invite._id, false)}
                                            className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-xl transition-colors border border-zinc-800"
                                        >
                                            Татгалзах
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-2 mb-1">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Миний Грүппүүд</span>
                        </div>
                        {chats.length > 0 ? (
                            chats?.map((chat) => (
                                <motion.div
                                    key={chat._id}
                                    onClick={() => setSelectedChatId?.(chat._id)}
                                    className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all ${chat._id === selectedChatId
                                        ? 'bg-rose-500/10 border border-rose-500/20'
                                        : chat.unread
                                            ? 'bg-rose-500/10 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/20'
                                            : 'hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800/50'
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden relative ring-2 ring-zinc-800/50">
                                            <Image
                                                src={`https://ui-avatars.com/api/?name=${chat.title || 'Group'}&background=random&color=fff`}
                                                alt={chat.title || 'Group'}
                                                fill
                                                className="object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-600 rounded-lg flex items-center justify-center border-2 border-zinc-950">
                                            <Users size={10} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-white truncate text-sm">{chat.title || 'Грүпп чат'}</h4>
                                            <span className="text-[10px] font-bold text-zinc-500">
                                                {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${chat.unread ? 'text-zinc-200 font-bold' : 'text-zinc-500'}`}>
                                            {chat.lastMessage ? (
                                                <span className="flex items-center gap-1.5">
                                                    {chat.unread && <span className="w-2 h-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                                                    <span className="truncate">{chat.lastMessage.body}</span>
                                                </span>
                                            ) : 'Чат эхлээгүй байна...'}
                                        </p>
                                    </div>
                                    {chat.unread && (
                                        <div className="shrink-0 flex items-center h-full">
                                            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse" />
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50">
                                    <Users size={24} className="text-zinc-700" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-400">Грүпп байхгүй</p>
                                    <p className="text-[10px] text-zinc-600 leading-relaxed uppercase tracking-widest">Та одоогоор ямар нэгэн грүппт нэгдээгүй байна.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedChatId ? (
                <div className="flex flex-1 flex-col relative bg-zinc-950 md:bg-transparent">
                    {!activeChat ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-4">
                            <button
                                onClick={() => setSelectedChatId?.(null)}
                                className="md:hidden absolute top-6 left-6 w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div className="h-20 border-b border-zinc-900/50 flex items-center justify-between px-6 md:px-8 bg-black/10 backdrop-blur-md shrink-0">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <button
                                        onClick={() => setSelectedChatId?.(null)}
                                        className="md:hidden w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 active:scale-95 transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden relative border-2 border-zinc-800">
                                        <Image
                                            src={`https://ui-avatars.com/api/?name=${activeChat.title || 'Group'}&background=random&color=fff`}
                                            alt={activeChat.title || 'Group'}
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white tracking-wide truncate max-w-[120px] md:max-w-none">{activeChat.title || 'Грүпп чат'}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="hidden sm:flex -space-x-2">
                                                {activeChat.participants?.slice(0, 3)?.map((p, i) => (
                                                    <div key={i} className="w-5 h-5 rounded-full border border-zinc-900 overflow-hidden relative">
                                                        <Image src={p.avatar || `https://ui-avatars.com/api/?name=${p.username || 'User'}&background=random`} alt="user" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                                                {activeChat.participants?.length || 0} гишүүн
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
                                {messages?.map((msg) => {
                                    const isMine = msg.sender._id === currentUser?._id;
                                    return (
                                        <div key={msg._id} className={`flex gap-4 max-w-[70%] ${isMine ? 'ml-auto flex-row-reverse' : ''}`}>
                                            {!isMine && (
                                                <div
                                                    className="w-8 h-8 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800 cursor-pointer hover:scale-110 transition-transform"
                                                    onClick={() => onNavigateToProfile?.(msg.sender._id)}
                                                >
                                                    <Image
                                                        src={msg.sender.avatar || `https://ui-avatars.com/api/?name=${msg.sender.username || 'User'}&background=random`}
                                                        alt={msg.sender.username}
                                                        fill
                                                        className="object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-1.5 flex flex-col">
                                                {!isMine && (
                                                    <span
                                                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-0.5 ml-1 cursor-pointer hover:text-rose-400"
                                                        onClick={() => onNavigateToProfile?.(msg.sender._id)}
                                                    >
                                                        {msg.sender.username}
                                                    </span>
                                                )}
                                                <div className={`${isMine ? 'bg-zinc-100 text-zinc-950 font-medium' : 'glass-card text-zinc-200 border border-zinc-800/40'} p-4 rounded-3xl ${isMine ? 'rounded-br-none' : 'rounded-bl-none'} text-sm leading-relaxed transition-all shadow-xl`}>
                                                    {msg.body}
                                                </div>
                                                <span className={`text-[9px] font-bold text-zinc-600 uppercase mt-1 ${isMine ? 'text-right mr-1' : 'ml-1'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 md:p-8 bg-transparent">
                                <div className="flex items-center gap-3 md:gap-4 bg-zinc-900/80 border border-zinc-800/50 rounded-3xl md:rounded-4xl px-4 md:px-6 py-3 backdrop-blur-xl shadow-2xl focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                                    <button type="button" className="text-zinc-500 hover:text-rose-500 transition-colors transform active:scale-90">
                                        <ImageIcon size={22} />
                                    </button>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        placeholder="Грүппт зурвас бичих..."
                                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-600 px-2 font-medium"
                                    />
                                    <button type="button" className="text-zinc-500 hover:text-rose-500 transition-colors transform active:scale-90">
                                        <Smile size={22} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!messageBody.trim() || isSending}
                                        className="w-12 h-12 bg-white disabled:opacity-20 disabled:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-950 hover:bg-zinc-200 transition-all ml-1 shadow-2xl transform active:scale-90"
                                    >
                                        {isSending ? (
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send size={18} className="ml-0.5" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-zinc-500 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800/30">
                        <MessageSquare size={32} className="opacity-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Ярилцлагаа эхлээрэй</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Сонирхолтой грүппээ сонгоно уу</p>
                    </div>
                </div>
            )}
            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateGroup}
                isLoading={isCreating}
            />
        </div>
    );
}
