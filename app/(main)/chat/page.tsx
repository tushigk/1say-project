'use client';

import { ChatView } from '@/components/views/ChatView';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const setSelectedChatId = (id: string | null) => {
    if (id) {
      router.push(`/chat?chatId=${id}`);
    } else {
      router.push('/chat');
    }
  };

  return (
    <ChatView
      onNavigateToProfile={navigateToProfile}
      selectedChatId={chatId}
      setSelectedChatId={setSelectedChatId}
    />
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
