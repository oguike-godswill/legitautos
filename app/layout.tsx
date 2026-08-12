"use client";

import { useState, useEffect, useCallback } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/lib/providers";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { BackToTop } from "@/app/components/layout/BackToTop";
import { CompareBar } from "@/app/components/layout/CompareBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>LegitVenture Autos — Nigeria&apos;s #1 Car Marketplace</title>
        <meta
          name="description"
          content="Browse thousands of verified vehicles from trusted sellers across Nigeria. Buy, sell, or request cars — all in one place."
        />
      </head>
      <body className={`${inter.className} antialiased bg-white text-dark-900`}>
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
