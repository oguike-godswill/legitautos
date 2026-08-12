import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/app/lib/dbConnect";
import { Brand } from "@/app/models/Brand";
import { Car } from "@/app/models/Car";
import { BrandCarsClient } from "./BrandCarsClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const brand = await Brand.findOne({ slug }).lean();

  if (!brand) {
    return { title: "Brand Not Found — LegitAutos Autos" };
  }

  return {
    title: `${brand.name} Cars — LegitAutos Autos`,
    description: `Browse all ${brand.name} cars available on LegitAutos Autos. ${brand.carCount}+ vehicles from Nigeria's trusted car marketplace.`,
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
