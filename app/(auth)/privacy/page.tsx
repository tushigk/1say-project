"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Shield, FileText } from "lucide-react";

const Page = () => {
  const updated = "2026-01-16";

  const toc: Array<{ label: string; href: string }> = [
    { label: "1. Тодорхойлолт", href: "#def" },
    { label: "2. 18+ эрх бүхий хэрэглэгч", href: "#elig" },
    { label: "3. Үйлчилгээний хүрээ", href: "#service" },
    { label: "4. Бүртгэл ба профайл", href: "#account" },
    { label: "5. Багц, төлбөр, буцаалт", href: "#subs" },
    { label: "6. Форум/чат дүрэм", href: "#community" },
    { label: "7. Контент ба оюуны өмч", href: "#content" },
    { label: "8. Хувийн мэдээлэл ба нууцлал", href: "#privacy" },
    { label: "9. Эрүүл мэндийн анхааруулга", href: "#health" },
    { label: "10. Хариуцлага хязгаарлалт", href: "#liability" },
    { label: "11. Түдгэлзүүлэх/цуцлах", href: "#termination" },
    { label: "12. Хууль, маргаан", href: "#law" },
    { label: "13. Холбоо барих", href: "#contact" },
  ];

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-white">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05),transparent_55%)]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* top bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <ChevronLeft className="h-4 w-4" />
            Буцах
          </Link>

          <div className="text-xs text-white/50">
            Сүүлд шинэчилсэн: <span className="text-white/70">{updated}</span>
          </div>
        </div>

        {/* layout */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* sidebar */}
          <aside className="lg:sticky lg:top-8 self-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-white/70" />
                <h2 className="text-sm font-semibold text-white/90">Үйлчилгээний Нөхцөл</h2>
              </div>

              <div className="mt-4 mb-4 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                <p className="mb-1 font-medium text-white/80">
                  <span className="font-semibold text-accent-crimson">⚠️ 18+ шаардлага:</span>
                </p>
                AfterKiss нь <span className="font-semibold text-white">зөвхөн насанд хүрэгчдэд (18+)</span> зориулагдсан. 18 нас хүрээгүй этгээд ашиглахыг хориглоно.
              </div>

              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {toc.map((t) => (
                  <a
                    key={t.href}
                    href={t.href}
                    className="block rounded-lg px-2 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {t.label}
                  </a>
                ))}
              </nav>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                <div className="mb-1 font-medium text-white/80">Холбоо барих</div>
                support.afterkiss@gmail.com
              </div>
            </div>
          </aside>

          {/* content */}
          <section className="rounded-2xl border border-white/10 bg-white/5">
            <header className="border-b border-white/10 p-6 sm:p-8">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl mb-4">
                Үйлчилгээний Нөхцөл (2026)
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Энэхүү “Үйлчилгээний Нөхцөл” нь AfterKiss платформ (“Платформ”,
                “Үйлчилгээ”, “Бид”)-ын нийтлэл, өгүүллэг, видео/кино, quiz, форум,
                групп чат, хувийн чат зэрэг боломжуудыг ашиглахтай холбоотой эрх,
                үүргийг зохицуулна. Үйлчилгээг ашигласнаар та эдгээр нөхцөлийг уншиж,
                ойлгож, хүлээн зөвшөөрсөнд тооцогдоно.
              </p>
            </header>

            <div className="space-y-10 p-6 sm:p-8">
              {/* Provider Info Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="font-semibold text-white/90 text-sm">Үйлчилгээ үзүүлэгч</p>
                  <p className="mt-1 text-sm text-white/70">
                    Хувь хүн: <span className="font-semibold text-white/90">Түшиг</span>
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Хаяг: <span className="font-semibold text-white/90">Улаанбаатар, Монгол Улс</span>
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="font-semibold text-white/90 text-sm">Холбоо барих</p>
                  <p className="mt-1 text-sm text-white/70">
                    И-мэйл: <a href="mailto:support.afterkiss@gmail.com" className="text-accent-champagne hover:underline">support.afterkiss@gmail.com</a>
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Вэбсайт: <a href="https://afterkiss.space" target="_blank" rel="noreferrer" className="text-accent-champagne hover:underline">afterkiss.space</a>
                  </p>
                  <p className="mt-2 text-xs text-white/50">
                    (Бүртгэлд утас/и-мэйл шаардахгүй. Дэмжлэг хэрэгтэй үед хэрэглэгч өөрөө дээрх и-мэйлээр холбогдоно.)
                  </p>
                </div>
              </div>

              {/* 1 */}
              <div id="def" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white/50" />
                  1. Тодорхойлолт
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80 bg-white/5 rounded-xl p-4 border border-white/5">
                  <p>
                    <span className="font-semibold text-white/90">“AfterKiss/Платформ/Үйлчилгээ”</span> гэдэг нь afterkiss.space дээрх нийтлэл, өгүүллэг, видео/кино, quiz,
                    форум, групп чат, хувийн чат зэрэг дижитал боломжуудыг хэлнэ.
                  </p>
                  <p>
                    <span className="font-semibold text-white/90">“Хэрэглэгч”</span> гэдэг нь Платформд
                    бүртгүүлсэн эсвэл ашиглаж буй этгээд.
                  </p>
                  <p>
                    <span className="font-semibold text-white/90">“Контент”</span> гэдэг нь Платформ дээр
                    байрших аливаа текст, зураг, видео, аудио, сэтгэгдэл, пост, мессеж.
                  </p>
                </div>
              </div>

              {/* 2 */}
              <div id="elig" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">2. 18+ эрх бүхий хэрэглэгч</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    2.1. AfterKiss нь <span className="font-semibold text-white/90">зөвхөн 18 ба түүнээс дээш</span> насны
                    хэрэглэгчид зориулсан.
                  </p>
                  <p>
                    2.2. Та бүртгэл үүсгэх үедээ өөрийн насыг оруулж, 18+ гэдгээ <span className="font-semibold text-white/90">өөрөө батлан зөвшөөрнө</span>.
                  </p>
                  <p>
                    2.3. Насанд хүрээгүй этгээд ашигласан нь тогтоогдвол Бид тухайн
                    аккаунтыг <span className="font-semibold text-white/90">нэн даруй түдгэлзүүлэх/устгах</span> эрхтэй.
                  </p>
                </div>
              </div>

              {/* 3 */}
              <div id="service" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">3. Үйлчилгээний хүрээ</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    3.1. Үйлчилгээ нь насанд хүрэгчдэд зориулсан бэлгийн эрүүл мэндийн
                    боловсролын контент (нийтлэл, танин мэдэхүй, quiz гэх мэт) болон
                    хэрэглэгчдийн харилцааны хэсэг (форум, групп чат, хувийн чат)-ээс
                    бүрдэж болно.
                  </p>
                  <p>
                    3.2. Бид үйлчилгээний боломж, контентын төрөл, интерфэйсийг өөрчлөх,
                    шинэчлэх, нэмэх/хасах эрхтэй.
                  </p>
                  <p>
                    3.3. Зарим боломжууд (жишээ: премиум контент, форум/чатны нэмэлт
                    функц) нь <span className="font-semibold text-white/90">идэвхтэй багцтай</span> үед
                    нээгдэнэ.
                  </p>
                </div>
              </div>

              {/* 4 */}
              <div id="account" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">4. Бүртгэл ба профайл</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    4.1. Хэрэглэгч өөрийн зохиосон <span className="font-semibold text-white/90">username</span> болон <span className="font-semibold text-white/90">нууц үг</span>-ээр бүртгүүлнэ.
                  </p>
                  <p>
                    4.2. Бүртгэл үүсгэхэд <span className="font-semibold text-white/90">утас, и-мэйл</span> шаардахгүй.
                  </p>
                  <p>
                    4.3. Профайлд хэрэглэгчийн <span className="font-semibold text-white/90">нас, хүйс, сонирхдог хүйс</span> зэрэг
                    мэдээлэл байж болно (8-р хэсгийг үз).
                  </p>
                  <p>
                    4.4. Та нууц үгээ бусдад дамжуулахгүй байх, аккаунтандаа
                    зөвшөөрөлгүй нэвтрэлт болсон гэж үзвэл нэн даруй Бидэнд мэдэгдэх
                    үүрэгтэй.
                  </p>
                  <p>
                    4.5. Платформ дээрх бусад хэрэглэгчтэй танилцах, групп/форумоос
                    хэрэглэгч хайх, хувийн чат бичих боломжтой. Та өөрийн харилцааны
                    аюулгүй байдлыг өөрөө хангана.
                  </p>
                </div>
              </div>

              {/* 5 */}
              <div id="subs" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">5. Багц, төлбөр, буцаалт</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    5.1. Хэрэглэгч <span className="font-semibold text-white/90">1 сар, 3 сар, 12 сарын</span> багц
                    худалдан авч үйлчилгээ авна.
                  </p>
                  <p>
                    5.2. Үнийн мэдээлэл, багцын хамрах хүрээ нь Платформ дээр
                    нийтлэгдсэнээр хүчинтэй байна.
                  </p>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                    <p className="font-semibold text-red-400">5.3. Мөнгө буцаан олгохгүй</p>
                    <p className="mt-1 text-white/70">
                      Хэрэглэгч багц худалдан авснаас хойш хугацаа, хэрэглээний
                      түвшингээс үл хамааран төлбөрийг буцаан олгохгүй. Гэхдээ Монгол
                      Улсын холбогдох хууль тогтоомжийн дагуу зайлшгүй буцаалт
                      шаардагдах тохиолдолд хуульд нийцүүлэн шийдвэрлэнэ.
                    </p>
                  </div>
                  <p>
                    5.4. Төлбөрийн гүйлгээ нь гуравдагч этгээдийн төлбөрийн үйлчилгээ
                    (банк/платформ)-ээс хамаарч болох ба төлбөрийн маргаан гарвал
                    гүйлгээний мэдээллээр хамтран шалгана.
                  </p>
                </div>
              </div>

              {/* 6 */}
              <div id="community" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">6. Форум/чат дүрэм</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    6.1. Хэрэглэгч форум дээр пост бичих/унших, групп чат болон хувийн
                    чат ашиглах боломжтой.
                  </p>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="font-semibold text-white/90 mb-2">6.2. Хориглосон үйлдлүүд</p>
                    <ul className="list-disc pl-5 space-y-1 text-white/70">
                      <li>
                        <span className="font-semibold text-white/90">Насанд хүрээгүй (18-аас доош)</span> этгээдтэй холбоотой аливаа контент, харилцаа, санал, зохион байгуулалт.
                      </li>
                      <li>
                        Доромжлол, дарамт, сүрдүүлэг, ялгаварлан гадуурхалт, stalking, шантааж.
                      </li>
                      <li>
                        Бусдын хувийн мэдээлэл задруулах (бодит нэр, хаяг, сургууль/ажлын газар, холбоо барих мэдээлэл гэх мэт), doxxing.
                      </li>
                      <li>Залилан, спам, хууль бус үйлчилгээ/бараа сурталчлах.</li>
                      <li>
                        Зөвшөөрөлгүй бичлэг/скриншот тараах, хувийн чатны агуулгыг нийтэд ил болгох.
                      </li>
                    </ul>
                    <p className="mt-3 text-xs text-white/50">
                      Бид боловсролын зорилготой хэлэлцүүлгийг дэмжих боловч олон
                      нийтийн орчинд бусдыг эвгүй байдалд оруулах, дарамтлах, хууль
                      зөрчих шинжтэй контентыг хязгаарлах/устгах боломжтой.
                    </p>
                  </div>

                  <p>
                    6.3. Бид контентыг хянах (модераци), дүрэм зөрчсөн пост/мессежийг
                    устгах, хэрэглэгчийг анхааруулах, түр/бүр мөсөн хаах эрхтэй.
                  </p>
                  <p>
                    6.4. Та зөрчилтэй гэж үзсэн контентыг Платформын “Report/Мэдэгдэх”
                    функцээр мэдэгдэж болно.
                  </p>
                </div>
              </div>

              {/* 7 */}
              <div id="content" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">7. Контент ба оюуны өмч</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    7.1. Платформын дизайн, код, лого, Бидний бүтээсэн контент нь Бидний
                    болон/эсвэл эрх бүхий этгээдийн оюуны өмч байна.
                  </p>
                  <p>
                    7.2. Хэрэглэгч өөрийн нийтэлсэн контентын эрхийн эзэн хэвээр байх
                    бөгөөд Платформын хэвийн ажиллагаанд шаардлагатай хэмжээнд
                    (хадгалах, нийтлэх, түгээх, дүрслэх) ашиглах <span className="font-semibold text-white/90">хязгаарлагдмал, шимтгэлгүй лиценз</span>-ийг Бидэнд олгоно.
                  </p>
                  <p>
                    7.3. Та гуравдагч этгээдийн эрхийг (зохиогчийн эрх, нэр төр,
                    нууцлал) зөрчсөн контент нийтлэхгүй байх үүрэгтэй.
                  </p>
                </div>
              </div>

              {/* 8 */}
              <div id="privacy" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">8. Хувийн мэдээлэл ба нууцлал</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    8.1. Бид Монгол Улсын <span className="font-semibold text-white/90">“Хүний хувийн мэдээлэл хамгаалах тухай”</span> хууль болон холбогдох хууль тогтоомжийн хүрээнд мэдээлэл цуглуулах,
                    боловсруулах, хамгаалахыг зорьно.
                  </p>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="font-semibold text-white/90 mb-2">8.2. Бидний авч болох мэдээлэл</p>
                    <ul className="list-disc pl-5 space-y-1 text-white/70">
                      <li><span className="font-semibold text-white/90">Username</span> (бүртгэл/таних зориулалттай)</li>
                      <li><span className="font-semibold text-white/90">Нууц үг</span> (аюулгүй байдлаар хэшлэгдсэн хэлбэрээр хадгална)</li>
                      <li><span className="font-semibold text-white/90">Нас</span> (18+ шалгах/тохируулах зорилгоор)</li>
                      <li><span className="font-semibold text-white/90">Хүйс</span> (сонголтот/тохиргооны зорилгоор)</li>
                      <li><span className="font-semibold text-white/90">Сонирхдог хүйс</span> (сонголтот/тааруулалт/хайлт зэрэг боломжийн зорилгоор)</li>
                    </ul>
                    <p className="mt-3 text-xs text-white/50">
                      <span className="font-semibold text-white/80">Бүртгэлд утас, и-мэйл шаардахгүй.</span> Гэхдээ системийн аюулгүй байдал, зөрчил илрүүлэх зорилгоор
                      техникийн лог/сессийн мэдээлэл үүсч болно. Хэрэглэгч дэмжлэг
                      авахын тулд и-мэйлээр бичвэл тухайн харилцааны хүрээнд и-мэйл хаяг
                      харагдаж болно.
                    </p>
                  </div>
                  <p>
                    8.3. Бид мэдээллийг үйлчилгээ үзүүлэх, аюулгүй байдал хангах,
                    модераци хийх, хууль ёсны шаардлага биелүүлэх зорилгоор ашиглаж
                    болно.
                  </p>
                  <p>
                    8.4. Хэрэглэгч өөрийн мэдээлэлд хандах, засварлах, устгуулах хүсэлт
                    гаргах эрхтэй бөгөөд боломжит хэмжээнд, хуульд нийцүүлэн
                    шийдвэрлэнэ.
                  </p>
                </div>
              </div>

              {/* 9 */}
              <div id="health" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">9. Эрүүл мэндийн анхааруулга</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    9.1. Платформ дахь мэдээлэл нь <span className="font-semibold text-white/90">ерөнхий боловсролын</span> зориулалттай
                    бөгөөд эмчийн онош, эмчилгээний зөвлөгөөг орлохгүй.
                  </p>
                  <p>
                    9.2. Эрүүл мэндийн зовиур, яаралтай нөхцөл байдал үүсвэл мэргэжлийн
                    эмч, эрүүл мэндийн байгууллагад хандана.
                  </p>
                  <p>
                    9.3. Форум/чат дахь бусад хэрэглэгчийн санал нь тухайн хүний хувь
                    байр суурь бөгөөд Бид баталгаажуулахгүй.
                  </p>
                </div>
              </div>

              {/* 10 */}
              <div id="liability" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">10. Хариуцлага хязгаарлалт</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    10.1. Үйлчилгээ “байгаагаараа” нөхцөлөөр 제공логдоно. Тасалдал,
                    алдаа, гуравдагч этгээдийн үйлдлээс үүдэх эрсдэлийг бүрэн арилгана
                    гэж Бид баталгаа өгөхгүй.
                  </p>
                  <p>
                    10.2. Хуульд зөвшөөрөгдөх дээд хэмжээнд Бид шууд бус хохиролд
                    (ашгийн алдагдал, өгөгдлийн алдагдал гэх мэт) хариуцлага хүлээхгүй.
                  </p>
                  <p>
                    10.3. Хэрэглэгч өөрийн нийтэлсэн контент, харилцаанаас үүдэх үр
                    дагаврыг өөрөө хариуцна.
                  </p>
                </div>
              </div>

              {/* 11 */}
              <div id="termination" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">11. Түдгэлзүүлэх/цуцлах</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    11.1. Хэрэглэгч үйлчилгээ ашиглахаа зогсоож болно. (5-р хэсгийн
                    “буцаалтгүй” нөхцөл үйлчилнэ.)
                  </p>
                  <p>
                    11.2. Дүрэм зөрчсөн, бусдад хор хохирол учруулж болзошгүй, хууль бус
                    үйлдэл гэж үзвэл Бид аккаунтыг түр/бүр мөсөн хаах эрхтэй.
                  </p>
                  <p>
                    11.3. Хаалт/түдгэлзүүлэлтийн үед хуульд заасан шаардлагын хүрээнд
                    өгөгдөл хадгалах хэрэгцээ үүсэж болно.
                  </p>
                </div>
              </div>

              {/* 12 */}
              <div id="law" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">12. Хууль, маргаан</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    12.1. Энэхүү Нөхцөл болон Үйлчилгээтэй холбоотой харилцаанд <span className="font-semibold text-white/90">Монгол Улсын хууль</span> хэрэглэнэ.
                  </p>
                  <p>
                    12.2. Маргааныг эхлээд эвлэрүүлэн шийдвэрлэхийг зорих бөгөөд
                    эвлэрэлд хүрэхгүй бол Монгол Улсын харьяалах шүүхэд хандана.
                  </p>
                  <p className="text-white/60 text-xs">
                    12.3. Бид хууль тогтоомжийн өөрчлөлт, үйл ажиллагааны шаардлагад
                    нийцүүлэн энэхүү нөхцөлийг шинэчилж болно. Шинэчилсэн хувилбар
                    Платформ дээр нийтлэгдсэн даруй хүчинтэй.
                  </p>
                </div>
              </div>

              {/* 13 */}
              <div id="contact" className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold">13. Холбоо барих</h2>
                <div className="space-y-3 text-sm leading-relaxed text-white/80">
                  <p>
                    Төлбөр, эрх, модераци, контент, нууцлалтай холбоотой санал хүсэлт
                    гаргах бол:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      И-мэйл: <a href="mailto:support.afterkiss@gmail.com" className="text-accent-champagne hover:underline">support.afterkiss@gmail.com</a>
                    </li>
                    <li>
                      Вэбсайт: <a href="https://afterkiss.space" target="_blank" rel="noreferrer" className="text-accent-champagne hover:underline">afterkiss.space</a>
                    </li>
                    <li>Хаяг: Улаанбаатар, Монгол Улс</li>
                  </ul>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </main>
  );
};

export default Page;
