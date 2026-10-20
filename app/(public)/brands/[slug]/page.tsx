import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/app/lib/dbConnect";
import { Brand } from "@/app/models/Brand";
import { Car } from "@/app/models/Car";
import { BrandCarsClient } from "./BrandCarsClient";
import { dealership } from "@/app/config/dealership";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const brand = await Brand.findOne({ slug }).lean();

  if (!brand) {
    return { title: `Brand Not Found — ${dealership.name}` };
  }

  const availableCount = await Car.countDocuments({
    brand: { $regex: new RegExp(`^${brand.name}$`, "i") },
    status: "available",
  });

  return {
    title: `${brand.name} Cars`,
    description: availableCount > 0
      ? `Browse ${availableCount} available ${brand.name} ${availableCount === 1 ? "car" : "cars"} for sale at the ${dealership.name} dealership.`
      : `View ${brand.name} cars previously sold by ${dealership.name}, or request the ${brand.name} you're looking for.`,
  };
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();

  const brand = await Brand.findOne({ slug }).lean();
  if (!brand) {
    notFound();
  }

  const cars = await Car.find({
    brand: { $regex: new RegExp(`^${brand.name}$`, "i") },
    status: "available",
  })
    .sort({ featured: -1, createdAt: -1 })
    .lean();

  const serializedBrand = {
    ...brand,
    _id: brand._id.toString(),
  };

  const serializedCars = cars.map((car) => ({
    ...car,
    _id: car._id.toString(),
  }));

  return (
    <BrandCarsClient
      brand={serializedBrand}
      cars={serializedCars}
    />
  );
}
