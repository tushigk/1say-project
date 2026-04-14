'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, ChevronLeft, MoreVertical, Sparkles, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { aiHumanApi } from '@/apis';
import { AIHuman, AIHumanMessage, AIHumanConversation } from '@/apis/aiHuman';
import { useSocket } from '@/components/providers/SocketProvider';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/components/providers/AuthProvider';
import Loading from '@/components/ui/Loading';
import { AIHumanListView } from './AIHumanListView';

interface AIHumanChatViewProps {
    personaId?: string;
    onBack?: () => void;
    activeTab?: 'discover' | 'history';
}

export function AIHumanChatView({ personaId: propPersonaId, onBack, activeTab = 'history' }: AIHumanChatViewProps) {
    const { user: currentUser } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { socket } = useSocket();
    const personaId = propPersonaId || searchParams.get('personaId') as string;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.set('tab', 'discover');
            params.delete('personaId');
            router.push(`/ai-human?${params.toString()}`);
        }
    };

    const setTab = (tab: 'discover' | 'history') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        if (tab === 'discover') {
            params.delete('personaId');
        }
        router.push(`/ai-human?${params.toString()}`);
    };

    const [messageBody, setMessageBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isPersonaTyping, setIsPersonaTyping] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading'>('idle');
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: personaData } = useSWR(personaId ? `ai-humans/${personaId}` : null, () => aiHumanApi.getAIHumanDetail(personaId));
    const { data: historyData, mutate: mutateHistory } = useSWR(personaId ? `ai-humans/${personaId}/history` : null, () => aiHumanApi.getAIHumanHistory(personaId));

    const historyPersona = (historyData as any)?.persona as AIHuman | undefined;
    const persona: AIHuman | null = historyPersona || (Array.isArray(personaData?.data) ? personaData.data[0] : (personaData?.data || null));
    const messages: AIHumanMessage[] = historyData?.data || [];

    const canChat = personaData?.canChat !== false;
    const membershipRequired = personaData?.membershipRequired;

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        scrollToBottom('auto');
    }, [personaId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isPersonaTyping]);

    useEffect(() => {
        if (!socket) return;

        const handleStatus = (data: { personaId: string, status: 'loading' | 'idle' }) => {
            if (data.personaId === personaId) {
                setStatus(data.status);
            }
        };

        const handleTyping = (data: { personaId: string, isTyping: boolean }) => {
            if (data.personaId === personaId) {
                setIsPersonaTyping(data.isTyping);
            }
        };

        const handleMessage = (msg: AIHumanMessage) => {
            if (msg.persona === personaId) {
                mutateHistory();
            }
        };

        const handleError = (data: { personaId: string, message: string }) => {
            if (data.personaId === personaId) {
                toast.error(data.message);
                setStatus('idle');
                setIsPersonaTyping(false);
            }
        };

        socket.on('ai-human:status', handleStatus);
        socket.on('ai-human:typing', handleTyping);
        socket.on('ai-human:message', handleMessage);
        socket.on('ai-human:error', handleError);

        return () => {
            socket.off('ai-human:status', handleStatus);
            socket.off('ai-human:typing', handleTyping);
            socket.off('ai-human:message', handleMessage);
            socket.off('ai-human:error', handleError);
        };
    }, [socket, personaId, mutateHistory]);

    const handleSendMessage = async (e?: FormEvent) => {
        e?.preventDefault();
        if (!messageBody.trim() || isSending || status === 'loading') return;

        const body = messageBody;
        setMessageBody('');
        setIsSending(true);

        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: AIHumanMessage = {
            _id: tempId,
            content: body,
            role: 'user',
            persona: personaId,
            user: currentUser?._id || '',
            conversation: messages[0]?.conversation || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        mutateHistory((current: any) => ({
            ...current,
            data: [...(current?.data || []), optimisticMsg]
        }), false);

        try {
            await aiHumanApi.chatWithAIHuman(personaId, { message: body });
        } catch (error) {
            console.error("Chat Error:", error);
            toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
            setMessageBody(body);
            mutateHistory();
        } finally {
            setIsSending(false);
        }
    };

    const { data: chatsData, mutate: mutateChats } = useSWR('ai-human-chats', () => aiHumanApi.listMyAIHumanChats());
    const chats: AIHumanConversation[] = chatsData?.data || chatsData || [];

    if (!persona && personaId) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex h-full bg-black/20 overflow-hidden relative flex-col md:flex-row">
            {!personaId && (
                <div className="md:hidden px-6 pt-6 pb-2 shrink-0 z-30">
                    <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800/50">
                        <button
                            onClick={() => setTab('discover')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'discover'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/20'
                                : 'text-zinc-500'
                                }`}
                        >
                            Хайх
                        </button>
                        <button
                            onClick={() => setTab('history')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/20'
                                : 'text-zinc-500'
                                }`}
                        >
                            Зурвасууд
                        </button>
                    </div>
                </div>
            )}

            {/* AI Chat List Sidebar */}
            <div className={`${personaId || activeTab === 'discover' ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-zinc-900/50 flex flex-col bg-zinc-950/20 shrink-0`}>
                <div className="p-8 border-b border-zinc-900/50 hidden md:block">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-serif font-bold text-white">AI Харилцаа</h2>
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Таны нээсэн ертөнц</p>
                        </div>

                        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800/50">
                            <button
                                onClick={() => setTab('discover')}
                                className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === 'discover'
                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/20'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                Хайх
                            </button>
                            <button
                                onClick={() => setTab('history')}
                                className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history'
                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/20'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                Зурвасууд
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6 md:p-0 md:hidden border-b border-zinc-900/20">
                    <h2 className="text-xl font-serif font-bold text-white italic">Миний чатнууд</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {chats?.map((chat, idx) => {
                        const p = (chat as any).personaDetails || (typeof chat.persona === 'object' ? chat.persona : null);
                        const pName = p?.name || 'AI Persona';
                        const pImage = p?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(pName)}&background=random`;
                        const pId = p?._id || (typeof chat.persona === 'string' ? chat.persona : '');

                        if (!pId) return null;

                        return (
                            <motion.div
                                key={idx}
                                onClick={() => router.push(`/ai-human?personaId=${pId}`)}
                                className={`group flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-500 ${pId === personaId
                                    ? 'bg-rose-500/10 border border-rose-500/20 shadow-[0_10px_30px_-5px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/10'
                                    : 'hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800/30'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl overflow-hidden relative ring-2 transition-all duration-500 ${pId === personaId ? 'ring-rose-500/40 scale-105' : 'ring-zinc-800/50 group-hover:ring-zinc-700'}`}>
                                        <Image
                                            src={pImage}
                                            alt={pName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-zinc-950 rounded-full shadow-lg"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`font-bold truncate text-sm transition-colors ${pId === personaId ? 'text-rose-500' : 'text-white group-hover:text-rose-100'}`}>{pName}</h4>
                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">
                                            {(() => {
                                                const time = (chat as any).lastMessageAt || (chat as any).conversation?.lastMessageAt || (p as any)?.conversation?.lastMessageAt;
                                                return time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                                            })()}
                                        </span>
                                    </div>
                                    <p className={`text-[11px] line-clamp-1 leading-tight ${pId === personaId ? 'text-rose-200/60 font-medium' : 'text-zinc-500 font-medium'}`}>
                                        {(() => {
                                            const preview = (chat as any).lastMessagePreview || (chat as any).conversation?.lastMessagePreview || (p as any)?.conversation?.lastMessagePreview;
                                            return preview?.replace(/\s+/g, ' ') || 'Яриаг эхлүүлэх...';
                                        })()}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {personaId ? (
                <div className="flex flex-1 flex-col relative bg-zinc-950 md:bg-transparent h-full overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <motion.div
                            animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[10%] left-[5%] w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]"
                        />
                        <motion.div
                            animate={{ y: [0, 40, 0], x: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px]"
                        />
                    </div>

                    <div className="relative z-20 h-20 border-b border-zinc-900/50 flex items-center justify-between px-6 md:px-8 bg-black/10 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-3 md:gap-4">
                            <button
                                onClick={handleBack}
                                className="md:hidden w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 active:scale-95 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div
                                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden relative border-2 border-zinc-800 cursor-pointer hover:border-rose-500/50 transition-colors"
                                onClick={() => setIsAvatarZoomed(true)}
                            >
                                <Image
                                    src={persona?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(persona?.name || 'AI')}&background=random`}
                                    alt={persona?.name || 'AI'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-wide">{persona?.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'loading' || isPersonaTyping ? 'bg-rose-500 animate-pulse' : 'bg-green-500'}`}></div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${status === 'loading' || isPersonaTyping ? 'text-rose-500' : 'text-green-500'}`}>
                                        {status === 'loading' || isPersonaTyping ? 'Typing...' : 'Online'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsInfoOpen(true)}
                            className="w-10 h-10 rounded-xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                        >
                            <Info size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth z-10">
                        {messages?.map((msg, idx) => {
                            const isPersona = msg.role === 'assistant';
                            return (
                                <div key={idx} className={`flex gap-4 max-w-[70%] ${!isPersona ? 'ml-auto flex-row-reverse' : ''}`}>
                                    {isPersona && (
                                        <div className="w-8 h-8 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800">
                                            <Image
                                                src={persona?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(persona?.name || 'AI')}&background=random`}
                                                alt={persona?.name || 'AI'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-1.5">
                                        <div className={`${!isPersona ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/20' : 'glass-card text-zinc-200 border border-zinc-800/40'} p-4 rounded-3xl ${!isPersona ? 'rounded-br-none' : 'rounded-bl-none'} text-sm leading-relaxed transition-all`}>
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i} className={line.startsWith('*') || line.startsWith('_')
                                                    ? 'italic text-rose-300/80 mb-3 block text-sm'
                                                    : 'mb-3 last:mb-0'}>
                                                    {line.replace(/[*_]/g, '')}
                                                </p>
                                            ))}
                                        </div>
                                        <span className={`text-[9px] font-bold text-zinc-600 uppercase block ${!isPersona ? 'text-right mr-1' : 'ml-1'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {isPersonaTyping && (
                            <div className="flex gap-4 max-w-[70%]">
                                <div className="w-8 h-8 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800">
                                    <Image
                                        src={persona?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(persona?.name || 'AI')}&background=random`}
                                        alt={persona?.name || 'AI'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="glass-card text-zinc-200 border border-zinc-800/40 p-4 rounded-3xl rounded-bl-none text-sm leading-relaxed transition-all w-20 flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce mx-0.5 [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce mx-0.5 [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce mx-0.5" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 md:p-8 shrink-0 bg-transparent z-20">
                        {!canChat && (
                            <div
                                onClick={() => router.push('/plans')}
                                className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-rose-500/20 transition-all text-xs max-w-3xl mx-auto"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-rose-500" size={16} />
                                    <p className="font-bold text-rose-100 uppercase tracking-widest">
                                        {membershipRequired ? "Бүртгэлтэй хэрэглэгчдэд нээлттэй" : "Чатлах эрх дууссан"}
                                    </p>
                                </div>
                                <span className="font-bold text-rose-500 uppercase tracking-wider">Get Access ❯</span>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className={`relative block max-w-3xl mx-auto ${!canChat ? 'opacity-40 cursor-not-allowed' : ''}`}>
                            <div className="flex items-center gap-3 md:gap-4 bg-zinc-900/80 border border-zinc-800/50 rounded-3xl md:rounded-4xl px-4 md:px-6 py-3 backdrop-blur-xl shadow-2xl focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={messageBody}
                                    onChange={(e) => setMessageBody(e.target.value)}
                                    disabled={isSending || status === 'loading' || !canChat}
                                    placeholder={canChat ? "Шинэ зурвас бичих..." : "Access Required"}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-600 px-2 font-medium"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!messageBody.trim() || isSending || status === 'loading' || !canChat}
                                    className="w-12 h-12 bg-rose-600 disabled:opacity-50 disabled:bg-zinc-800 rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 transition-all ml-1 shadow-[0_8px_20px_rgba(225,29,72,0.3)] transform active:scale-90 shrink-0"
                                >
                                    {isSending || status === 'loading' ? (
                                        <Loading size="sm" />
                                    ) : (
                                        <Send size={18} className="ml-0.5" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : activeTab === 'discover' ? (
                <div className="flex-1 flex flex-col h-full bg-zinc-950/30">
                    <AIHumanListView />
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-zinc-500 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800/30">
                        <Sparkles size={32} className="opacity-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">AI Харилцаа эхлээрэй</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Persona-гаа сонгож чатална уу</p>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isInfoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsInfoOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0">
                                <Image
                                    src={persona?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(persona?.name || 'AI')}&background=random`}
                                    alt={persona?.name || 'AI'}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                                <button
                                    onClick={() => setIsInfoOpen(false)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:bg-black hover:text-white transition-all backdrop-blur-md"
                                >
                                    <X size={16} />
                                </button>

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Active now</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white italic truncate">
                                        {persona?.name}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                <div className="flex flex-wrap gap-2">
                                    <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                        {persona?.gender}
                                    </div>
                                    {persona?.age && (
                                        <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                            {persona?.age} yrs
                                        </div>
                                    )}
                                    {persona?.badge?.map((tag, i) => (
                                        <div key={i} className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-300 uppercase tracking-[0.2em]">
                                            {tag}
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                    {persona?.greeting || persona?.shortBio || "Step into a world of mystery. Start chatting to discover more about my personality and life."}
                                </p>

                                <button
                                    onClick={() => setIsInfoOpen(false)}
                                    className="w-full h-12 md:h-14 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center text-white font-bold tracking-wider hover:bg-zinc-800 transition-colors"
                                >
                                    ХААХ
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAvatarZoomed && persona && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl"
                        onClick={() => setIsAvatarZoomed(false)}
                    >
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                animate={{ y: [0, -20, 0], x: [0, 10, 0], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500/30 rounded-full blur-[80px]"
                            />
                            <motion.div
                                animate={{ y: [0, 30, 0], x: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
                            />
                        </div>

                        <button
                            onClick={() => setIsAvatarZoomed(false)}
                            className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all z-20 backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                            className="relative z-10 w-[90vw] max-w-sm aspect-square md:max-w-md rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(244,63,94,0.2)] border border-white/10"
                        >
                            <Image
                                src={persona.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(persona.name)}&background=random`}
                                alt={persona.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
