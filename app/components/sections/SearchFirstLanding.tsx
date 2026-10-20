"use client";

import { useCars, useFeaturedCars, useBrands } from "@/app/hooks/useCars";
import { HeroSearch } from "@/app/components/sections/home/HeroSearch";
import { InventoryRow } from "@/app/components/sections/home/InventoryRow";
import { ProcessSection } from "@/app/components/sections/home/ProcessSection";
import { TrustSection } from "@/app/components/sections/home/TrustSection";
import { StatsBand } from "@/app/components/sections/home/StatsBand";
import { BrandsRow } from "@/app/components/sections/home/BrandsRow";
import { SellCtaSection } from "@/app/components/sections/home/SellCtaSection";

/**
 * Homepage composer. Sections live in ./home/* and read all inventory,
 * brand, and count data from the live API — no hardcoded metrics or copy.
 */
export function SearchFirstLanding() {
  const { data: featuredData } = useFeaturedCars();
  const featuredCars = featuredData?.cars || [];

  const { data: latestData } = useCars({ limit: 8, sortBy: "newest" });
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
        />
        <ProcessSection />
        <TrustSection />
        <StatsBand carsInStock={latestData?.total} brandCount={brands.length} />
        <BrandsRow brands={brands} />
        <InventoryRow
          eyebrow="Fresh Stock"
          title="Latest Arrivals"
          viewAllHref="/cars?sortBy=newest"
          cars={latestCars}
        />
        <SellCtaSection />
      </div>
    </>
  );
}
