'use client';
import React, { useState } from 'react';
import { networkApi, NetworkPost, NetworkPostsResponse, NetworkCommentsResponse } from '@/apis/network';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Clock, Plus, Share2, X, Send, Trash2 } from 'lucide-react';
import Image from 'next/image';
import useSWR from 'swr';
import { useAuth, User } from '@/components/providers/AuthProvider';
import { ImagePicker } from '../form/image-picker';

function CommentsSection({ storyId, mutatePosts, currentUser, onNavigateToProfile }: { storyId: string, mutatePosts: () => void, currentUser: User | null, onNavigateToProfile?: (id: string) => void }) {
    const { data, mutate } = useSWR<NetworkCommentsResponse>(
        storyId ? `network/comments/${storyId}` : null,
        () => networkApi.listNetworkComments(storyId)
    );
    const [msg, setMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim()) return;
        try {
            setIsSubmitting(true);
            await networkApi.createNetworkComment(storyId, { message: msg });
            setMsg('');
            mutate();
            mutatePosts();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteComment = async (id: string) => {
        if (!window.confirm("Энэ сэтгэгдлийг устгахдаа итгэлтэй байна уу?")) return;
        try {
            await networkApi.deleteNetworkComment(id);
            mutate();
            mutatePosts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white">Сэтгэгдлүүд ({data?.total || 0})</h3>

            <div className="flex-1 min-h-0 space-y-4">
                {[...(data?.data || [])].reverse().map(comment => {
                    const commentUser = comment.user || comment.createdBy;
                    return (
                        <div key={comment._id} className="bg-zinc-900/30 p-4 rounded-2xl flex gap-4 group">
                            <div
                                className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 cursor-pointer bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-zinc-700/50"
                                onClick={() => commentUser?._id && onNavigateToProfile?.(commentUser._id)}
                            >
                                {comment.isAiGenerated ? (
                                    <Image
                                        src="/ai.jpeg"
                                        alt="AI Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="uppercase">{(commentUser?.username || '??').substring(0, 2)}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                    <p
                                        className="font-bold text-white text-sm cursor-pointer hover:text-rose-500 transition-colors truncate min-w-0 flex-1"
                                        onClick={() => commentUser?._id && onNavigateToProfile?.(commentUser._id)}
                                    >
                                        {commentUser?.username}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 shrink-0">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className="text-zinc-400 mt-1 text-sm">{comment.message}</p>
                            </div>
                            {currentUser?._id === commentUser?._id && (
                                <button
                                    onClick={() => deleteComment(comment._id)}
                                    className="text-zinc-600 hover:text-rose-500 transition-all p-2"
                                    title="Устгах"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}
                {!data?.data?.length && (
                    <p className="text-center text-zinc-500 py-8 text-sm">Одоогоор сэтгэгдэл алга байна.</p>
                )}
            </div>

            <form onSubmit={submitComment} className="flex gap-3 sticky bottom-0 bg-zinc-950 pt-2">
                <input
                    value={msg} onChange={e => setMsg(e.target.value)}
                    placeholder="Сэтгэгдэл бичих..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <button
                    disabled={isSubmitting || !msg.trim()}
                    className="px-5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}

export function StoriesView({ onNavigateToProfile }: { onNavigateToProfile?: (id: string) => void }) {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { data, mutate, isValidating } = useSWR<NetworkPostsResponse>(
        [`network/posts`, page],
        () => networkApi.listNetworkPosts({
            page,
            limit: LIMIT
        }),
        { keepPreviousData: true }
    );
    const [allPosts, setAllPosts] = useState<NetworkPost[]>([]);

    React.useEffect(() => {
        if (data?.data) {
            if (page === 1) {
                setAllPosts(data.data);
            } else {
                setAllPosts(prev => {
                    const existingIds = new Set(prev?.map(p => p._id));
                    const newPosts = data.data.filter(p => !existingIds.has(p._id));
                    return [...prev, ...newPosts];
                });
            }
        }
    }, [data, page]);

    const [isCreating, setIsCreating] = useState(false);
    const [selectedStory, setSelectedStory] = useState<NetworkPost | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<{ id?: string; url?: string } | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await networkApi.createNetworkPost({
                title,
                description,
                image: image?.id
            });
            await mutate();
            setIsCreating(false);
            setTitle('');
            setDescription('');
            setImage(null);
        } catch (error) {
            console.error("Failed to create post", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (storyId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Энэ түүхийг устгахдаа итгэлтэй байна уу?")) return;
        try {
            await networkApi.deleteNetworkPost(storyId);
            mutate();
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleLike = async (story: NetworkPost, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await mutate(async (currentData) => {
                if (!currentData) return currentData;
                const newData = { ...currentData };
                newData.data = newData.data?.map(p =>
                    p._id === story._id
                        ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likedByMe ? Math.max(0, p.likeCount - 1) : p.likeCount + 1 }
                        : p
                );
                return newData;
            }, false);

            if (story.likedByMe) {
                await networkApi.unlikeNetworkPost(story._id);
            } else {
                await networkApi.likeNetworkPost(story._id);
            }
            mutate(); // Revalidate
        } catch (error) {
            console.error("Failed to like", error);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif text-white tracking-tight">Түүхүүд</h1>
                    <p className="text-zinc-500">Бусдын хуваалцсан нандин, романтик түүхүүдийг унших.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 cursor-pointer py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(225,29,72,0.2)] active:scale-95 z-10"
                >
                    <Plus size={20} />
                    Түүх бичих
                </button>
            </div>

            <div className="space-y-8">
                {allPosts?.map((story: NetworkPost, index: number) => (
                    <motion.div
                        key={story._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedStory(story)}
                        className="group glass-card rounded-4xl p-8 hover:bg-zinc-900/40 transition-all border border-zinc-800/40 cursor-pointer"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div
                                            className="w-12 h-12 rounded-2xl overflow-hidden relative ring-4 ring-zinc-900/50 cursor-pointer shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNavigateToProfile?.(story.createdBy?._id);
                                            }}
                                        >
                                            <Image
                                                src={story.createdBy?.avatar || `https://ui-avatars.com/api/?name=${story.createdBy?.username || 'User'}&background=random`}
                                                alt="Avatar"
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="font-bold text-white tracking-wide cursor-pointer hover:text-rose-500 transition-colors truncate"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNavigateToProfile?.(story.createdBy?._id);
                                                }}
                                            >
                                                {story.createdBy?.username}
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                <Clock size={12} className="text-rose-500/80" />
                                                {new Date(story.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {user?._id === story.createdBy?._id && (
                                            <button
                                                onClick={(e) => handleDeletePost(story._id, e)}
                                                className="text-zinc-600 hover:text-rose-500 transition-colors"
                                                title="Устгах"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 min-w-0">
                                    <h3 className="text-2xl font-serif font-bold text-rose-100 group-hover:text-rose-400 transition-colors break-all line-clamp-2">
                                        {story.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-base line-clamp-3 break-all">
                                        {story.description}
                                    </p>
                                    {story.image?.url && (
                                        <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mt-4">
                                            <Image src={story.image.url} alt="Story Image" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-t border-zinc-800/50">
                                    <button
                                        onClick={(e) => handleLike(story, e)}
                                        className={`flex cursor-pointer items-center gap-2 transition-all group/btn ${story.likedByMe ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-500'}`}
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${story.likedByMe ? 'bg-rose-500/20' : 'group-hover/btn:bg-rose-500/10'}`}>
                                            <Heart size={20} className={story.likedByMe ? 'fill-rose-500' : 'group-hover/btn:fill-current'} />
                                        </div>
                                        <span className="text-sm font-bold">{story.likeCount}</span>
                                    </button>
                                    <div className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all group/btn">
                                        <div className="p-2 rounded-xl group-hover/btn:bg-zinc-800 transition-colors">
                                            <MessageCircle size={20} />
                                        </div>
                                        <span className="text-sm font-bold">{story.commentCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {data && data.totalPages > page && (
                    <div className="flex justify-center pt-10">
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={isValidating}
                            className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all border border-zinc-800 disabled:opacity-50"
                        >
                            {isValidating ? 'Уншиж байна...' : 'Цааш үзэх'}
                        </button>
                    </div>
                )}

                {allPosts.length === 0 && !isValidating && (
                    <div className="text-center py-20 bg-zinc-950/50 rounded-4xl border border-zinc-900 border-dashed">
                        <p className="text-zinc-500">Одоогоор түүх алга байна.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsCreating(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif text-white">Шинэ түүх</h2>
                                <button onClick={() => setIsCreating(false)} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <input
                                        value={title} onChange={e => setTitle(e.target.value)}
                                        placeholder="Гарчиг" required
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                                    />
                                </div>
                                <div className="pt-2">
                                    <ImagePicker label="Зураг оруулах" value={image} onChange={(v) => setImage(v)} />
                                </div>
                                <div>
                                    <textarea
                                        value={description} onChange={e => setDescription(e.target.value)}
                                        placeholder="Түүхээ хуваалцах..." required rows={5}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
                                    />
                                </div>
                                <button
                                    disabled={isSubmitting || !title.trim() || !description.trim()}
                                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-[0_5px_15px_rgba(225,29,72,0.2)]"
                                >
                                    {isSubmitting ? 'Нийтэлж байна...' : 'Нийтлэх'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedStory && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 antialiased">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedStory(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 20 }}
                            className="relative w-full max-w-2xl max-h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl z-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-5 md:p-6 border-b border-zinc-900 gap-4">
                                <h2 className="text-xl font-serif text-white truncate pr-4 flex-1 min-w-0">{selectedStory.title}</h2>
                                <button onClick={() => setSelectedStory(null)} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors shrink-0">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-8 no-scrollbar">
                                {/* Story content */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className="w-12 h-12 rounded-xl overflow-hidden relative ring-2 ring-zinc-900 cursor-pointer shrink-0"
                                            onClick={() => onNavigateToProfile?.(selectedStory.createdBy?._id)}
                                        >
                                            <Image
                                                src={selectedStory.createdBy?.avatar || `https://ui-avatars.com/api/?name=${selectedStory.createdBy?.username || 'User'}&background=random`}
                                                alt="Avatar"
                                                fill
                                                className="object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="font-bold text-white tracking-wide cursor-pointer hover:text-rose-500 transition-colors truncate"
                                                onClick={() => onNavigateToProfile?.(selectedStory.createdBy?._id)}
                                            >
                                                {selectedStory.createdBy?.username}
                                            </p>
                                            <div className="text-xs text-zinc-500 font-medium">
                                                {new Date(selectedStory.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap break-all">
                                        {selectedStory.description}
                                    </p>

                                    {selectedStory.image?.url && (
                                        <div className="relative w-full h-48 md:h-80 rounded-2xl overflow-hidden mt-4">
                                            <Image src={selectedStory.image.url} alt="Story Image" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="h-px bg-zinc-900" />

                                <CommentsSection storyId={selectedStory._id} mutatePosts={() => mutate()} currentUser={user} onNavigateToProfile={onNavigateToProfile} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
