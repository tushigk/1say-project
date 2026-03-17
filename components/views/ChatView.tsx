'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, ImageIcon, Smile, Send, Phone, Video, MessageCircle, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

import useSWR from 'swr';
import { chatApi } from '@/apis';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSocket } from '@/components/providers/SocketProvider';
import { toast } from 'react-hot-toast';

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
    unreadCount?: number;
    counterpart?: {
        _id: string;
        username: string;
        avatar?: string;
    };
}

interface ChatViewProps {
    onNavigateToProfile?: (id: string) => void;
    selectedChatId?: string | null;
    setSelectedChatId?: (id: string | null) => void;
}

export function ChatView({ onNavigateToProfile, selectedChatId, setSelectedChatId }: ChatViewProps) {
    const { user: currentUser } = useAuth();
    const { socket } = useSocket();
    const [messageBody, setMessageBody] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const { data: chatsData, mutate: mutateChats } = useSWR('chats', () => chatApi.listChats());
    const { data: messagesData, mutate: mutateMessages } = useSWR(
        selectedChatId ? `chats/${selectedChatId}/messages` : null,
        () => chatApi.listChatMessages(selectedChatId!)
    );

    // Socket updates for list and messages
    React.useEffect(() => {
        if (!socket) return;

        const handleUpdate = () => {
            mutateChats();
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

        return () => {
            socket.off('chat:message', handleNewMessage);
        };
    }, [socket, selectedChatId, mutateChats, mutateMessages]);

    // Mark as read when selecting chat
    React.useEffect(() => {
        if (selectedChatId) {
            chatApi.markChatRead(selectedChatId).then(() => mutateChats()).catch(console.error);
        }
    }, [selectedChatId, mutateChats]);
    const chats: Chat[] = React.useMemo(() => {
        const rawChats = chatsData?.data || chatsData || [];
        return rawChats
            .filter((c: Chat) => c.type === 'direct')
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

    const getChatDisplay = (chat: Chat) => {
        if (chat.type === 'group') return { name: chat.title || 'Грүпп', avatar: undefined };
        const otherUser = chat.counterpart || chat.participants?.find(p => p._id !== currentUser?._id);
        return {
            name: otherUser?.username || 'Хэрэглэгч',
            avatar: otherUser?.avatar,
            userId: otherUser?._id
        };
    };
    return (
        <div className="flex h-full bg-black/20 overflow-hidden relative">
            {/* Chat List */}
            <div className={`${selectedChatId ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-zinc-900/50 flex flex-col bg-zinc-950/20 shrink-0`}>
                <div className="p-8 border-b border-zinc-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif font-bold text-white">Зурвасууд</h2>
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                            <Search size={18} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chats.map((chat) => {
                        const display = getChatDisplay(chat);
                        return (
                            <motion.div
                                key={chat._id}
                                onClick={() => setSelectedChatId?.(chat._id)}
                                className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all ${chat._id === selectedChatId
                                    ? 'bg-rose-500/10 border border-rose-500/20'
                                    : (chat.unreadCount || 0) > 0
                                        ? 'bg-zinc-900/40 border border-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.05)]'
                                        : 'hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800/50'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <div
                                        className="w-14 h-14 rounded-2xl overflow-hidden relative ring-2 ring-zinc-800/50 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (display.userId) onNavigateToProfile?.(display.userId);
                                        }}
                                    >
                                        <Image
                                            src={display.avatar || `https://picsum.photos/seed/${chat._id}/100/100`}
                                            alt={display.name}
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    {/* Mocking online status */}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-zinc-950 rounded-full shadow-lg"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-white truncate text-sm">{display.name}</h4>
                                        <span className="text-[10px] font-bold text-zinc-500">
                                            {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${(chat.unreadCount || 0) > 0 ? 'text-zinc-200 font-bold' : 'text-zinc-500'}`}>
                                        {chat.lastMessage?.body || 'Зурвас алга...'}
                                    </p>
                                </div>
                                {(chat.unreadCount || 0) > 0 && (
                                    <div className="shrink-0 flex flex-col items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                                        <div className="px-1.5 py-0.5 min-w-[18px] h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-300 border border-zinc-700/50">
                                            {chat.unreadCount}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
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
                                    <div
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden relative border-2 border-zinc-800 cursor-pointer"
                                        onClick={() => {
                                            const display = getChatDisplay(activeChat);
                                            if (display.userId) onNavigateToProfile?.(display.userId);
                                        }}
                                    >
                                        <Image
                                            src={getChatDisplay(activeChat).avatar || `https://picsum.photos/seed/${activeChat._id}/150/150`}
                                            alt={getChatDisplay(activeChat).name}
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white tracking-wide">{getChatDisplay(activeChat).name}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="w-10 h-10 rounded-xl bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors flex items-center justify-center">
                                        <Phone size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors flex items-center justify-center">
                                        <Video size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors flex items-center justify-center">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
                                {messages.map((msg) => {
                                    const isMine = msg.sender._id === currentUser?._id;
                                    return (
                                        <div key={msg._id} className={`flex gap-4 max-w-[70%] ${isMine ? 'ml-auto flex-row-reverse' : ''}`}>
                                            {!isMine && (
                                                <div className="w-8 h-8 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800">
                                                    <Image
                                                        src={msg.sender.avatar || `https://picsum.photos/seed/${msg.sender._id}/100/100`}
                                                        alt={msg.sender.username}
                                                        fill
                                                        className="object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-1.5">
                                                <div className={`${isMine ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/20' : 'glass-card text-zinc-200 border border-zinc-800/40'} p-4 rounded-3xl ${isMine ? 'rounded-br-none' : 'rounded-bl-none'} text-sm leading-relaxed transition-all`}>
                                                    {msg.body}
                                                </div>
                                                <span className={`text-[9px] font-bold text-zinc-600 uppercase block ${isMine ? 'text-right mr-1' : 'ml-1'}`}>
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
                                        placeholder="Шинэ зурвас бичих..."
                                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-600 px-2 font-medium"
                                    />
                                    <button type="button" className="text-zinc-500 hover:text-rose-500 transition-colors transform active:scale-90">
                                        <Smile size={22} />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!messageBody.trim() || isSending}
                                        className="w-12 h-12 bg-rose-600 disabled:opacity-50 disabled:bg-zinc-800 rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 transition-all ml-1 shadow-[0_8px_20px_rgba(225,29,72,0.3)] transform active:scale-90"
                                    >
                                        {isSending ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                    <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center">
                        <MessageCircle size={32} className="opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Зурвасаа сонгож харилцаарай</p>
                </div>
            )}
        </div>
    );
}
