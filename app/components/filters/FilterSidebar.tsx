"use client";

import { useFilterStore } from "@/app/stores/filterStore";
import { X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRANDS = [
  "Toyota", "Honda", "Lexus", "Mercedes-Benz", "BMW", "Audi",
  "Ford", "Hyundai", "Kia", "Nissan", "Volkswagen", "Porsche",
];

const TRANSMISSIONS = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "cvt", label: "CVT" },
];

const FUEL_TYPES = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified", label: "Certified Pre-Owned" },
];

const PRICE_RANGES = [
  { min: 0, max: 5000000, label: "Under ₦5M" },
  { min: 5000000, max: 10000000, label: "₦5M - ₦10M" },
  { min: 10000000, max: 20000000, label: "₦10M - ₦20M" },
  { min: 20000000, max: 50000000, label: "₦20M - ₦50M" },
  { min: 50000000, max: Infinity, label: "₦50M+" },
];

const YEAR_RANGES = [
  { min: 2024, max: 2026, label: "2024 - 2026" },
  { min: 2020, max: 2023, label: "2020 - 2023" },
  { min: 2015, max: 2019, label: "2015 - 2019" },
  { min: 2010, max: 2014, label: "2010 - 2014" },
  { min: 2000, max: 2009, label: "2000 - 2009" },
];

export function FilterSidebar() {
  const {
    brand,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    transmission,
    fuelType,
    condition,
    toggleBrand,
    setPriceRange,
    setYearRange,
    toggleTransmission,
    toggleFuelType,
    toggleCondition,
    resetFilters,
  } = useFilterStore();

  const activeFiltersCount = [
    brand?.length,
    minPrice !== undefined || maxPrice !== undefined,
    minYear !== undefined || maxYear !== undefined,
    transmission?.length,
    fuelType?.length,
    condition?.length,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="t-mono text-dark-500 text-[0.6rem] tracking-[0.1em] flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary/10 text-primary t-mono text-[0.45rem] px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="t-mono text-[0.5rem] text-dark-400 hover:text-primary flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="grid grid-cols-2 gap-1.5">
          {BRANDS.map((b) => (
            <label
              key={b}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                brand?.includes(b)
                  ? "bg-primary/5 border-primary/20 text-dark-900"
                  : "border-gray-200 text-dark-500 hover:border-gray-300 hover:text-dark-700"
              }`}
            >
              <input
                type="checkbox"
                checked={brand?.includes(b) || false}
                onChange={() => toggleBrand(b)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span className="truncate">{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                minPrice === range.min && maxPrice === range.max
                  ? "bg-primary/5 border-primary/20 text-dark-900"
                  : "border-gray-200 text-dark-500 hover:border-gray-300 hover:text-dark-700"
              }`}
            >
              <input
                type="radio"
                name="price"
                checked={minPrice === range.min && maxPrice === range.max}
                onChange={() =>
                  setPriceRange(
                    range.min,
                    range.max === Infinity ? undefined : range.max
                  )
                }
                className="w-3.5 h-3.5 border-gray-300 text-primary focus:ring-primary/20"
              />
              {range.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Year">
        <div className="space-y-1.5">
          {YEAR_RANGES.map((range) => (
            <label
              key={range.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                minYear === range.min && maxYear === range.max
                  ? "bg-primary/5 border-primary/20 text-dark-900"
                  : "border-gray-200 text-dark-500 hover:border-gray-300 hover:text-dark-700"
              }`}
            >
              <input
                type="radio"
                name="year"
                checked={minYear === range.min && maxYear === range.max}
                onChange={() => setYearRange(range.min, range.max)}
                className="w-3.5 h-3.5 border-gray-300 text-primary focus:ring-primary/20"
              />
              {range.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission">
        <div className="space-y-1.5">
          {TRANSMISSIONS.map((t) => (
            <label
              key={t.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                transmission?.includes(t.value)
                  ? "bg-primary/5 border-primary/20 text-dark-900"
                  : "border-gray-200 text-dark-500 hover:border-gray-300 hover:text-dark-700"
              }`}
            >
              <input
                type="checkbox"
                checked={transmission?.includes(t.value) || false}
                onChange={() => toggleTransmission(t.value)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              {t.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type">
        <div className="space-y-1.5">
          {FUEL_TYPES.map((f) => (
            <label
              key={f.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                fuelType?.includes(f.value)
                  ? "bg-primary/5 border-primary/20 text-dark-900"
                  : "border-gray-200 text-dark-500 hover:border-gray-300 hover:text-dark-700"
              }`}
            >
              <input
                type="checkbox"
                checked={fuelType?.includes(f.value) || false}
                onChange={() => toggleFuelType(f.value)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              {f.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition">
        <div className="space-y-1.5">
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all border ${
                condition?.includes(c.value)
                  ? "bg-primary/5 border-primary/20 text-dark-900"
                  : "border-gray-200 text-dark-500 hover:border-gray-300 hover:text-dark-700"
              }`}
            >
              <input
                type="checkbox"
                checked={condition?.includes(c.value) || false}
                onChange={() => toggleCondition(c.value)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              {c.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200/80 pb-5 last:border-0">
      <h3 className="t-mono text-dark-400 text-[0.5rem] mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function MobileFilterDrawer() {
  const filterDrawerOpen = useFilterStore(
    (state) => state.filterDrawerOpen
  );
  const setFilterDrawerOpen = useFilterStore(
    (state) => state.setFilterDrawerOpen
  );

  return (
    <AnimatePresence>
      {filterDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 overflow-y-auto lg:hidden border-r border-gray-200/80"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="t-mono text-dark-500 text-[0.6rem]">
                  Filters
                </h2>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-dark-500" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
