export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { Brand } from "@/app/models/Brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://legitautomobile.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0, changeFrequency: "daily" },
    { url: `${baseUrl}/cars`, lastModified: new Date(), priority: 0.95, changeFrequency: "daily" },
    { url: `${baseUrl}/inspections`, lastModified: new Date(), priority: 0.85, changeFrequency: "weekly" },
    { url: `${baseUrl}/sell`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/request`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/compare`, lastModified: new Date(), priority: 0.7, changeFrequency: "weekly" },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
  ];

  try {
    await dbConnect();

    const [cars, brands] = await Promise.all([
      Car.find({})
        .select("_id slug updatedAt status")
        .sort({ updatedAt: -1 })
        .lean(),
      Brand.find({ carCount: { $gt: 0 } })
        .select("name updatedAt")
        .lean(),
    ]);

    // Use SEO-friendly slugs for every car page and keep sold listings indexed so backlinks never 404
    const carPages: MetadataRoute.Sitemap = cars.map((car) => ({
      url: `${baseUrl}/cars/${car.slug || car._id.toString()}`,
      lastModified: car.updatedAt || new Date(),
      priority: car.status === "available" ? 0.85 : 0.65,
      changeFrequency: "weekly",
    }));

    // Brand landing pages for programmatic SEO
    const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
      url: `${baseUrl}/cars?brand=${encodeURIComponent(brand.name)}`,
      lastModified: new Date(),
      priority: 0.75,
      changeFrequency: "weekly",
    }));

    return [...staticPages, ...carPages, ...brandPages];
  } catch {
    return staticPages;
  }
}
