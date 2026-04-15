'use client';

import { useEffect, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { ShieldCheck, Zap, Receipt, Smartphone, Clock, Flame, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import * as membershipApi from "@/apis/membership";
import Button from "@/components/ui/Button";
import { IMembershipPlan } from "@/components/models/membership";
import { siteUrl } from "@/config/site";

type BankUrl = {
  _id?: string;
  name?: string;
  logo?: string;
  link: string;
};

type Invoice = {
  _id?: string;
  createdAt?: string;
  qr_image?: string;
  urls?: BankUrl[];
};

type CreateInvoiceResponse = Invoice & {
  invoice?: Invoice;
  payableAmount?: number;
  plan?: IMembershipPlan;
};

type MembershipStatusResponse = {
  active?: boolean;
  success?: boolean;
  isPayed?: boolean;
  isActive?: boolean;
  membership?: {
    plan?: IMembershipPlan;
  };
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isPaidStatus(res: MembershipStatusResponse | undefined): boolean {
  return !!(res?.active || res?.success || res?.isPayed || res?.isActive);
}

interface PaymentViewProps {
  planId: string;
}

export function PaymentView({ planId }: PaymentViewProps) {
  const router = useRouter();
  const { mutate: globalMutate } = useSWRConfig();
  const [checking, setChecking] = useState(false);

  type MembershipListResponse = {
    data?: IMembershipPlan[];
    plans?: IMembershipPlan[];
  };

  const { data: plansData } = useSWR<MembershipListResponse>(
    "swr.membership.plans",
    membershipApi.listMembershipPlans
  );

  const plans = plansData?.plans ?? plansData?.data ?? [];
  const targetPlan = plans.find((p) => p._id === planId);
  const price = targetPlan?.price;

  const {
    data: invoiceRes,
    isLoading: invoiceLoading
  } = useSWR<CreateInvoiceResponse>(
    price !== undefined ? `swr.membership.invoice.create.${planId}` : null,
    () => membershipApi.createMemberShipInvoice(planId),
    { revalidateOnFocus: false }
  );

  const {
    data: statusRes,
    isLoading: statusLoading,
    mutate: pollStatus,
  } = useSWR<MembershipStatusResponse>(
    "swr.membership.status",
    membershipApi.getMembershipStatus,
    {
      refreshInterval: (res) => (isPaidStatus(res) ? 0 : 5000),
      revalidateOnFocus: false,
      onSuccess: (res) => {
        if (isPaidStatus(res)) {
          message.success("Багц амжилттай идэвхжлээ");
          globalMutate("swr.membership.status");
          globalMutate(`${siteUrl}/users/me`);
          router.replace("/discover");
        }
      },
    }
  );

  const onCheck = async () => {
    setChecking(true);
    try {
      const res = await pollStatus();
      if (isPaidStatus(res)) {
        message.success("Багц амжилттай идэвхжлээ");
        globalMutate("swr.membership.status");
        globalMutate(`${siteUrl}/users/me`);
        router.replace("/discover");
      } else {
        message.error("⏳ Төлбөр хараахан баталгаажаагүй байна.");
      }
    } finally {
      setChecking(false);
    }
  };

  const invoice: Invoice = useMemo(() => {
    if (!invoiceRes) return {};
    return (invoiceRes.invoice ?? invoiceRes) as Invoice;
  }, [invoiceRes]);

  const selectedPlan: IMembershipPlan | null = invoiceRes?.plan ?? null;
  const payableAmount: number = Number(selectedPlan?.price ?? 0);
  const originalPrice: number = payableAmount * 2;

  const title = selectedPlan?.title ?? "Гишүүнчлэлийн багц";
  const months = selectedPlan?.months ?? 0;

  const qrImageBase64 = invoice?.qr_image || invoiceRes?.qr_image || undefined;
  const bankUrls: BankUrl[] = invoice?.urls || invoiceRes?.urls || [];
  const createdAt: string | undefined = invoice?.createdAt || invoiceRes?.createdAt;

  const amountText = payableAmount > 0 ? `${new Intl.NumberFormat("mn-MN").format(payableAmount)} ₮` : "--";

  useEffect(() => {
    if (isPaidStatus(statusRes)) {
      globalMutate(`${siteUrl}/users/me`);
      router.replace("/discover");
    }
  }, [statusRes, router, globalMutate]);

  const isPaid = isPaidStatus(statusRes);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);

  useEffect(() => {
    if (!createdAt) return;
    const createdMs = new Date(createdAt).getTime();
    if (!Number.isFinite(createdMs)) return;
    const EXPIRE_MS = 15 * 60 * 1000;
    const tick = () => {
      const now = Date.now();
      const leftMs = createdMs + EXPIRE_MS - now;
      const leftSec = Math.max(0, Math.floor(leftMs / 1000));
      setSecondsLeft(leftSec);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [createdAt]);

  const timeLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${pad2(m)}:${pad2(s)}`;
  }, [secondsLeft]);

  return (
    <div className="relative min-h-screen flex flex-col items-center w-full bg-[#050203] text-white overflow-x-hidden pt-10 pb-32">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-rose-500/10 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-lighten" />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <button
          onClick={() => router.push('/plans')}
          className="mb-8 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all group backdrop-blur-xl flex items-center gap-3 w-fit"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Буцах</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <Receipt size={20} className="text-rose-500" />
                  <h3 className="text-xl font-serif font-bold tracking-tight text-zinc-100">Захиалгын Мэдээлэл</h3>
                </div>

                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 shrink-0 overflow-hidden relative" style={{ backgroundImage: selectedPlan?.image?.url ? `url("${selectedPlan.image.url}")` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {!selectedPlan?.image?.url && <Flame size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-700" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold tracking-tight truncate">{title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md inline-block mt-2">{months} САРЫН ЭРХ</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 text-sm">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="font-bold uppercase tracking-widest text-[10px]">Үндсэн үнэ</span>
                    <span className="font-mono tracking-tighter">₮{originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-rose-500/80">
                    <span className="font-bold uppercase tracking-widest text-[10px]">Хөнгөлөлт</span>
                    <span className="font-mono tracking-tighter">-₮{(originalPrice - payableAmount).toLocaleString()}</span>
                  </div>
                  <div className="h-px w-full bg-white/5 my-4" />
                  <div className="flex items-end justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Нийт Төлөх</p>
                    <p className="text-4xl font-serif font-black tracking-tighter text-white leading-none">{amountText.replace('₮', '')}<span className="text-xl ml-1">₮</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-px rounded-[2.5rem] overflow-hidden group/main-card"
            >
              <div className="absolute inset-0 bg-linear-to-br from-rose-500/30 via-transparent to-purple-600/30 opacity-50" />
              <div className="relative bg-[#0a0506]/98 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center"><Smartphone size={24} className="text-rose-500" /></div>
                      <div>
                        <h2 className="text-2xl font-serif font-bold tracking-tight">Төлбөр төлөх</h2>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Digital Banking Checkout</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                      <Clock size={16} className="text-rose-500" /><span className="text-xs font-black font-mono tracking-widest text-zinc-300">{timeLabel}</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] mb-12">
                    <div className="relative shrink-0 group/qr">
                      <div className="absolute -inset-8 bg-rose-500/10 rounded-full blur-[60px] opacity-40 group-hover/qr:opacity-70 transition-opacity duration-700" />
                      <div className="relative p-5 bg-white rounded-3xl shadow-2xl">
                        {invoiceLoading ? (
                          <div className="w-48 h-48 bg-zinc-100 animate-pulse rounded-xl" />
                        ) : qrImageBase64 ? (
                          <img alt="Payment QR Code" className="w-48 h-48 mix-blend-multiply" src={`data:image/png;base64,${qrImageBase64}`} />
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center bg-zinc-50 rounded-xl text-zinc-400"><Smartphone size={32} className="opacity-20" /></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                      <h3 className="text-xl font-bold tracking-tight">QR-аар төлөх</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">Та өөрийн ашигладаг <span className="text-white">банкны апп-аар</span> QR кодыг уншуулан гүйлгээгээ хийнэ үү.</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Банк сонгох</h3>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    {bankUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {bankUrls.map((bank) => (
                          <a key={bank._id ?? bank.link} href={bank.link} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 p-3 rounded-2xl bg-white/3 border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
                            <div className="w-10 h-10 rounded-xl bg-white overflow-hidden p-1 flex items-center justify-center shrink-0">
                              {bank.logo ? <img className="w-full h-full object-contain" src={bank.logo} alt={bank.name} /> : <Smartphone size={16} className="text-zinc-400" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 truncate group-hover:text-white transition-colors">{bank.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-16">
                    <Button onClick={onCheck} disabled={invoiceLoading || statusLoading || checking} className={`w-full h-16 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 ${isPaid ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-black hover:bg-rose-500 hover:text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]'}`}>
                      {checking || statusLoading ? "ШАЛГАЖ БАЙНА..." : isPaid ? "ТӨЛӨГДСӨН" : "ТӨЛБӨР ШАЛГАХ"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
