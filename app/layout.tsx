import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/lib/providers";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { BackToTop } from "@/app/components/layout/BackToTop";
import { CompareBar } from "@/app/components/layout/CompareBar";
import { dealership } from "@/app/config/dealership";

const TITLE = `${dealership.name} — Buy Quality Used Cars in Nigeria`;
const DESCRIPTION =
  "LegitAutos is a car dealership offering quality used and new vehicles. Browse our inventory, compare cars, and talk to our team about any vehicle.";

export const metadata: Metadata = {
  metadataBase: new URL(dealership.siteUrl),
  title: {
    default: TITLE,
    template: `%s | ${dealership.name}`,
  },
  description: DESCRIPTION,
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
        alt: `${dealership.name} — quality used cars`,
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
