'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, Info, MoreVertical, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { aiHumanApi } from '@/apis';
import { AIHuman, AIHumanMessage } from '@/apis/aiHuman';
import { useSocket } from '@/components/providers/SocketProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'react-hot-toast';

export function AIHumanChatView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { socket } = useSocket();
    const personaId = searchParams.get('personaId') as string;

    const [messageBody, setMessageBody] = React.useState('');
    const [isSending, setIsSending] = React.useState(false);
    const [isPersonaTyping, setIsPersonaTyping] = React.useState(false);
    const [status, setStatus] = React.useState<'idle' | 'loading'>('idle');

    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const { data: personaData } = useSWR(personaId ? `ai-humans/${personaId}` : null, () => aiHumanApi.getAIHumanDetail(personaId));
    const { data: historyData, mutate: mutateHistory } = useSWR(personaId ? `ai-humans/${personaId}/history` : null, () => aiHumanApi.getAIHumanHistory(personaId));

    const persona: AIHuman | null = personaData?.data || null;
    const messages: AIHumanMessage[] = historyData?.data || [];

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    React.useEffect(() => {
        scrollToBottom('auto');
    }, [personaId]);

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isPersonaTyping]);

    // Socket listeners
    React.useEffect(() => {
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

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageBody.trim() || isSending || status === 'loading') return;

        const body = messageBody;
        setMessageBody('');
        setIsSending(true);

        try {
            await aiHumanApi.chatWithAIHuman(personaId, { message: body });
            // History will be updated by socket
        } catch (error) {
            console.error("Chat Error:", error);
            toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
            setMessageBody(body); // Restore message
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
        <div className="flex flex-1 flex-col bg-zinc-950 relative overflow-hidden">
            {/* Header */}
            <div className="h-24 border-b border-zinc-900/50 flex items-center justify-between px-6 md:px-10 bg-black/40 backdrop-blur-2xl shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/?tab=ai-human')}
                        className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden relative ring-2 ring-zinc-800">
                            <Image
                                src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                alt={persona.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg tracking-tight uppercase">{persona.name}</h3>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${status === 'loading' || isPersonaTyping ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${status === 'loading' || isPersonaTyping ? 'text-amber-500' : 'text-green-500'}`}>
                                    {isPersonaTyping ? 'Typing...' : status === 'loading' ? 'Thinking...' : 'Online'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                        <Info size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth relative">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 rounded-[40px] overflow-hidden relative shadow-2xl ring-4 ring-zinc-900">
                             <Image
                                src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                alt={persona.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Say Hello to {persona.name}</h4>
                            <p className="text-zinc-500 text-sm font-medium">{persona.greeting || `Hi! I'm ${persona.name}. Let's chat!`}</p>
                        </div>
                    </div>
                )}

                {messages.map((msg) => {
                    const isPersona = msg.role === 'assistant';
                    return (
                        <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${!isPersona ? 'ml-auto flex-row-reverse' : ''}`}
                        >
                            {isPersona && (
                                <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800 shadow-lg">
                                    <Image
                                        src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                        alt={persona.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className={`relative px-6 py-4 rounded-[32px] text-sm leading-relaxed shadow-xl ${
                                    !isPersona 
                                    ? 'bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-br-lg' 
                                    : 'bg-zinc-900/80 backdrop-blur-md text-zinc-100 border border-zinc-800/50 rounded-bl-lg'
                                }`}>
                                    {msg.content}
                                    {isPersona && msg.aiModel && (
                                        <div className="absolute -top-6 left-2 flex items-center gap-1 opacity-40">
                                            <Sparkles size={10} className="text-rose-400" />
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">{msg.aiModel}</span>
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[9px] font-black text-zinc-600 uppercase tracking-widest block ${!isPersona ? 'text-right' : ''}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}

                {isPersonaTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800">
                             <Image
                                src={persona.image?.url || `https://ui-avatars.com/api/?name=${persona.name}&background=random`}
                                alt={persona.name}
                                fill
                                className="object-cover opacity-50"
                            />
                        </div>
                        <div className="bg-zinc-900/50 px-6 py-4 rounded-[32px] rounded-bl-lg border border-zinc-800/30">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </motion.div>
                )}
                
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-10 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900/50">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/20 to-purple-600/20 rounded-[40px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                        <div className="relative flex items-center gap-4 bg-zinc-900/90 border border-zinc-800/80 rounded-[40px] p-2 pl-8 shadow-2xl">
                            <input
                                ref={inputRef}
                                type="text"
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                                disabled={isSending || status === 'loading'}
                                placeholder={isSending || status === 'loading' ? "Хүлээж байна..." : "Өөрийн бодлоо хуваалцаарай..."}
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-zinc-600 font-medium py-4"
                            />
                            <button
                                type="submit"
                                disabled={!messageBody.trim() || isSending || status === 'loading'}
                                className="w-14 h-14 bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:bg-zinc-800 rounded-[30px] flex items-center justify-center text-white shadow-lg shadow-rose-900/20 transition-all active:scale-90"
                            >
                                {isSending || status === 'loading' ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Send size={20} className="ml-1" />
                                )}
                            </button>
                        </div>
                    </div>
                </form>
                <p className="text-[10px] text-zinc-600 text-center mt-4 font-bold uppercase tracking-[0.2em]">AI can make mistakes. Consider checking important information.</p>
            </div>
        </div>
    );
}
