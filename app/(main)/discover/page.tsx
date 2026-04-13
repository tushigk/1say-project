'use client';

import { DiscoverView } from '@/components/views/DiscoverView';
import { useRouter } from 'next/navigation';

export default function DiscoverPage() {
  const router = useRouter();

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const navigateToChat = (chatId: string, type: 'direct' | 'group' = 'direct') => {
    router.push(`/${type === 'group' ? 'groups' : 'chat'}?chatId=${chatId}`);
  };

  return (
    <DiscoverView
      onNavigateToProfile={navigateToProfile}
      onNavigateToChat={navigateToChat}
    />
  );
}
