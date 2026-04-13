'use client';

import { X } from 'lucide-react';

interface TermOfServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermOfServiceModal({ isOpen, onClose }: TermOfServiceModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <div
                className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h3 className="text-xl font-bold text-white">Үйлчилгээний нөхцөл</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto text-zinc-400 space-y-6 text-sm leading-relaxed">
                    <section>
                        <h4 className="text-white font-bold mb-2">1. Насны хязгаар</h4>
                        <p>Та энэхүү үйлчилгээг ашиглахын тулд 18 нас хүрсэн байх ёстой. Нас тодорхойлох явцад худал мэдээлэл өгсөн тохиолдолд бүртгэлийг шууд устгах болно.</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold mb-2">2. Нууцлал ба Аюулгүй байдал</h4>
                        <p>AfterKiss нь хэрэглэгчдийн нууцлалыг дээд зэргээр хангадаг. Таны хувийн мэдээлэл болон чатын түүх гуравдагч этгээдэд задрахгүй.</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold mb-2">3. Зүй бус үйлдэл</h4>
                        <p>Бусдыг доромжлох, дарамтлах, зөвшөөрөлгүй мэдээлэл түгээх зэрэг үйлдлийг хатуу хориглоно.</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold mb-2">4. Төлбөр тооцоо</h4>
                        <p>VIP гишүүнчлэлийн төлбөр нь эргүүлэн олгогдохгүй бөгөөд зөвхөн сонгосон хугацаанд хүчинтэй байна.</p>
                    </section>
                </div>

                <div className="p-6 border-t border-zinc-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
                    >
                        Хаах
                    </button>
                </div>
            </div>
        </div>
    );
}
