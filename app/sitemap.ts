export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://autonaija.com";

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/cars`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), priority: 0.8 },
  ];

  // Dynamic car pages
  const cars = await Car.find({ status: "available" }).select("slug updatedAt").lean();
  const carPages = cars.map((car) => ({
    url: `${baseUrl}/cars/${car.slug}`,
    lastModified: car.updatedAt,
    priority: 0.8,
  }));

  return [...staticPages, ...carPages];
}
