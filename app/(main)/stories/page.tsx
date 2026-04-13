'use client';

import { StoriesView } from '@/components/views/StoriesView';
import { useRouter } from 'next/navigation';

export default function StoriesPage() {
  const router = useRouter();

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return <StoriesView onNavigateToProfile={navigateToProfile} />;
}
