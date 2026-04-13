'use client';

import { ProfileView } from '@/components/views/ProfileView';
import { useParams, useRouter } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const navigateToChat = (chatId: string, type: 'direct' | 'group' = 'direct') => {
    router.push(`/${type === 'group' ? 'groups' : 'chat'}?chatId=${chatId}`);
  };

  return (
    <ProfileView
      userId={id}
      onBack={() => router.back()}
      onNavigateToChat={navigateToChat}
    />
  );
}
