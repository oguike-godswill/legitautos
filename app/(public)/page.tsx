import { Metadata } from "next";
import { SearchFirstLanding } from "@/app/components/sections/SearchFirstLanding";

export const metadata: Metadata = {
  title: "LegitAutos — Nigeria's #1 Car Marketplace",
  description:
    "Browse thousands of verified vehicles from trusted sellers across Nigeria. Buy, sell, or request cars — all in one place.",
  openGraph: {
    title: "LegitAutos — Nigeria's #1 Car Marketplace",
    description: "Browse thousands of verified vehicles from trusted sellers across Nigeria.",
    url: "https://legitautomobile.com",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://legitautomobile.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "LegitAutos",
  url: "https://legitautomobile.com",
  logo: "https://legitautomobile.com/logo.png",
  description:
    "Nigeria's trusted car marketplace connecting buyers and sellers since 2018.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressRegion: "Lagos State",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
  sameAs: [],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SearchFirstLanding />
    </>
  );
}
