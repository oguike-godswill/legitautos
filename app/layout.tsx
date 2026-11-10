import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/lib/providers";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { BackToTop } from "@/app/components/layout/BackToTop";
import { CompareBar } from "@/app/components/layout/CompareBar";
import { MobileBottomNav } from "@/app/components/layout/MobileBottomNav";
import { SavedDrawer } from "@/app/components/layout/SavedDrawer";
import { CommandSearch } from "@/app/components/layout/CommandSearch";
import { SmoothScrollProvider } from "@/app/components/layout/SmoothScrollProvider";
import { ScrollProgressBar } from "@/app/components/layout/ScrollProgressBar";
import { dealership } from "@/app/config/dealership";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["500", "600", "700"],
});

const TITLE = `${dealership.name} — Buy Verified Used & New Cars in Lagos, Nigeria`;
const DESCRIPTION =
  "LegitAutos is a premier Lagos automotive showroom offering inspected Foreign Used (Tokunbo), Nigerian Used, and Brand New vehicles in Lagos, Nigeria.";

export const viewport: Viewport = {
  themeColor: "#0C0C0E",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(dealership.siteUrl),
  title: {
    default: TITLE,
    template: `%s | ${dealership.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    "buy cars in Lagos",
    "used cars Nigeria",
    "foreign used cars Lagos",
    "tokunbo cars Lagos",
    "LegitAutos dealership",
    "buy Toyota Lagos",
    "buy Lexus Lagos",
    "car trade in Nigeria",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: dealership.siteUrl,
    siteName: dealership.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${dealership.name} — verified cars in Nigeria`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: dealership.siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrains.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#F6F4EF] text-[#0C0C0E] pb-16 md:pb-0 selection:bg-[#D9381E] selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-[#D9381E] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <SmoothScrollProvider>
          <ScrollProgressBar />
          <Providers>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <CommandSearch />
            <SavedDrawer />
            <CompareBar />
            <MobileBottomNav />
            <BackToTop />
          </Providers>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
