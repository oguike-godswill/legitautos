import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { isValidObjectId } from "mongoose";
import CarDetailClient from "./CarDetailClient";

async function getCar(id: string) {
  try {
    await dbConnect();
    let car;
    if (isValidObjectId(id)) {
      car = await Car.findById(id).lean();
    } else {
      car = await Car.findOne({ slug: id }).lean();
    }
    if (!car) return null;
    return JSON.parse(JSON.stringify({ ...car, _id: car._id.toString() }));
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    return { title: "Car Not Found" };
  }

  const title = `${car.title} (${car.year})`;
  const description = `${car.year} ${car.brand} ${car.model} for sale in ${car.location}. ${car.mileage.toLocaleString()} km, ${car.transmission}, ${car.fuelType}. Price: ₦${(car.price / 1000000).toFixed(1)}M.`;
  const url = `https://legitautomobile.com/cars/${car._id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "LegitAutos",
      type: "website",
      images: car.images?.[0]
        ? [{ url: car.images[0], width: 1200, height: 630, alt: car.title }]
        : ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: car.images?.[0] ? [car.images[0]] : ["/og-image.jpg"],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.title,
    description: car.description,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    model: car.model,
    vehicleModelYear: car.year,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    color: car.color,
    vehicleCondition:
      car.condition === "new"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "NGN",
      availability:
        car.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      seller: {
        "@type": "AutoDealer",
        name: car.seller.name,
      },
    },
    image: car.images?.[0] || undefined,
    url: `https://legitautomobile.com/cars/${car._id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarDetailClient car={car} />
    </>
  );
}
