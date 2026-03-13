'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Clock, Plus, Share2 } from 'lucide-react';
import Image from 'next/image';

const stories = [
    {
        id: 1,
        author: 'Нууцлагдмал',
        avatar: 'anon1',
        time: '2 цагийн өмнө',
        title: 'Бороотой үдшийн гэнэтийн учрал',
        content: 'Тэр өдөр гадаа усан бороо цутгаж байлаа. Би шүхэргүй байсан тул нэгэн кафе руу гүйж ортол тэр тэнд сууж байсан юм. Бидний харц мөргөлдөх тэр мөчид ямар нэгэн онцгой зүйл эхэлж байгааг би мэдэрсэн. Тэр надад кофе авч өгөөд, бид 3 цаг гаруй тасралтгүй ярилцсан. Түүний хоолойны өнгө, инээмсэглэл нь одоо ч миний санаанаас гардаггүй...',
        likes: 124,
        comments: 18,
        category: 'Романс'
    },
    {
        id: 2,
        author: 'Шөнийн эрвээхэй',
        avatar: 'anon2',
        time: '5 цагийн өмнө',
        title: 'Анхны болзоо ба сандрал',
        content: 'Онлайнаар сар гаруй харилцсаны эцэст бид уулзахаар шийдсэн юм. Би маш их сандарч байсан ч тэр намайг хармагцаа шууд л тэвэрч авсан. Тэр тэврэлт бүх сандралыг минь үгүй хийсэн. Бид хотын гудамжаар шөнө дунд хүртэл алхаж, бие биенийхээ хамгийн нууцхан мөрөөдлүүдийг хуваалцсан. Тэр шөнө би анх удаа хэн нэгэнд бүрэн итгэж болохыг мэдэрсэн.',
        likes: 89,
        comments: 5,
        category: 'Болзоо'
    },
    {
        id: 3,
        author: 'Ганцаардсан зүрх',
        avatar: 'anon3',
        time: 'Өчигдөр',
        title: 'Зөвхөн хоёулаа',
        content: 'Хотын чимээ шуугианаас зугтаж, бид амралтын өдрөөр ууланд гарсан юм. Орой нь түүдэг галын дэргэд сууж байхад тэр миний гарыг атгаад, нүд рүү минь эгцлэн харсан. Тэр үед цаг хугацаа зогссон мэт санагдсан. Бидний дунд ямар ч үг хэрэггүй байлаа, зөвхөн бидний амьсгал, зүрхний цохилт л бүхнийг илэрхийлж байсан.',
        likes: 256,
        comments: 42,
        category: 'Аялал'
    }
];

export function StoriesView() {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif text-white tracking-tight">Түүхүүд</h1>
                    <p className="text-zinc-500">Бусдын хуваалцсан нандин, романтик түүхүүдийг унших.</p>
                </div>
                <button className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(225,29,72,0.2)] active:scale-95">
                    <Plus size={20} />
                    Түүх бичих
                </button>
            </div>

            <div className="space-y-8">
                {stories.map((story, index) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group glass-card rounded-4xl p-8 hover:bg-zinc-900/40 transition-all border border-zinc-800/40"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden relative ring-4 ring-zinc-900/50">
                                            <Image
                                                src={`https://picsum.photos/seed/${story.avatar}/100/100`}
                                                alt="Avatar"
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white tracking-wide">{story.author}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                <Clock size={12} className="text-rose-500/80" />
                                                {story.time}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest border border-rose-500/20">
                                        {story.category}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-2xl font-serif font-bold text-rose-100 group-hover:text-rose-400 transition-colors">
                                        {story.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-base">
                                        {story.content}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-t border-zinc-800/50">
                                    <button className="flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-all group/btn">
                                        <div className="p-2 rounded-xl group-hover/btn:bg-rose-500/10 transition-colors">
                                            <Heart size={20} className="group-hover/btn:fill-current" />
                                        </div>
                                        <span className="text-sm font-bold">{story.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all group/btn">
                                        <div className="p-2 rounded-xl group-hover/btn:bg-zinc-800 transition-colors">
                                            <MessageCircle size={20} />
                                        </div>
                                        <span className="text-sm font-bold">{story.comments}</span>
                                    </button>
                                    <button className="ml-auto p-2 rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
