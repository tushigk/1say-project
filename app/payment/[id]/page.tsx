"use client";

import { use, useEffect, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { ChevronLeft, ShieldCheck, Zap, Receipt, Smartphone, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import * as membershipApi from "@/apis/membership";
import Button from "@/components/ui/Button";
import { IMembershipPlan } from "@/components/models/membership";

type BankUrl = {
  _id?: string;
  name?: string;
  logo?: string;
  link: string;
};

type Invoice = {
  _id?: string;
  createdAt?: string;
  qr_image?: string; // base64
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

export default function PaymentPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
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
  const targetPlan = plans.find((p) => p._id === params.id);
  const price = targetPlan?.price;

  const {
    data: invoiceRes,
    isLoading: invoiceLoading
  } = useSWR<CreateInvoiceResponse>(
    price !== undefined ? `swr.membership.invoice.create.${params.id}` : null,
    () => membershipApi.createMemberShipInvoice(params.id!),
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
          router.replace("/payment-success");
        }
      },
    }
  );

  // Manual check
  const onCheck = async () => {
    setChecking(true);
    try {
      const res = await pollStatus();
      if (isPaidStatus(res)) {
        message.success("Багц амжилттай идэвхжлээ");
        globalMutate("swr.membership.status");
        router.replace("/payment-success");
      } else {
        message.error("⏳ Төлбөр хараахан баталгаажаагүй байна.");
      }
    } finally {
      setChecking(false);
    }
  };

  // Normalize invoice response shapes
  const invoice: Invoice = useMemo(() => {
    if (!invoiceRes) return {};
    return (invoiceRes.invoice ?? invoiceRes) as Invoice;
  }, [invoiceRes]);

  const selectedPlan: IMembershipPlan | null = invoiceRes?.plan ?? null;

  const payableAmount: number = Number(selectedPlan?.price ?? 0);
  const originalPrice: number = Number(selectedPlan?.price ?? 0);

  const title = selectedPlan?.title ?? "Гишүүнчлэлийн багц";
  const months = selectedPlan?.months ?? 0;

  const qrImageBase64 =
    invoice?.qr_image || invoiceRes?.qr_image || undefined;

  const bankUrls: BankUrl[] =
    invoice?.urls || invoiceRes?.urls || [];

  const invoiceId: string | undefined =
    invoice?._id || invoiceRes?._id;

  const createdAt: string | undefined = invoice?.createdAt || invoiceRes?.createdAt;

  const amountText =
    payableAmount > 0
      ? `${new Intl.NumberFormat("mn-MN").format(payableAmount)} ₮`
      : "--";

  // Redirect if already paid
  useEffect(() => {
    if (isPaidStatus(statusRes)) router.replace("/");
  }, [statusRes, router]);

  const isPaid = isPaidStatus(statusRes);

  // Countdown: 15 minutes from createdAt (optional)
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
    <div className="relative min-h-screen flex flex-col items-center w-full bg-[#050203] text-white overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-rose-500/10 rounded-full blur-[160px] mix-blend-screen" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-lighten" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
      </div>
      {/* Premium Header / Navigation */}

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Order Summary (Context) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px]" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <Receipt size={20} className="text-rose-500" />
                  <h3 className="text-xl font-serif font-bold tracking-tight text-zinc-100">Захиалгын Мэдээлэл</h3>
                </div>

                {/* Plan Info Card */}
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 mb-8">
                  <div
                    className="w-16 h-16 rounded-2xl bg-zinc-800 shrink-0 overflow-hidden relative"
                    style={{
                      backgroundImage: selectedPlan?.image?.url ? `url("${selectedPlan.image.url}")` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!selectedPlan?.image?.url && <Flame size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-700" />}
                    <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold tracking-tight truncate">{title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md inline-block mt-2">
                      {months} САРЫН ЭРХ
                    </span>
                  </div>
                </div>

                {/* Price Table */}
                <div className="space-y-4 mb-10 text-sm">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="font-bold uppercase tracking-widest text-[10px]">Үндсэн үнэ</span>
                    <span className="font-mono tracking-tighter">₮{originalPrice.toLocaleString()}</span>
                  </div>

                  {payableAmount !== originalPrice && (
                    <div className="flex items-center justify-between text-rose-500/80">
                      <span className="font-bold uppercase tracking-widest text-[10px]">Хөнгөлөлт</span>
                      <span className="font-mono tracking-tighter">-₮{(originalPrice - payableAmount).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="h-px w-full bg-white/5 my-4" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Нийт Төлөх</p>
                      <span className="text-zinc-500 text-[10px] font-bold">MNT</span>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-serif font-black tracking-tighter text-white leading-none">
                        {amountText.replace('₮', '')}
                        <span className="text-xl ml-1">₮</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-colors">
                    <ShieldCheck size={20} className="text-zinc-600 group-hover:text-emerald-500/70 transition-colors mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">SSL SEcure</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-colors">
                    <Zap size={20} className="text-zinc-600 group-hover:text-amber-500/70 transition-colors mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Instant Activation</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Нэхэмжлэх №</span>
                    <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[120px]">{invoiceId || "--"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: QR & Banks (Action Area) */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-px rounded-[2.5rem] overflow-hidden group/main-card"
            >
              <div className="absolute inset-0 bg-linear-to-br from-rose-500/30 via-transparent to-purple-600/30 opacity-50 group-hover/main-card:opacity-100 transition-opacity duration-700" />

              <div className="relative bg-[#0a0506]/98 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                        <Smartphone size={24} className="text-rose-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif font-bold tracking-tight">Төлбөр төлөх</h2>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Digital Banking Checkout</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                      <Clock size={16} className="text-rose-500" />
                      <span className="text-xs font-black font-mono tracking-widest text-zinc-300">{timeLabel}</span>
                    </div>
                  </div>

                  {/* QR Presentation */}
                  <div className="flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] mb-12">
                    <div className="relative shrink-0 group/qr">
                      <div className="absolute -inset-8 bg-rose-500/10 rounded-full blur-[60px] opacity-40 group-hover/qr:opacity-70 transition-opacity duration-700" />
                      <div className="relative p-5 bg-white rounded-3xl shadow-2xl transition-all duration-700 group-hover/qr:scale-[1.03]">
                        {invoiceLoading ? (
                          <div className="w-48 h-48 bg-zinc-100 animate-pulse rounded-xl" />
                        ) : qrImageBase64 ? (
                          <img
                            alt="Payment QR Code"
                            className="w-48 h-48 mix-blend-multiply"
                            src={`data:image/png;base64,${qrImageBase64}`}
                          />
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center bg-zinc-50 rounded-xl text-zinc-400">
                            <Smartphone size={32} className="opacity-20" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-6 text-center lg:text-left">
                      <h3 className="text-xl font-bold tracking-tight">QR-аар төлөх</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        Та өөрийн ашигладаг <span className="text-white">банкны апп-аар</span> QR кодыг уншуулан гүйлгээгээ хийнэ үү.
                      </p>
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-rose-500">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Аюулгүй Гүйлгээ</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Direct Links */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Банк сонгох</h3>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>

                    {invoiceLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                        ))}
                      </div>
                    ) : bankUrls.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {bankUrls.map((bank) => (
                          <a
                            key={bank._id ?? bank.link}
                            href={bank.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-3 rounded-2xl bg-white/3 border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white overflow-hidden p-1 flex items-center justify-center shrink-0">
                              {bank.logo ? (
                                <img className="w-full h-full object-contain" src={bank.logo} alt={bank.name} />
                              ) : (
                                <Smartphone size={16} className="text-zinc-400" />
                              )}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 truncate group-hover:text-white transition-colors">{bank.name}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 rounded-3xl bg-white/2 border border-dashed border-white/5 text-center">
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Холбоосууд олдсонгүй</p>
                      </div>
                    )}
                  </div>

                  {/* Status & Verify */}
                  <div className="mt-16">
                    <Button
                      onClick={onCheck}
                      disabled={invoiceLoading || statusLoading || checking}
                      className={`
                        w-full h-16 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700
                        ${isPaid
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-white text-black hover:bg-rose-500 hover:text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]'
                        }
                      `}
                    >
                      {checking || statusLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                          <span>ШАЛГАЖ БАЙНА...</span>
                        </div>
                      ) : isPaid ? (
                        <div className="flex items-center justify-center gap-2">
                          <ShieldCheck size={18} />
                          <span>ТӨЛӨГДСӨН</span>
                        </div>
                      ) : "ТӨЛБӨР ШАЛГАХ"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="w-full max-w-7xl mx-auto px-12 py-12 flex items-center justify-center opacity-20">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />
        <span className="mx-8 font-serif italic text-sm tracking-widest">Noir Premium Experience</span>
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-white/20 to-transparent" />
      </footer>
    </div>
  );
}
