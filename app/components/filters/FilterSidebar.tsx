"use client";

import { useFilterStore } from "@/app/stores/filterStore";
import { useBrands } from "@/app/hooks/useCars";
import { X, SlidersHorizontal, Check, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_BRANDS = [
  "Toyota",
  "Lexus",
  "Mercedes-Benz",
  "Honda",
  "BMW",
  "Ford",
  "Hyundai",
  "Kia",
  "Range Rover",
  "Nissan",
];

const BODY_TYPES = [
  { value: "suv", label: "SUV / Crossover" },
  { value: "sedan", label: "Sedan" },
  { value: "coupe", label: "Coupe" },
  { value: "pickup", label: "Pickup / Truck" },
  { value: "hatchback", label: "Hatchback" },
  { value: "van", label: "Bus / Van" },
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
  { value: "foreign-used", label: "Foreign Used (Tokunbo)" },
  { value: "nigerian-used", label: "Nigerian Used" },
  { value: "new", label: "Brand New" },
  { value: "certified", label: "Certified Pre-Owned" },
  { value: "used", label: "Used (General)" },
];

const PRICE_RANGES = [
  { min: undefined, max: undefined, label: "Any Price" },
  { min: 0, max: 5000000, label: "Under ₦5M" },
  { min: 5000000, max: 10000000, label: "₦5M – ₦10M" },
  { min: 10000000, max: 20000000, label: "₦10M – ₦20M" },
  { min: 20000000, max: 45000000, label: "₦20M – ₦45M" },
  { min: 45000000, max: undefined, label: "₦45M+" },
];

const YEAR_RANGES = [
  { min: undefined, max: undefined, label: "Any Year" },
  { min: 2023, max: 2027, label: "2023 & Newer" },
  { min: 2019, max: 2022, label: "2019 – 2022" },
  { min: 2015, max: 2018, label: "2015 – 2018" },
  { min: 2010, max: 2014, label: "2010 – 2014" },
  { min: 2000, max: 2009, label: "2000 – 2009" },
];

export function FilterSidebar() {
  const {
    brand,
    bodyType,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    transmission,
    fuelType,
    condition,
    status,
    toggleBrand,
    toggleBodyType,
    setPriceRange,
    setYearRange,
    toggleTransmission,
    toggleFuelType,
    toggleCondition,
    setStatus,
    resetFilters,
  } = useFilterStore();

  const { data: brandsData } = useBrands();
  const liveBrands = brandsData?.brands?.length
    ? brandsData.brands.map((b) => ({ name: b.name, count: b.carCount }))
    : FALLBACK_BRANDS.map((name) => ({ name, count: undefined }));

  const activeFiltersCount = [
    brand?.length,
    bodyType?.length,
    minPrice !== undefined || maxPrice !== undefined,
    minYear !== undefined || maxYear !== undefined,
    transmission?.length,
    fuelType?.length,
    condition?.length,
    status && status !== "available",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-100 pb-4">
        <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-dark-900">
          <SlidersHorizontal className="h-4 w-4 text-[#D9381E]" />
          Filter Vehicles
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-[#D9381E] px-2 py-0.5 text-[0.65rem] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-dark-500 transition-colors hover:text-[#D9381E]"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Availability Status */}
      <FilterSection title="Availability">
        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-dark-50 p-1">
          {[
            { value: undefined, label: "Available Stock" },
            { value: "all" as const, label: "Include Sold" },
          ].map((tab) => {
            const active = (status || undefined) === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setStatus(tab.value)}
                className={`rounded-lg py-2 text-xs font-bold transition-all ${
                  active
                    ? "bg-white text-[#0C0C0E] shadow-xs"
                    : "text-dark-500 hover:text-dark-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Condition / Origin */}
      <FilterSection title="Condition & Origin">
        <div className="space-y-1.5">
          {CONDITIONS.map((c) => {
            const checked = condition?.includes(c.value) || false;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => toggleCondition(c.value)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                  checked
                    ? "border-[#D9381E] bg-[#D9381E]/5 text-[#D9381E]"
                    : "border-dark-100 text-dark-700 hover:border-dark-200 hover:bg-dark-50/50"
                }`}
              >
                <span>{c.label}</span>
                {checked && <Check className="h-3.5 w-3.5 text-[#D9381E]" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Body Style */}
      <FilterSection title="Body Style">
        <div className="grid grid-cols-2 gap-1.5">
          {BODY_TYPES.map((b) => {
            const checked = bodyType?.includes(b.value) || false;
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => toggleBodyType(b.value)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                  checked
                    ? "border-[#D9381E] bg-[#D9381E]/5 text-[#D9381E]"
                    : "border-dark-100 text-dark-700 hover:border-dark-200 hover:bg-dark-50/50"
                }`}
              >
                <span className="truncate">{b.label}</span>
                {checked && <Check className="h-3 w-3 shrink-0 text-[#D9381E]" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Manufacturer">
        <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
          {liveBrands.map((b) => {
            const checked = brand?.includes(b.name) || false;
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => toggleBrand(b.name)}
                className={`flex items-center justify-between gap-1 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-all ${
                  checked
                    ? "border-[#D9381E] bg-[#D9381E]/5 text-[#D9381E]"
                    : "border-dark-100 text-dark-700 hover:border-dark-200 hover:bg-dark-50/50"
                }`}
              >
                <span className="truncate">{b.name}</span>
                {typeof b.count === "number" && b.count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold ${
                      checked
                        ? "bg-[#D9381E] text-white"
                        : "bg-dark-50 text-dark-500"
                    }`}
                  >
                    {b.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Budget (₦)">
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const checked =
              minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => setPriceRange(range.min, range.max)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                  checked
                    ? "border-[#D9381E] bg-[#D9381E]/5 text-[#D9381E]"
                    : "border-dark-100 text-dark-700 hover:border-dark-200 hover:bg-dark-50/50"
                }`}
              >
                <span>{range.label}</span>
                {checked && <Check className="h-3.5 w-3.5 text-[#D9381E]" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Model Year">
        <div className="space-y-1.5">
          {YEAR_RANGES.map((range) => {
            const checked =
              minYear === range.min && maxYear === range.max;
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => setYearRange(range.min, range.max)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all ${
                  checked
                    ? "border-[#D9381E] bg-[#D9381E]/5 text-[#D9381E]"
                    : "border-dark-100 text-dark-700 hover:border-dark-200 hover:bg-dark-50/50"
                }`}
              >
                <span>{range.label}</span>
                {checked && <Check className="h-3.5 w-3.5 text-[#D9381E]" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission">
        <div className="grid grid-cols-3 gap-1.5">
          {TRANSMISSIONS.map((t) => {
            const checked = transmission?.includes(t.value) || false;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => toggleTransmission(t.value)}
                className={`rounded-xl border py-2 text-center text-xs font-semibold transition-all ${
                  checked
                    ? "border-[#D9381E] bg-[#D9381E]/5 text-[#D9381E]"
                    : "border-dark-100 text-dark-700 hover:border-dark-200"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type">
        <div className="grid grid-cols-2 gap-1.5">
          {FUEL_TYPES.map((f) => {
            const checked = fuelType?.includes(f.value) || false;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => toggleFuelType(f.value)}
                className={`rounded-xl border py-2 px-3 text-left text-xs font-semibold transition-all ${
                  checked
                    ? "border-[#D9381E] bg-[#D9381E]/5 text-[#D9381E]"
                    : "border-dark-100 text-dark-700 hover:border-dark-200"
                }`}
              >
                {f.label}
              </button>
            );
          })}
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
    <div className="border-b border-dark-100 pb-5 last:border-0">
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-dark-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function MobileFilterDrawer({ totalResults }: { totalResults?: number }) {
  const filterDrawerOpen = useFilterStore((state) => state.filterDrawerOpen);
  const setFilterDrawerOpen = useFilterStore(
    (state) => state.setFilterDrawerOpen
  );
  const resetFilters = useFilterStore((state) => state.resetFilters);

  return (
    <AnimatePresence>
      {filterDrawerOpen && (
        <div
          className="fixed inset-0 z-[90] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter vehicles"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0C0C0E]/60 backdrop-blur-sm"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-10 flex max-h-[86vh] flex-col rounded-t-3xl bg-white shadow-2xl"
          >
            {/* Drag Handle & Header */}
            <div className="border-b border-dark-100 px-5 pb-3 pt-3">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-dark-200" />
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-dark-900">
                  Filter Inventory
                </h2>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  aria-label="Close filters"
                  className="rounded-xl p-2 text-dark-500 hover:bg-dark-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar />
            </div>

            {/* Sticky Bottom Bar */}
            <div className="flex items-center gap-3 border-t border-dark-100 bg-white p-4 pb-safe">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-dark-200 px-4 py-3 text-xs font-bold text-dark-700 hover:bg-dark-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 rounded-xl bg-[#D9381E] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#B82B14] transition-colors"
              >
                Show {typeof totalResults === "number" ? `${totalResults} ` : ""}
                Matching Cars
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
