"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, ArrowLeft } from "lucide-react";
import { formatPrice, formatMileage } from "@/app/utils/format";

interface BrandType {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  country: string;
  carCount: number;
}

interface CarType {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  condition: string;
  images: string[];
  location: string;
  featured: boolean;
}

interface BrandCarsClientProps {
  brand: BrandType;
  cars: CarType[];
}

export function BrandCarsClient({ brand, cars }: BrandCarsClientProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <nav className="flex items-center gap-2 text-xs text-dark-400">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
          <span>/</span>
          <span className="text-dark-700 font-medium">{brand.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-12">
        <Link
          href="/brands"
          className="inline-flex items-center gap-1.5 text-xs text-dark-400 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3 h-3" />
          All Brands
        </Link>

        <div className="flex items-center gap-5">
          {brand.logo && (
            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-dark-900 tracking-tight">
              {brand.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-dark-400">{brand.country}</span>
              <span className="w-1 h-1 rounded-full bg-dark-300" />
              <span className="text-xs text-dark-400">
                {cars.length} {cars.length === 1 ? "car" : "cars"} available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        {cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-dark-500 mb-4">
              No {brand.name} cars available right now.
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors text-sm"
            >
              Browse All Cars
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cars.map((car) => (
              <Link
                key={car._id}
                href={`/cars/${car._id}`}
                className="group rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {car.images?.[0] ? (
                    <Image
                      src={car.images[0]}
                      alt={car.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-dark-300">No Image</span>
                    </div>
                  )}
                  {car.featured && (
                    <span className="absolute top-3 left-3 text-[0.65rem] text-white bg-primary/90 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-dark-700 group-hover:text-primary transition-colors truncate">
                    {car.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[0.65rem] text-dark-400">{car.year}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-dark-300" />
                    <span className="text-[0.65rem] text-dark-400">{formatMileage(car.mileage)}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-dark-300" />
                    <span className="text-[0.65rem] text-dark-400 capitalize">{car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-dark-900">
                      {formatPrice(car.price)}
                    </span>
                    <span className="flex items-center gap-1 text-[0.6rem] text-dark-400">
                      <MapPin className="w-2.5 h-2.5" />
                      {car.location}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
