import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/lib/providers";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { BackToTop } from "@/app/components/layout/BackToTop";
import { CompareBar } from "@/app/components/layout/CompareBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://legitautomobile.com"),
  title: {
    default: "LegitAutos — Nigeria's #1 Car Marketplace",
    template: "%s | LegitAutos",
  },
  description:
    "Browse thousands of verified vehicles from trusted sellers across Nigeria. Buy, sell, or request cars — all in one place.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://legitautomobile.com",
    siteName: "LegitAutos",
    title: "LegitAutos — Nigeria's #1 Car Marketplace",
    description:
      "Browse thousands of verified vehicles from trusted sellers across Nigeria. Buy, sell, or request cars — all in one place.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LegitAutos — Nigeria's #1 Car Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LegitAutos — Nigeria's #1 Car Marketplace",
    description:
      "Browse thousands of verified vehicles from trusted sellers across Nigeria.",
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
    canonical: "https://legitautomobile.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased bg-white text-dark-900">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <CompareBar />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
