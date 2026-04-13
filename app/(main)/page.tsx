'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/discover');
  }, [router]);

  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
