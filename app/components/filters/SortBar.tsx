"use client";

import { useFilterStore } from "@/app/stores/filterStore";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low→High" },
  { value: "price-desc", label: "Price: High→Low" },
  { value: "year-desc", label: "Year: Newest" },
  { value: "year-asc", label: "Year: Oldest" },
  { value: "mileage-asc", label: "Mileage: Low→High" },
];

interface SortBarProps {
  total: number;
  currentPage: number;
  totalPages: number;
}

export function SortBar({ total, currentPage, totalPages }: SortBarProps) {
  const { sortBy, setSortBy, setFilterDrawerOpen } = useFilterStore();

  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-dark-700 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <span className="text-xs text-dark-400">
          {total > 0 ? (currentPage - 1) * 12 + 1 : 0}–
          {Math.min(currentPage * 12, total)} of {total}
        </span>
      </div>

      <div className="relative">
        <select
          value={sortBy || "newest"}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-dark-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none cursor-pointer pr-8"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-dark-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
