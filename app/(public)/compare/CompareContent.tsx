"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/app/stores/compareStore";
import { formatPrice, formatMileage } from "@/app/utils/format";
import { X, ArrowRight, Plus, Scale } from "lucide-react";

interface CarData {
  _id: string;
  title: string;
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
  features: string[];
}

export function CompareContent() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const results: CarData[] = [];
      for (const id of compareList) {
        try {
          const res = await fetch(`/api/cars/${id}`);
          const data = await res.json();
          if (data.car) results.push(data.car);
        } catch {
          // skip
        }
      }
      setCars(results);
      setLoading(false);
    };

    if (compareList.length > 0) {
      fetchCars();
    } else {
      setCars([]);
      setLoading(false);
    }
  }, [compareList]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-dark-400">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-12 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-6 h-6 text-dark-300" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 mb-3">No Cars to Compare</h1>
          <p className="text-sm text-dark-500 mb-8 max-w-md mx-auto">
            Add cars to your comparison list by clicking the compare button on any car card.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors text-sm"
          >
            Browse Cars
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const allFeatures = Array.from(
    new Set(cars.flatMap((car) => car.features || []))
  ).slice(0, 12);

  const specs = [
    { label: "Brand", key: "brand" },
    { label: "Model", key: "model" },
    { label: "Year", key: "year" },
    { label: "Price", key: "price", format: (v: number) => formatPrice(v) },
    { label: "Mileage", key: "mileage", format: (v: number) => formatMileage(v) },
    { label: "Transmission", key: "transmission" },
    { label: "Fuel Type", key: "fuelType" },
    { label: "Color", key: "color" },
    { label: "Condition", key: "condition" },
    { label: "Location", key: "location" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-32 pb-8 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[0.65rem] font-bold text-primary uppercase tracking-wider block mb-2">Compare</span>
            <h1 className="text-2xl sm:text-3xl font-black text-dark-900">
              Compare Cars
            </h1>
            <p className="text-xs text-dark-400 mt-2">
              {cars.length}/3 cars selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-2 rounded-lg border border-gray-200 text-dark-400 hover:text-dark-600 hover:bg-gray-50 text-xs transition-colors"
            >
              Clear All
            </button>
            {cars.length < 3 && (
              <Link
                href="/cars"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-dark-500 hover:text-primary hover:bg-primary/5 text-xs transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Car
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Car Headers */}
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cars.length}, 1fr)` }}>
              {cars.map((car) => (
                <div key={car._id} className="relative rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => removeFromCompare(car._id)}
                    className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {car.images?.[0] ? (
                      <Image
                        src={car.images[0]}
                        alt={car.title}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-dark-300">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-dark-700 truncate">{car.title}</h3>
                    <p className="text-lg font-bold text-dark-900 mt-1">{formatPrice(car.price)}</p>
                    <Link
                      href={`/cars/${car._id}`}
                      className="flex items-center gap-1 text-[0.65rem] text-dark-400 hover:text-primary mt-2 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Specs Comparison */}
            <div className="mt-6 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
              {specs.map((spec, index) => (
                <div
                  key={spec.key}
                  className={`grid items-center ${index > 0 ? "border-t border-gray-100" : ""}`}
                  style={{ gridTemplateColumns: `140px repeat(${cars.length}, 1fr)` }}
                >
                  <div className="px-4 py-3 text-xs font-medium text-dark-500 bg-gray-50">
                    {spec.label}
                  </div>
                  {cars.map((car) => {
                    const value = car[spec.key as keyof CarData];
                    const display = spec.format
                      ? spec.format(value as number)
                      : String(value || "-");
                    return (
                      <div key={car._id} className="px-4 py-3 text-sm text-dark-700 capitalize border-l border-gray-100">
                        {display}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Features Comparison */}
            {allFeatures.length > 0 && (
              <div className="mt-6 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="text-xs font-medium text-dark-500">Features</span>
                </div>
                {allFeatures.map((feature, index) => (
                  <div
                    key={feature}
                    className={`grid items-center ${index > 0 ? "border-t border-gray-100" : ""}`}
                    style={{ gridTemplateColumns: `140px repeat(${cars.length}, 1fr)` }}
                  >
                    <div className="px-4 py-2.5 text-xs text-dark-500 truncate">
                      {feature}
                    </div>
                    {cars.map((car) => (
                      <div key={car._id} className="px-4 py-2.5 border-l border-gray-100">
                        <span className={`text-xs ${(car.features || []).includes(feature) ? "text-primary font-medium" : "text-dark-300"}`}>
                          {(car.features || []).includes(feature) ? "Yes" : "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
