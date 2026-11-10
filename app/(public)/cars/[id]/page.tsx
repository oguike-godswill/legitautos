import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { isValidObjectId } from "mongoose";
import CarDetailClient from "./CarDetailClient";
import { dealership } from "@/app/config/dealership";
import { formatConditionLabel } from "@/app/utils/format";

async function getCar(id: string) {
  try {
    await dbConnect();
    const decoded = decodeURIComponent(id).trim();
    let car = null;

    if (isValidObjectId(decoded)) {
      car = await Car.findById(decoded).lean();
    }
    if (!car) {
      car = await Car.findOne({ slug: decoded }).lean();
    }
    if (!car) return null;

    // Non-blocking view counter increment
    Car.updateOne({ _id: car._id }, { $inc: { views: 1 } }).catch(() => {});

    return JSON.parse(JSON.stringify({ ...car, _id: car._id.toString() }));
  } catch (error) {
    console.error("getCar error:", error);
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
    return { title: "Vehicle Not Found" };
  }

  const condLabel = formatConditionLabel(car.condition);
  const priceNum = Number(car.price) || 0;
  const mileageNum = Number(car.mileage) || 0;
  const title = `${car.year} ${car.title} (${condLabel}) — ₦${(
    priceNum / 1000000
  ).toFixed(1)}M`;
  const description = `Buy this ${condLabel.toLowerCase()} ${car.year} ${
    car.brand
  } ${car.model} in ${car.location} at ${
    dealership.name
  }. ${mileageNum.toLocaleString()} km, ${car.transmission}, ${
    car.fuelType
  }. Price: ₦${priceNum.toLocaleString()}. Inspect in person or via live video.`;
  const canonicalSlug = car.slug || car._id;
  const url = `${dealership.siteUrl}/cars/${canonicalSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: dealership.name,
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

  const canonicalUrl = `${dealership.siteUrl}/cars/${car.slug || car._id}`;

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.year} ${car.title}`,
    description: car.description,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    model: car.model,
    vehicleModelYear: car.year,
    bodyType: car.bodyType || undefined,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    color: car.color,
    itemCondition:
      car.condition === "new"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "NGN",
      url: canonicalUrl,
      availability:
        car.status === "available"
          ? "https://schema.org/InStock"
          : car.status === "reserved"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/SoldOut",
      seller: {
        "@type": "AutoDealer",
        name: dealership.name,
        url: dealership.siteUrl,
        telephone: dealership.phone,
      },
    },
    image: car.images?.length ? car.images : undefined,
    url: canonicalUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: dealership.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Inventory",
        item: `${dealership.siteUrl}/cars`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: car.brand,
        item: `${dealership.siteUrl}/cars?brand=${encodeURIComponent(
          car.brand
        )}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: car.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CarDetailClient car={car} />
    </>
  );
}
