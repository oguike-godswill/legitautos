"use client";

import { useCars, useFeaturedCars, useBrands } from "@/app/hooks/useCars";
import { HeroSearch } from "@/app/components/sections/home/HeroSearch";
import { InventoryRow } from "@/app/components/sections/home/InventoryRow";
import { ProcessSection } from "@/app/components/sections/home/ProcessSection";
import { TrustSection } from "@/app/components/sections/home/TrustSection";
import { StatsBand } from "@/app/components/sections/home/StatsBand";
import { BrandsRow } from "@/app/components/sections/home/BrandsRow";
import { FaqSection } from "@/app/components/sections/home/FaqSection";

/**
 * Homepage composer. Sections live in ./home/* and read all inventory,
 * brand, and count data from the live API — no hardcoded metrics or copy.
 */
export function SearchFirstLanding() {
  const { data: featuredData } = useFeaturedCars();
  const featuredCars = featuredData?.cars || [];

  const { data: latestData } = useCars({ limit: 10, sortBy: "newest" });
  const latestCars = latestData?.cars || [];

  const { data: brandsData } = useBrands();
  const brands = brandsData?.brands || [];

  return (
    <>
      <HeroSearch />
      <div className="px-1.5">
        <InventoryRow
          eyebrow="Handpicked"
          title="Featured Cars"
          viewAllHref="/cars?featured=true"
          cars={featuredCars}
          className="pt-8 sm:pt-10 lg:pt-12"
        />
        <BrandsRow brands={brands} />
        <InventoryRow
          eyebrow="Fresh Stock"
          title="New Arrivals"
          viewAllHref="/cars?sortBy=newest"
          cars={latestCars}
        />
        <ProcessSection />
        <TrustSection />
        <StatsBand carsInStock={latestData?.total} brandCount={brands.length} />
        <FaqSection />
      </div>
    </>
  );
}
