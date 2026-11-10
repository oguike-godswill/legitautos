import { Metadata } from "next";
import { Suspense } from "react";
import CarsPageContent from "./CarsPageContent";
import { dealership } from "@/app/config/dealership";
import { formatConditionLabel, formatCompactPrice } from "@/app/utils/format";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const brand = typeof params.brand === "string" ? params.brand : undefined;
  const bodyType =
    typeof params.bodyType === "string" ? params.bodyType.toUpperCase() : undefined;
  const condition =
    typeof params.condition === "string"
      ? formatConditionLabel(params.condition)
      : undefined;
  const maxPrice =
    typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;

  const titleParts: string[] = ["Buy"];
  if (condition) titleParts.push(condition);
  else titleParts.push("Verified Used & New");

  if (brand) titleParts.push(brand);
  if (bodyType) titleParts.push(bodyType);
  else titleParts.push("Cars");

  if (maxPrice && !Number.isNaN(maxPrice)) {
    titleParts.push(`Under ${formatCompactPrice(maxPrice)}`);
  }

  titleParts.push(`in ${dealership.address.city}, Nigeria`);
  const dynamicTitle = titleParts.join(" ");

  const description = `Browse ${
    brand ? `${brand} ` : ""
  }vehicles for sale in ${dealership.address.city} at ${
    dealership.name
  }. Transparent asking prices, real condition videos, and live showroom availability.`;

  return {
    title: dynamicTitle,
    description,
    openGraph: {
      title: `${dynamicTitle} | ${dealership.name}`,
      description,
      url: `${dealership.siteUrl}/cars`,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `${dealership.siteUrl}/cars`,
    },
  };
}

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-dark-900 flex items-center justify-center">
          <div className="text-sm font-semibold text-dark-500">
            Loading showroom inventory...
          </div>
        </div>
      }
    >
      <CarsPageContent />
    </Suspense>
  );
}
