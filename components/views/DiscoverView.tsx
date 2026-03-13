'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';

const profiles = [
    { id: 1, name: 'Ану', age: 24, location: 'Улаанбаатар', image: 'girl1', bio: 'Шинэ зүйл туршиж үзэх дуртай. Оройн цагаар вино уунгаа ярилцах хүн хайж байна.' },
    { id: 2, name: 'Билгүүн', age: 28, location: 'Улаанбаатар', image: 'boy1', bio: 'Фитнесст явдаг, эрүүл амьдралын хэв маягтай. Сонирхолтой яриа өрнүүлэх дуртай.' },
    { id: 3, name: 'Хулан', age: 22, location: 'Дархан', image: 'girl2', bio: 'Урлагт хайртай. Нууцлаг, романтик харилцааг илүүд үздэг.' },
    { id: 4, name: 'Төгөлдөр', age: 31, location: 'Улаанбаатар', image: 'boy2', bio: 'Бизнес эрхлэгч. Амралтын өдрүүдээр салхинд гарах, шинэ газар нээх дуртай.' },
    { id: 5, name: 'Номин', age: 26, location: 'Эрдэнэт', image: 'girl3', bio: 'Кофе болон гүн гүнзгий ярианд дуртай. Чөлөөтэй сэтгэдэг хүнтэй танилцана.' },
    { id: 6, name: 'Мөнхөө', age: 29, location: 'Улаанбаатар', image: 'boy3', bio: 'Хөгжилтэй, нээлттэй. Хамтдаа хөгжилдөх найз эсвэл түүнээс илүү харилцаа.' },
];

export function DiscoverView() {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-[0.3em]">
                        <Sparkles size={14} />
                        <span>Санал болгож буй</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                        Танилцах
                    </h1>
                    <p className="text-zinc-500 max-w-lg leading-relaxed">
                        Өөртэйгөө ижил сонирхолтой хүмүүсийг олж нээж, шинэ харилцааг эхлүүл.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {profiles.map((profile, index) => (
                    <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="group relative h-[500px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-rose-500/50 transition-all duration-500 shadow-2xl"
                    >
                        <Image
                            src={`https://picsum.photos/seed/${profile.image}/600/800`}
                            alt={profile.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                        />

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90"></div>
                        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-serif font-bold text-white tracking-tight">
                                        {profile.name}, <span className="text-rose-500">{profile.age}</span>
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-zinc-300 font-medium">
                                        <MapPin size={16} className="text-rose-500" />
                                        {profile.location}
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                {profile.bio}
                            </p>

                            <div className="pt-2 flex gap-3">
                                <button className="flex-1 py-4 bg-white text-black hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-300 font-bold flex items-center justify-center gap-2 transform active:scale-95 shadow-lg">
                                    <Heart size={20} className="fill-current" />
                                    Мэндчилэх
                                </button>
                                <button className="w-14 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all flex items-center justify-center text-white border border-white/10">
                                    <Sparkles size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
