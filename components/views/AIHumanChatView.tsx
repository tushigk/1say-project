'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, ChevronLeft, MoreVertical, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { aiHumanApi } from '@/apis';
import { AIHuman, AIHumanMessage } from '@/apis/aiHuman';
import { useSocket } from '@/components/providers/SocketProvider';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/components/providers/AuthProvider';

interface AIHumanChatViewProps {
    personaId?: string;
    onBack?: () => void;
}

export function AIHumanChatView({ personaId: propPersonaId, onBack }: AIHumanChatViewProps) {
    const { user: currentUser } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { socket } = useSocket();
    const personaId = propPersonaId || searchParams.get('personaId') as string;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.push('/ai-human');
        }
    };

    const [messageBody, setMessageBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isPersonaTyping, setIsPersonaTyping] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading'>('idle');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: personaData } = useSWR(personaId ? `ai-humans/${personaId}` : null, () => aiHumanApi.getAIHumanDetail(personaId));
    const { data: historyData, mutate: mutateHistory } = useSWR(personaId ? `ai-humans/${personaId}/history` : null, () => aiHumanApi.getAIHumanHistory(personaId));

    const persona: AIHuman | null = Array.isArray(personaData?.data) ? personaData.data[0] : (personaData?.data || null);
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

    if (!persona) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-[#0a0a0a] relative overflow-hidden h-full w-full">
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-rose-500/10 via-rose-500/5 to-transparent pointer-events-none z-0" />

            <div className="relative z-40 w-full pt-8 pb-4 flex flex-col items-center">
                <button
                    onClick={handleBack}
                    className="absolute top-8 left-6 md:left-12 w-10 h-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-xl active:scale-90"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-rose-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-duration-1000" />
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden relative shadow-[0_0_50px_rgba(244,63,94,0.3)] ring-2 ring-rose-500/20 group-hover:ring-rose-500/50 transition-all duration-500">
                            <Image
                                src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                alt={persona.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-widest leading-none uppercase flex items-center gap-3">
                            {persona.name}
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${status === 'loading' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_8px_rgba(16,185,129,0.8)]`} />
                            </div>
                        </h2>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2 block">
                            {status === 'loading' ? 'Typing...' : 'Online'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-0 custom-scrollbar relative z-10">
                <div className="max-w-4xl mx-auto py-8 flex flex-col gap-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="bg-white/[0.02] backdrop-blur-3xl px-10 py-12 rounded-[3.5rem] border border-white/5 shadow-3xl max-w-sm relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mb-8 opacity-40" />
                                <h4 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-4">{persona.name}</h4>
                                <p className="text-zinc-400 text-sm italic font-serif leading-relaxed px-2">
                                    "{persona.greeting || "Let's begin our story..."}"
                                </p>
                            </div>
                        </div>
                    )}

                    {messages?.map((msg, idx) => {
                        const isPersona = msg.role === 'assistant';
                        return (
                            <div key={idx} className={`flex ${!isPersona ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                <div className={`relative flex flex-col gap-2 ${isPersona ? 'max-w-[90%] md:max-w-2xl' : 'max-w-[85%] md:max-w-xl'}`}>
                                    <div className={`relative px-6 py-5 md:px-8 md:py-6 rounded-[2.5rem] shadow-2xl transition-all duration-500 ${!isPersona
                                        ? 'bg-rose-600/90 text-white rounded-tr-sm shadow-rose-900/20'
                                        : 'bg-zinc-900/80 backdrop-blur-2xl text-zinc-100 border border-white/10 rounded-tl-sm'
                                        }`}>

                                        {isPersona && (
                                            <div className="flex items-center gap-2 mb-4 opacity-60">
                                                <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em]">{persona.name}</span>
                                                <div className="w-px h-2 bg-white/20" />
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`text-[15px] md:text-[16px] leading-[1.7] tracking-wide antialiased ${isPersona ? 'font-light' : 'font-medium'}`}>
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i} className={line.startsWith('*') || line.startsWith('_')
                                                    ? 'italic text-rose-300/80 mb-3 bg-white/5 py-1.5 px-3 rounded-xl inline-block text-sm'
                                                    : 'mb-3 last:mb-0'}>
                                                    {line.replace(/[*_]/g, '')}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    {!isPersona && (
                                        <div className="flex justify-end pr-4 opacity-40">
                                            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{new Date(msg?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {isPersonaTyping && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-left-4">
                            <div className="bg-zinc-900/80 backdrop-blur-3xl px-6 py-4 rounded-full border border-white/10 flex gap-1.5 shadow-2xl items-center">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-32" />
                </div>
            </div>

            <div className="relative z-50 p-6 md:p-10 bg-gradient-to-t from-black via-black/90 to-transparent">
                <div className="max-w-3xl mx-auto">
                    {!canChat && (
                        <div
                            onClick={() => router.push('/plans')}
                            className="mb-6 bg-rose-500/10 backdrop-blur-3xl border border-rose-500/20 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:bg-rose-500/20 transition-all group animate-in slide-in-from-bottom-2"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-rose-500/20 rounded-xl">
                                    <Sparkles className="text-rose-500" size={18} />
                                </div>
                                <p className="text-[10px] md:text-xs font-black text-rose-100 uppercase tracking-widest">
                                    {membershipRequired ? "Бүртгэлтэй хэрэглэгчдэд нээлттэй" : "Чатлах эрх дууссан"}
                                </p>
                            </div>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform">Get Access ❯</span>
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className={`relative group ${!canChat ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <div className="absolute -inset-4 bg-rose-500/10 rounded-[4rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                        <div className="relative flex items-center bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 rounded-[2.5rem] pl-8 pr-2 py-2 group-focus-within:border-rose-500/30 transition-all duration-500">
                            <input
                                ref={inputRef}
                                type="text"
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                                disabled={isSending || status === 'loading' || !canChat}
                                placeholder={canChat ? "Message..." : "Access Required"}
                                className="flex-1 bg-transparent border-none focus:outline-none text-[16px] text-white placeholder:text-zinc-600 py-3 font-medium tracking-wide"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!messageBody.trim() || isSending || status === 'loading' || !canChat}
                                className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:scale-75 transition-all duration-300"
                            >
                                <Send size={20} className="ml-0.5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
