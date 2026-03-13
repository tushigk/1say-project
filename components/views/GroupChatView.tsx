'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Star } from 'lucide-react';
import Image from 'next/image';

const groups = [
    { name: 'Шөнийн яриа 🌙', members: 142, desc: 'Оройн цагаар чөлөөтэй ярилцах өрөө', active: 24, img: 'night', featured: true },
    { name: 'Болзооны зөвлөгөө 🥂', members: 89, desc: 'Анхны болзоо, харилцааны талаарх туршлага', active: 12, img: 'date', featured: false },
    { name: 'Нууцхан хүсэл 🔥', members: 256, desc: 'Зөвхөн +18 нээлттэй яриа (Нууцлалтай)', active: 56, img: 'fire', featured: false },
    { name: 'Ганц биечүүд 🍷', members: 412, desc: 'Шинэ хүмүүстэй танилцах, уулзалт зохиох', active: 89, img: 'wine', featured: false },
];

export function GroupChatView() {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col space-y-10 group-chats">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-[0.3em]">
                        <Users size={14} />
                        <span>Коммюнити</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Грүпп чат</h1>
                    <p className="text-zinc-500 max-w-lg">Ижил сонирхолтой хүмүүстэй нэгдэж, чөлөөтэй ярилц.</p>
                </div>
                <button className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all border border-zinc-800/50 flex items-center gap-2 group/btn">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300 text-rose-500" />
                    Шинэ өрөө нээх
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 overflow-y-auto pb-10">
                {groups.map((group, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group relative bg-zinc-900/40 border border-zinc-800/40 rounded-[2.5rem] p-6 hover:bg-zinc-900/60 transition-all cursor-pointer flex gap-6 overflow-hidden"
                    >
                        {group.featured && (
                            <div className="absolute top-0 right-0 px-6 py-2 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-3xl flex items-center gap-1.5 z-10">
                                <Star size={10} className="fill-current" />
                                Featured
                            </div>
                        )}

                        <div className="w-28 h-28 rounded-4xl overflow-hidden relative shrink-0 border border-zinc-700/50 ring-4 ring-zinc-800/30">
                            <Image
                                src={`https://picsum.photos/seed/${group.img}/300/300`}
                                alt={group.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-white tracking-wide truncate group-hover:text-rose-400 transition-colors">{group.name}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/10">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                    {group.active}
                                </div>
                            </div>

                            <p className="text-sm text-zinc-500 line-clamp-1 group-hover:text-zinc-400 transition-colors">{group.desc}</p>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 overflow-hidden relative">
                                                <Image src={`https://picsum.photos/seed/user${i + idx}/100/100`} alt="user" fill className="object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                                            +{group.members - 3}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 translate-x-4 group-hover:translate-x-0">
                                    Нэгдэх
                                    <span className="text-lg">→</span>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
