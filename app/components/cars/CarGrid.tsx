"use client";

import Link from "next/link";
import { CarCard } from "./CarCard";
import { Car } from "@/app/types";
import { Car as CarIcon, ArrowRight, RotateCcw, MessageCircle } from "lucide-react";
import { useFilterStore } from "@/app/stores/filterStore";
import { dealershipWhatsApp } from "@/app/config/dealership";

interface CarGridProps {
  cars: Car[];
}

export function CarGrid({ cars }: CarGridProps) {
  const { viewMode, resetFilters, search, brand } = useFilterStore();

  if (cars.length === 0) {
    const querySummary = [search, ...(brand || [])].filter(Boolean).join(" ");

    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-dark-200 bg-dark-50/40 px-6 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9381E]/10 text-[#D9381E]">
          <CarIcon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-extrabold text-[#0C0C0E]">
          No exact match in current showroom stock
        </h3>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#52504D]">
          {querySummary
            ? `We don't currently have a "${querySummary}" matching those exact filters on the lot — but our sourcing team can locate and inspect one for you.`
            : "Try loosening one of your filters, or tell our team the exact vehicle and budget you want us to source for you."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-[#0C0C0E]/15 bg-white px-5 py-2.5 text-xs font-bold text-[#0C0C0E] transition-colors hover:bg-[#EFECE6]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
          <Link
            href="/request"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C0C0E] hover:bg-[#D9381E] px-5 py-2.5 text-xs font-bold text-white transition-colors"
          >
            Request This Car
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={dealershipWhatsApp(
              querySummary
                ? `Hello LegitAutos, I'm looking for a ${querySummary}. Can you help me source one?`
                : "Hello LegitAutos, I'm looking for a specific car that isn't listed on your website."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#128C7E] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0e7a6e]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        viewMode === "compact"
          ? "grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      }`}
    >
      {cars.map((car, index) => (
        <CarCard key={car._id} car={car} index={index} priority={index < 3} />
      ))}
    </div>
  );
}
