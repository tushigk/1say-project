import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
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

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shunu.zurhai.com'),
  title: "Шөнийн таалал: Өөрийгөө чөлөөл 🔥",
  description:
    "Хориотой сэдвээр нээлттэй ярилцаж, өөрийн нууцлаг эротик ертөнцийг нээх VIP бүс. Сэрэл хөдөлгөм тестүүд болон нийтлэлүүд.",
  openGraph: {
    title: "Шөнийн таалал: Өөрийгөө чөлөөл 🔥",
    description:
      "Хориотой сэдвээр нээлттэй ярилцаж, өөрийн нууцлаг эротик ертөнцийг нээх VIP бүс. Сэрэл хөдөлгөм тестүүд болон нийтлэлүүд.",
    url: "https://shunu.zurhai.com",
    siteName: "Шөнийн таалал",
    locale: "mn_MN",
    type: "website",
    images: [
      {
        url: "https://shunu.zurhai.com/OgImage.jpeg",
        width: 1200,
        height: 630,
        alt: "Шөнийн таалал",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Шөнийн таалал: Өөрийгөө чөлөөл 🔥",
    description:
      "Хориотой сэдвээр нээлттэй ярилцаж, өөрийн нууцлаг эротик ертөнцийг нээх VIP бүс. Сэрэл хөдөлгөм тестүүд болон нийтлэлүүд.",
    images: ["https://shunu.zurhai.com/OgImage.jpeg"],
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
    icon: "https://shunu.zurhai.com/favicon.jpeg",
    shortcut: "https://shunu.zurhai.com/favicon.jpeg",
    apple: "https://shunu.zurhai.com/favicon.jpeg",
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
    <html lang="en" className={`dark ${plusJakartaSans.variable} ${fraunces.variable}`}>
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
