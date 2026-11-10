"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/app/stores/compareStore";
import { useCars } from "@/app/hooks/useCars";
import {
  formatPrice,
  formatMileage,
  formatConditionLabel,
} from "@/app/utils/format";
import {
  X,
  ArrowRight,
  Plus,
  Scale,
  Check,
  MessageCircle,
  Trophy,
  Sparkles,
} from "lucide-react";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";
import { Car } from "@/app/types";

export function CompareContent() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [highlightDiff, setHighlightDiff] = useState(false);

  const { data, isLoading } = useCars(
    compareList.length > 0 ? { ids: compareList, limit: 10 } : undefined
  );

  // Preserve the user's selection order
  const cars: Car[] =
    compareList.length === 0
      ? []
      : compareList
          .map((id) =>
            (data?.cars || []).find((c) => c._id === id || c.slug === id)
          )
          .filter((c): c is Car => Boolean(c));

  if (compareList.length > 0 && isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-dark-100 border-t-[#D9381E] rounded-full animate-spin" />
          <p className="text-xs font-bold text-dark-500">
            Loading side-by-side comparison...
          </p>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F4EF]">
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto text-center">
          <div className="w-16 h-16 bg-[#D9381E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#D9381E]">
            <Scale className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3">
            No Vehicles Selected to Compare
          </h1>
          <p className="text-sm text-dark-500 mb-8 max-w-md mx-auto leading-relaxed">
            Tap the scale icon on up to 3 vehicles in our inventory to compare
            specifications, pricing, mileage, and equipped features side by
            side.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D9381E] text-white font-bold rounded-xl hover:bg-[#B82B14] transition-colors text-xs uppercase tracking-wider shadow-md"
          >
            Browse Inventory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const lowestPrice = Math.min(...cars.map((c) => c.price));
  const lowestMileage = Math.min(...cars.map((c) => c.mileage));
  const newestYear = Math.max(...cars.map((c) => c.year));

  const allFeatures = Array.from(
    new Set(cars.flatMap((car) => car.features || []))
  ).slice(0, 16);

  const specs: {
    label: string;
    key: keyof Car;
    format?: (v: unknown) => string;
    winnerValue?: unknown;
  }[] = [
    { label: "Brand", key: "brand" },
    { label: "Model", key: "model" },
    {
      label: "Year",
      key: "year",
      winnerValue: cars.length > 1 ? newestYear : undefined,
    },
    {
      label: "Price",
      key: "price",
      format: (v) => formatPrice(Number(v)),
      winnerValue: cars.length > 1 ? lowestPrice : undefined,
    },
    {
      label: "Mileage",
      key: "mileage",
      format: (v) => formatMileage(Number(v)),
      winnerValue: cars.length > 1 ? lowestMileage : undefined,
    },
    {
      label: "Condition",
      key: "condition",
      format: (v) => formatConditionLabel(String(v)),
    },
    { label: "Body Style", key: "bodyType" },
    { label: "Transmission", key: "transmission" },
    { label: "Fuel Type", key: "fuelType" },
    { label: "Exterior Color", key: "color" },
    { label: "Location", key: "location" },
  ];

  const visibleSpecs = highlightDiff
    ? specs.filter((spec) => {
        if (cars.length < 2) return true;
        const firstVal = String(cars[0][spec.key] ?? "").toLowerCase();
        return cars.some(
          (c) => String(c[spec.key] ?? "").toLowerCase() !== firstVal
        );
      })
    : specs;

  const whatsappComparisonMsg =
    `Hello ${dealership.name}, I am comparing these ${cars.length} vehicles on your website and would like your advice:\n` +
    cars
      .map(
        (c, idx) =>
          `${idx + 1}. ${c.year} ${c.title} (${formatPrice(c.price)})`
      )
      .join("\n");

  return (
    <div className="min-h-screen bg-[#F6F4EF] pb-24">
      {/* Header */}
      <div className="border-b border-[#0C0C0E]/10 bg-[#EFECE6] pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#D9381E] uppercase tracking-wider block mb-1.5">
              Side-by-Side Evaluation
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0C0C0E] uppercase tracking-tight">
              Compare Vehicles
            </h1>
            <p className="text-xs font-semibold text-dark-500 mt-1.5">
              {cars.length} of 3 vehicles selected
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {cars.length > 1 && (
              <button
                type="button"
                onClick={() => setHighlightDiff(!highlightDiff)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors ${
                  highlightDiff
                    ? "border-[#D9381E] bg-[#D9381E]/10 text-[#D9381E]"
                    : "border-dark-200 bg-white text-dark-700 hover:bg-dark-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {highlightDiff ? "Showing Differences Only" : "Highlight Differences"}
              </button>
            )}

            <button
              type="button"
              onClick={clearCompare}
              className="px-3.5 py-2 rounded-xl border border-dark-200 bg-white text-dark-600 hover:text-danger hover:border-danger/30 text-xs font-bold transition-colors"
            >
              Clear All
            </button>

            {cars.length < 3 && (
              <Link
                href="/cars"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D9381E] text-white hover:bg-[#B82B14] text-xs font-bold transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Vehicle
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pt-8">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[640px]">
            {/* Car Header Cards */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `160px repeat(${cars.length}, minmax(200px, 1fr))`,
              }}
            >
              <div className="flex flex-col justify-end p-4 rounded-2xl bg-[#0C0C0E] text-white">
                <Scale className="h-6 w-6 text-[#C89D54] mb-3" />
                <p className="text-sm font-extrabold">Need help deciding?</p>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  Chat with our showroom team for an honest assessment.
                </p>
                <a
                  href={dealershipWhatsApp(whatsappComparisonMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#D9381E] py-2.5 px-3 text-xs font-bold text-white hover:bg-[#B82B14] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Ask Sales Team
                </a>
              </div>

              {cars.map((car) => (
                <div
                  key={car._id}
                  className="relative rounded-2xl bg-white border border-dark-100 overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => removeFromCompare(car._id)}
                    aria-label={`Remove ${car.title}`}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-[#0C0C0E]/75 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-danger transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/cars/${car.slug || car._id}`}
                    className="block relative aspect-[3/2] bg-dark-100"
                  >
                    <Image
                      src={car.images?.[0] || "/images/placeholder-car.jpg"}
                      alt={car.title}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </Link>
                  <div className="p-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D9381E]">
                      {car.year} &middot; {formatConditionLabel(car.condition)}
                    </span>
                    <h3 className="text-sm font-bold text-dark-900 truncate mt-0.5">
                      {car.title}
                    </h3>
                    <p className="text-lg font-extrabold text-dark-900 mt-1">
                      {formatPrice(car.price)}
                    </p>
                    <Link
                      href={`/cars/${car.slug || car._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D9381E] hover:underline mt-2.5"
                    >
                      Inspect Vehicle
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Specs Comparison */}
            <div className="mt-6 rounded-2xl bg-white border border-dark-100 overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-dark-100 bg-dark-50">
                <span className="text-xs font-extrabold uppercase tracking-wider text-dark-700">
                  Key Specifications
                </span>
              </div>
              {visibleSpecs.map((spec, index) => (
                <div
                  key={String(spec.key)}
                  className={`grid items-center ${
                    index > 0 ? "border-t border-dark-100" : ""
                  }`}
                  style={{
                    gridTemplateColumns: `160px repeat(${cars.length}, minmax(200px, 1fr))`,
                  }}
                >
                  <div className="px-4 py-3.5 text-xs font-bold text-dark-500 bg-dark-50/50">
                    {spec.label}
                  </div>
                  {cars.map((car) => {
                    const value = car[spec.key];
                    const display = spec.format
                      ? spec.format(value)
                      : String(value || "—");
                    const isWinner =
                      spec.winnerValue !== undefined &&
                      value === spec.winnerValue;

                    return (
                      <div
                        key={car._id}
                        className={`px-4 py-3.5 text-sm capitalize border-l border-dark-100 flex items-center justify-between gap-2 ${
                          isWinner
                            ? "bg-[#D9381E]/[0.04] font-extrabold text-dark-900"
                            : "font-semibold text-dark-700"
                        }`}
                      >
                        <span>{display}</span>
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#D9381E]/15 px-2 py-0.5 text-[0.62rem] font-bold text-[#D9381E]">
                            <Trophy className="h-3 w-3" />
                            Best
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Features Matrix */}
            {allFeatures.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white border border-dark-100 overflow-hidden shadow-xs">
                <div className="px-4 py-3 border-b border-dark-100 bg-dark-50">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-dark-700">
                    Features & Equipment
                  </span>
                </div>
                {allFeatures.map((feature, index) => (
                  <div
                    key={feature}
                    className={`grid items-center ${
                      index > 0 ? "border-t border-dark-100" : ""
                    }`}
                    style={{
                      gridTemplateColumns: `160px repeat(${cars.length}, minmax(200px, 1fr))`,
                    }}
                  >
                    <div className="px-4 py-3 text-xs font-semibold text-dark-600 truncate bg-dark-50/50">
                      {feature}
                    </div>
                    {cars.map((car) => {
                      const hasFeature = (car.features || []).includes(feature);
                      return (
                        <div
                          key={car._id}
                          className="px-4 py-3 border-l border-dark-100"
                        >
                          {hasFeature ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9381E]">
                              <Check className="h-4 w-4" />
                              Equipped
                            </span>
                          ) : (
                            <span className="text-xs text-dark-300">—</span>
                          )}
                        </div>
                      );
                    })}
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
