import { Metadata } from "next";
import { SearchFirstLanding } from "@/app/components/sections/SearchFirstLanding";
import { dealership } from "@/app/config/dealership";
import { faqs } from "@/app/config/faq";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car as CarModel } from "@/app/models/Car";
import { Brand as BrandModel } from "@/app/models/Brand";
import { Car, Brand } from "@/app/types";

export const metadata: Metadata = {
  title: `${dealership.name} — Buy Verified Used & New Cars in Lagos, Nigeria`,
  description:
    "LegitAutos is a trusted Lagos car dealership offering inspected foreign-used (Tokunbo), Nigerian-used, and brand-new vehicles. Browse live inventory, watch walkaround videos, compare cars, and chat with our team.",
  openGraph: {
    title: `${dealership.name} — Buy Verified Used & New Cars in Lagos, Nigeria`,
    description:
      "Inspect real showroom vehicles in Lagos. Transparent prices, real walkaround videos, and live availability from LegitAutos.",
    url: dealership.siteUrl,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: dealership.siteUrl,
  },
};

const dealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: dealership.name,
  legalName: dealership.legalName,
  url: dealership.siteUrl,
  logo: `${dealership.siteUrl}/logo-blue.png`,
  image: `${dealership.siteUrl}/og-image.jpg`,
  description: dealership.description,
  telephone: dealership.phone,
  email: dealership.email,
  priceRange: "₦₦₦",
  address: {
    "@type": "PostalAddress",
    streetAddress: dealership.address.area,
    addressLocality: dealership.address.city,
    addressRegion: "Lagos State",
    addressCountry: "NG",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "08:00",
    closes: "18:00",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: dealership.phone,
    email: dealership.email,
    availableLanguage: ["English"],
  },
  sameAs: dealership.socials.map((s) => s.url),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

async function getInitialHomeData(): Promise<{
  featuredCars: Car[];
  latestCars: Car[];
  brands: Brand[];
  totalCars: number;
}> {
  try {
    await dbConnect();
    const availableFilter = { status: { $in: ["available", "reserved"] } };
    const [featuredDocs, latestDocs, totalCars, brandDocs] = await Promise.all([
      CarModel.find({ ...availableFilter, featured: true })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      CarModel.find(availableFilter)
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      CarModel.countDocuments(availableFilter),
      BrandModel.find({}).sort({ carCount: -1 }).lean(),
    ]);

    return {
      featuredCars: JSON.parse(
        JSON.stringify(
          featuredDocs.map((c) => ({ ...c, _id: c._id.toString() }))
        )
      ),
      latestCars: JSON.parse(
        JSON.stringify(
          latestDocs.map((c) => ({ ...c, _id: c._id.toString() }))
        )
      ),
      brands: JSON.parse(
        JSON.stringify(
          brandDocs.map((b) => ({ ...b, _id: b._id.toString() }))
        )
      ),
      totalCars,
    };
  } catch {
    return {
      featuredCars: [],
      latestCars: [],
      brands: [],
      totalCars: 0,
    };
  }
}

export default async function HomePage() {
  const { featuredCars, latestCars, brands, totalCars } =
    await getInitialHomeData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealerJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SearchFirstLanding
        initialFeaturedCars={featuredCars}
        initialLatestCars={latestCars}
        initialBrands={brands}
        initialTotalCars={totalCars}
      />
    </>
  );
}
