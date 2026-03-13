'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, ImageIcon, Smile, Send, Phone, Video } from 'lucide-react';
import Image from 'next/image';

const chats = [
    { name: 'Ану', msg: 'Орой уулзах уу?', time: '12:30', unread: 2, active: true, img: 'girl1' },
    { name: 'Билгүүн', msg: 'Сайхан амраарай.', time: 'Өчигдөр', unread: 0, active: false, img: 'boy1' },
    { name: 'Хулан', msg: 'Тэр кино үнэхээр гоё байсан шүү.', time: 'Мягмар', unread: 0, active: false, img: 'girl2' },
];

export function ChatView() {
    return (
        <div className="flex h-full bg-black/20 overflow-hidden">
            {/* Chat List */}
            <div className="w-full md:w-96 border-r border-zinc-900/50 flex flex-col bg-zinc-950/20">
                <div className="p-8 border-b border-zinc-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif font-bold text-white">Зурвасууд</h2>
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400">
                            <Search size={18} />
                        </div>
                    </div>
                    <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                        <button className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-zinc-800 text-white rounded-xl shadow-sm">Бүгд</button>
                        <button className="flex-1 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors">Уншаагүй</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chats.map((chat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all ${i === 0
                                    ? 'bg-rose-500/10 border border-rose-500/20'
                                    : 'hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800/50'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden relative ring-2 ring-zinc-800/50">
                                    <Image src={`https://picsum.photos/seed/${chat.img}/100/100`} alt={chat.name} fill className="object-cover" referrerPolicy="no-referrer" />
                                </div>
                                {chat.active && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-zinc-950 rounded-full shadow-lg"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-white truncate text-sm">{chat.name}</h4>
                                    <span className="text-[10px] font-bold text-zinc-500">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread ? 'text-zinc-100 font-bold' : 'text-zinc-500'}`}>
                                    {chat.msg}
                                </p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="px-2 py-1 min-w-[20px] h-5 rounded-full bg-rose-600 flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-rose-900/20">
                                    {chat.unread}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Active Chat */}
            <div className="hidden md:flex flex-1 flex-col relative">
                <div className="h-20 border-b border-zinc-900/50 flex items-center justify-between px-8 bg-black/10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden relative border-2 border-zinc-800">
                            <Image src="https://picsum.photos/seed/girl1/150/150" alt="Ану" fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white tracking-wide">Ану</h3>
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

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                    <div className="flex justify-center">
                        <span className="px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Өнөөдөр</span>
                    </div>

                    <div className="flex gap-4 max-w-[70%]">
                        <div className="w-8 h-8 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800">
                            <Image src="https://picsum.photos/seed/girl1/100/100" alt="Ану" fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="glass-card text-zinc-200 p-4 rounded-3xl rounded-bl-none text-sm leading-relaxed border border-zinc-800/40 shadow-sm transition-all duration-300 hover:bg-zinc-800/20">
                                Сайн уу? Өнөөдөр ажил нь их байв уу?
                            </div>
                            <span className="text-[9px] font-bold text-zinc-600 ml-1 uppercase">12:28</span>
                        </div>
                    </div>

                    <div className="flex gap-4 max-w-[70%] ml-auto flex-row-reverse">
                        <div className="space-y-1.5">
                            <div className="bg-rose-600 text-white p-4 rounded-3xl rounded-br-none text-sm font-medium leading-relaxed shadow-lg shadow-rose-950/20">
                                Сайн. Гайгүй дээ, сая л дуусч байна. Чинийх ямар байв?
                            </div>
                            <span className="text-[9px] font-bold text-zinc-600 mr-1 block text-right uppercase">12:29</span>
                        </div>
                    </div>

                    <div className="flex gap-4 max-w-[70%]">
                        <div className="w-8 h-8 rounded-xl overflow-hidden relative shrink-0 mt-auto border border-zinc-800">
                            <Image src="https://picsum.photos/seed/girl1/100/100" alt="Ану" fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="glass-card text-zinc-200 p-4 rounded-3xl rounded-bl-none text-sm leading-relaxed border border-zinc-800/40 shadow-sm transition-all duration-300 hover:bg-zinc-800/20">
                                Дажгүй шүү. Орой уулзах уу? Нэг гоё газар олсон. 🍷
                            </div>
                            <span className="text-[9px] font-bold text-zinc-600 ml-1 uppercase">12:30</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-transparent">
                    <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800/50 rounded-4xl px-6 py-3 backdrop-blur-xl shadow-2xl focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                        <button className="text-zinc-500 hover:text-rose-500 transition-colors transform active:scale-90">
                            <ImageIcon size={22} />
                        </button>
                        <input
                            type="text"
                            placeholder="Шинэ зурвас бичих..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-zinc-100 placeholder:text-zinc-600 px-2 font-medium"
                        />
                        <button className="text-zinc-500 hover:text-rose-500 transition-colors transform active:scale-90">
                            <Smile size={22} />
                        </button>
                        <button className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 transition-all ml-1 shadow-[0_8px_20px_rgba(225,29,72,0.3)] transform active:scale-90">
                            <Send size={18} className="ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
