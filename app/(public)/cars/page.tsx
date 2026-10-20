import { Metadata } from "next";
import { Suspense } from "react";
import CarsPageContent from "./CarsPageContent";
import { dealership } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: "Browse Cars",
  description:
    "Explore the current LegitAutos inventory. Filter by brand, price, year, transmission, fuel type and condition.",
  openGraph: {
    title: "Browse Cars | LegitAutos",
    description: "Explore the current LegitAutos dealership inventory.",
    url: `${dealership.siteUrl}/cars`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/cars`,
  },
};

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center">
          <div className="text-dark-500">Loading...</div>
        </div>
      }
    >
      <CarsPageContent />
    </Suspense>
  );
}
