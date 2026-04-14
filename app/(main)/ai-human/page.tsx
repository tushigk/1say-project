'use client';

import { AIHumanListView } from '@/components/views/AIHumanListView';
import { AIHumanChatView } from '@/components/views/AIHumanChatView';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AIHumanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personaId = searchParams.get('personaId');
  const activeTab = (searchParams.get('tab') as 'discover' | 'history') || 'discover';

  return (
    <AIHumanChatView 
      personaId={personaId || undefined} 
      activeTab={activeTab}
    />
  );
}

export default function AIHumanPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <AIHumanContent />
    </Suspense>
  );
}
