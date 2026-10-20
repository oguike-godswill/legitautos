import { Metadata } from "next";
import { SearchFirstLanding } from "@/app/components/sections/SearchFirstLanding";
import { dealership } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: `${dealership.name} — Buy Quality Used Cars in Nigeria`,
  description:
    "LegitAutos is a car dealership offering quality used and new vehicles. Browse our inventory, compare cars, and talk to our team about any vehicle.",
  openGraph: {
    title: `${dealership.name} — Buy Quality Used Cars in Nigeria`,
    description:
      "Quality used and new vehicles from the LegitAutos dealership. Browse inventory and talk to our team.",
    url: dealership.siteUrl,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: dealership.siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: dealership.name,
  url: dealership.siteUrl,
  logo: `${dealership.siteUrl}/logo.png`,
  description: dealership.description,
  telephone: dealership.phone,
  email: dealership.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: dealership.address.area,
    addressLocality: dealership.address.city,
    addressRegion: "Lagos State",
    addressCountry: "NG",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "18:00",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: dealership.phone,
    email: dealership.email,
    availableLanguage: ["English"],
  },
  sameAs: dealership.socials.map((s) => s.url),
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
