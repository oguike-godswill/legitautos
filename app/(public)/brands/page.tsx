import { Metadata } from "next";
import { dbConnect } from "@/app/lib/dbConnect";
import { Brand } from "@/app/models/Brand";
import BrandsGridClient, { BrandType } from "./BrandsGridClient";

export const metadata: Metadata = {
  title: "Car Brands",
  description:
    "Browse all car brands available on LegitAutos. Find vehicles from Toyota, Honda, Mercedes-Benz, BMW, Lexus and more trusted manufacturers in Nigeria.",
  openGraph: {
    title: "Car Brands | LegitAutos",
    description: "Browse all car brands available on LegitAutos.",
    url: "https://legitautomobile.com/brands",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://legitautomobile.com/brands",
  },
};

export const dynamic = "force-dynamic";

const Fallback: BrandType[] = [
  { _id: "d1", name: "Toyota", slug: "toyota", carCount: 124, country: "Japan" },
  { _id: "d2", name: "Honda", slug: "honda", carCount: 98, country: "Japan" },
  { _id: "d3", name: "Mercedes-Benz", slug: "mercedes-benz", carCount: 56, country: "Germany" },
  { _id: "d4", name: "BMW", slug: "bmw", carCount: 47, country: "Germany" },
  { _id: "d5", name: "Lexus", slug: "lexus", carCount: 42, country: "Japan" },
  { _id: "d6", name: "Ford", slug: "ford", carCount: 38, country: "USA" },
];

export default async function BrandsPage() {
  await dbConnect();

  const brandsFromDb = await Brand.find({}).sort({ carCount: -1 }).lean();
  const hasDbBrands = Array.isArray(brandsFromDb) && brandsFromDb.length > 0;

  const displayBrands: BrandType[] = hasDbBrands
    ? brandsFromDb.map((b: any) => ({
        _id: b._id?.toString?.() ?? String(b._id),
        name: b.name,
        slug: b.slug,
        carCount: typeof b.carCount === "number" ? b.carCount : undefined,
        country: b.country,
      }))
    : Fallback;

  return <BrandsGridClient brands={displayBrands} />;
}
