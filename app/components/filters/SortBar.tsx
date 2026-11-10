"use client";

import { useFilterStore } from "@/app/stores/filterStore";
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, Rows3 } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "year-desc", label: "Year: Newest First" },
  { value: "year-asc", label: "Year: Oldest First" },
  { value: "mileage-asc", label: "Mileage: Lowest First" },
];

interface SortBarProps {
  total: number;
  currentPage: number;
  totalPages?: number;
}

export function SortBar({ total, currentPage }: SortBarProps) {
  const {
    sortBy,
    setSortBy,
    setFilterDrawerOpen,
    viewMode,
    setViewMode,
    brand,
    bodyType,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    transmission,
    fuelType,
    condition,
  } = useFilterStore();

  const activeCount = [
    brand?.length,
    bodyType?.length,
    minPrice !== undefined || maxPrice !== undefined,
    minYear !== undefined || maxYear !== undefined,
    transmission?.length,
    fuelType?.length,
    condition?.length,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-dark-100">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFilterDrawerOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 bg-[#0C0C0E] text-white rounded-xl text-xs font-bold hover:bg-[#D9381E] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-[#D9381E] px-1.5 py-0.5 text-[0.65rem] text-white">
              {activeCount}
            </span>
          )}
        </button>
        <span className="text-xs font-semibold text-dark-600">
          Showing{" "}
          <strong className="text-dark-900">
            {total > 0 ? (currentPage - 1) * 12 + 1 : 0}–
            {Math.min(currentPage * 12, total)}
          </strong>{" "}
          of <strong className="text-dark-900">{total}</strong> vehicles
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile 1-col / 2-col view toggle */}
        <div className="flex sm:hidden items-center rounded-xl border border-dark-200 p-0.5 bg-dark-50">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Single column large cards"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-white text-[#D9381E] shadow-xs"
                : "text-dark-400"
            }`}
          >
            <Rows3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("compact")}
            aria-label="Two column compact grid"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "compact"
                ? "bg-white text-[#D9381E] shadow-xs"
                : "text-dark-400"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Sort Select */}
        <div className="relative">
          <label htmlFor="sort-select" className="sr-only">
            Sort vehicles by
          </label>
          <select
            id="sort-select"
            value={sortBy || "newest"}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="flex items-center gap-2 pl-3.5 pr-9 py-2.5 bg-white border border-dark-200 rounded-xl text-xs font-bold text-dark-800 focus:outline-none focus:ring-2 focus:ring-[#D9381E]/20 focus:border-[#D9381E] transition-colors appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-dark-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
