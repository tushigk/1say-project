import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { RouteGuard } from "@/components/providers/RouteGuard";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://afterkiss.space'),
  title: "Шөнө дундын яриа: Өөрийгөө чөлөөл 🔥",
  description:
    "Хориотой сэдвээр нээлттэй ярилцаж, өөрийн нууцлаг эротик ертөнцийг нээх VIP бүс. Сэрэл хөдөлгөм тестүүд болон нийтлэлүүд. Одоо нэгдэхэд 50% хямдарлаа.",
  openGraph: {
    title: "Шөнө дундын яриа: Өөрийгөө чөлөөл 🔥",
    description:
      "Хориотой сэдвээр нээлттэй ярилцаж, өөрийн нууцлаг эротик ертөнцийг нээх VIP бүс. Сэрэл хөдөлгөм тестүүд болон нийтлэлүүд. Одоо нэгдэхэд 50% хямдарлаа.",
    url: "https://afterkiss.space",
    siteName: "AfterKiss",
    locale: "mn_MN",
    type: "website",
    images: [
      {
        url: "https://afterkiss.space/OgImage.jpeg",
        width: 1200,
        height: 630,
        alt: "Шөнө дундын яриа",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Шөнө дундын яриа: Өөрийгөө чөлөөл 🔥",
    description:
      "Хориотой сэдвээр нээлттэй ярилцаж, өөрийн нууцлаг эротик ертөнцийг нээх VIP бүс. Сэрэл хөдөлгөм тестүүд болон нийтлэлүүд. Одоо нэгдэхэд 50% хямдарлаа.",
    images: ["https://afterkiss.space/OgImage.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "https://afterkiss.space/favicon.jpeg",
    shortcut: "https://afterkiss.space/favicon.jpeg",
    apple: "https://afterkiss.space/favicon.jpeg",
  },
  keywords: [
    "Хайр",
    "Ганцаардал",
    "Хөгжилтэй",
    "Түүхүүд",
    "Нийтлэл",
    "Хэлэлцүүлэг",
    "",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable} ${notoSans.variable}`}>
      <body className="min-h-screen bg-velvet-dark text-white antialiased overflow-x-hidden selection:bg-primary selection:text-white">
        <AuthProvider>
          <SocketProvider>
            <RouteGuard>
              {children}
            </RouteGuard>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
