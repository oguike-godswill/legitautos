import { Metadata } from "next";
import { SearchFirstLanding } from "@/app/components/sections/SearchFirstLanding";

export const metadata: Metadata = {
  title: "LegitAutos Autos — Nigeria's #1 Car Marketplace",
  description:
    "Browse thousands of verified vehicles from trusted sellers across Nigeria. Buy, sell, or request cars — all in one place.",
  openGraph: {
    title: "LegitAutos Autos — Nigeria's #1 Car Marketplace",
    description: "Browse thousands of verified vehicles from trusted sellers across Nigeria.",
  },
};

export default function HomePage() {
  return <SearchFirstLanding />;
}

