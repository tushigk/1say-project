'use client';

import { GroupChatView } from '@/components/views/GroupChatView';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function GroupsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const setSelectedChatId = (id: string | null) => {
    if (id) {
      router.push(`/groups?chatId=${id}`);
    } else {
      router.push('/groups');
    }
  };

  return (
    <GroupChatView
      onNavigateToProfile={navigateToProfile}
      selectedChatId={chatId}
      setSelectedChatId={setSelectedChatId}
    />
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <GroupsContent />
    </Suspense>
  );
}
