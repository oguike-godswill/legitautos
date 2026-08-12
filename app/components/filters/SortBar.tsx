"use client";

import { useFilterStore } from "@/app/stores/filterStore";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "year-desc", label: "Year: Newest First" },
  { value: "year-asc", label: "Year: Oldest First" },
  { value: "mileage-asc", label: "Mileage: Low to High" },
];

interface SortBarProps {
  total: number;
  currentPage: number;
  totalPages: number;
}

export function SortBar({ total, currentPage, totalPages }: SortBarProps) {
  const { sortBy, setSortBy, setFilterDrawerOpen } = useFilterStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg t-mono text-[0.5rem] text-dark-500 hover:text-dark-700 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>
        <span className="t-mono text-[0.5rem] text-dark-400">
          {total > 0 ? (currentPage - 1) * 12 + 1 : 0} -{" "}
          {Math.min(currentPage * 12, total)} of {total}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-dark-400" />
        <select
          value={sortBy || "newest"}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg t-mono text-[0.5rem] text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
