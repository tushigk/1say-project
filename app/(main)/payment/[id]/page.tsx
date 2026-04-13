'use client';

import { PaymentView } from "@/components/views/PaymentView";
import { useParams } from 'next/navigation';

export default function PaymentPage() {
  const params = useParams();
  const id = params.id as string;

  return <PaymentView planId={id} />;
}
