import { Metadata } from "next";
import { Suspense } from "react";
import CarsPageContent from "./CarsPageContent";

export const metadata: Metadata = {
  title: "Browse Cars",
  description:
    "Explore thousands of verified cars from trusted sellers across Nigeria. Filter by brand, price, location, body type and more.",
  openGraph: {
    title: "Browse Cars | LegitAutos",
    description:
      "Explore thousands of verified cars from trusted sellers across Nigeria.",
    url: "https://legitautomobile.com/cars",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://legitautomobile.com/cars",
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
