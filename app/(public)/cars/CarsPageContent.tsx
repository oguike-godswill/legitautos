"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useFilterStore } from "@/app/stores/filterStore";
import { CarFilters } from "@/app/types";
import { useCars } from "@/app/hooks/useCars";
import { SearchBar } from "@/app/components/filters/SearchBar";
import {
  FilterSidebar,
  MobileFilterDrawer,
} from "@/app/components/filters/FilterSidebar";
import { SortBar } from "@/app/components/filters/SortBar";
import { CarGrid } from "@/app/components/cars/CarGrid";
import { Pagination } from "@/app/components/cars/Pagination";
import { CarCardSkeleton } from "@/app/components/ui/Skeleton";
import { ErrorMessage } from "@/app/components/ui/ErrorMessage";
import { ArrowLeft, X, RotateCcw } from "lucide-react";
import { formatCompactPrice, formatConditionLabel } from "@/app/utils/format";

export default function CarsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const {
    search,
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
    sortBy,
    page,
    setSearch,
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

  // Seed filters from the URL once, so shared links like /cars?brand=Toyota work
  const seededFromUrl = useRef(false);
  useEffect(() => {
    if (seededFromUrl.current) return;
    seededFromUrl.current = true;

    const s = searchParams.get("search");
    const b = searchParams.get("brand");
    const bt = searchParams.get("bodyType");
    const minP = searchParams.get("minPrice");
    const maxP = searchParams.get("maxPrice");
    const minY = searchParams.get("minYear");
    const maxY = searchParams.get("maxYear");
    const t = searchParams.get("transmission");
    const f = searchParams.get("fuelType");
    const c = searchParams.get("condition");
    const st = searchParams.get("status");
    const sort = searchParams.get("sortBy");
    const p = searchParams.get("page");

    const store = useFilterStore.getState();

    if (s) store.setSearch(s);
    if (b) store.setBrand(b.split(","));
    if (bt) store.setBodyType(bt.split(","));
    if (minP || maxP) {
      store.setPriceRange(
        minP ? Number(minP) : undefined,
        maxP ? Number(maxP) : undefined
      );
    }
    if (minY || maxY) {
      store.setYearRange(
        minY ? Number(minY) : undefined,
        maxY ? Number(maxY) : undefined
      );
    }
    if (t) store.setTransmission(t.split(","));
    if (f) store.setFuelType(f.split(","));
    if (c) store.setCondition(c.split(","));
    if (st) store.setStatus(st as CarFilters["status"]);
    if (sort) store.setSortBy(sort as CarFilters["sortBy"]);
    if (p) store.setPage(Number(p));
  }, [searchParams]);

  // Mirror filter changes back into the URL (replaceState, no navigation)
  const queryString = useFilterStore((state) => state.getQueryString());
  useEffect(() => {
    if (!seededFromUrl.current) return;
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(target, { scroll: false });
  }, [queryString, pathname, router]);

  const { data, isLoading, isError, refetch } = useCars({
    search,
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
    sortBy,
    page,
    limit: 12,
  });

  // Build active filter chips for 1-tap removal
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (search) {
    activeChips.push({
      key: `search-${search}`,
      label: `"${search}"`,
      onRemove: () => setSearch(""),
    });
  }
  brand?.forEach((b) =>
    activeChips.push({
      key: `brand-${b}`,
      label: b,
      onRemove: () => toggleBrand(b),
    })
  );
  bodyType?.forEach((bt) =>
    activeChips.push({
      key: `body-${bt}`,
      label: bt.toUpperCase(),
      onRemove: () => toggleBodyType(bt),
    })
  );
  condition?.forEach((c) =>
    activeChips.push({
      key: `cond-${c}`,
      label: formatConditionLabel(c),
      onRemove: () => toggleCondition(c),
    })
  );
  if (minPrice !== undefined || maxPrice !== undefined) {
    const label =
      minPrice && maxPrice
        ? `${formatCompactPrice(minPrice)} – ${formatCompactPrice(maxPrice)}`
        : maxPrice
        ? `Under ${formatCompactPrice(maxPrice)}`
        : `${formatCompactPrice(minPrice!)}+`;
    activeChips.push({
      key: "price",
      label,
      onRemove: () => setPriceRange(undefined, undefined),
    });
  }
  if (minYear !== undefined || maxYear !== undefined) {
    const label =
      minYear && maxYear
        ? `${minYear} – ${maxYear}`
        : minYear
        ? `${minYear}+`
        : `Up to ${maxYear}`;
    activeChips.push({
      key: "year",
      label: `Year: ${label}`,
      onRemove: () => setYearRange(undefined, undefined),
    });
  }
  transmission?.forEach((t) =>
    activeChips.push({
      key: `trans-${t}`,
      label: t,
      onRemove: () => toggleTransmission(t),
    })
  );
  fuelType?.forEach((f) =>
    activeChips.push({
      key: `fuel-${f}`,
      label: f,
      onRemove: () => toggleFuelType(f),
    })
  );
  if (status === "all") {
    activeChips.push({
      key: "status-all",
      label: "Including Sold",
      onRemove: () => setStatus(undefined),
    });
  }

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Page Header Banner */}
      <div className="border-b border-[#0C0C0E]/10 bg-[#EFECE6] pt-8 pb-7 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-500 hover:text-[#D9381E] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home Showroom
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="t-mono text-[0.65rem] text-[#D9381E] font-bold tracking-widest uppercase block mb-1">
                Lagos Automotive Showroom
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C0C0E] tracking-tight">
                Verified Vehicle Inventory
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-dark-600 max-w-xl leading-relaxed">
                Every vehicle below is physically verified on our Lagos lot. 150-point OBD-II inspected, customs duty cleared, and available for immediate inspection.
              </p>
            </div>

            <div className="w-full lg:w-96">
              <SearchBar />
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 pt-1">
            {[
              {
                label: "All Stock",
                isActive: !condition?.length && !bodyType?.length && !maxPrice,
                onClick: () => {
                  useFilterStore.getState().resetFilters();
                },
              },
              {
                label: "Tokunbo (Foreign Used)",
                isActive: condition?.includes("foreign-used"),
                onClick: () => toggleCondition("foreign-used"),
              },
              {
                label: "Brand New",
                isActive: condition?.includes("new"),
                onClick: () => toggleCondition("new"),
              },
              {
                label: "Nigerian Used",
                isActive: condition?.includes("nigerian-used"),
                onClick: () => toggleCondition("nigerian-used"),
              },
              {
                label: "Luxury SUVs",
                isActive: bodyType?.includes("suv"),
                onClick: () => toggleBodyType("suv"),
              },
              {
                label: "Executive Sedans",
                isActive: bodyType?.includes("sedan"),
                onClick: () => toggleBodyType("sedan"),
              },
              {
                label: "Under ₦15M",
                isActive: maxPrice === 15000000,
                onClick: () => setPriceRange(undefined, maxPrice === 15000000 ? undefined : 15000000),
              },
              {
                label: "Under ₦30M",
                isActive: maxPrice === 30000000,
                onClick: () => setPriceRange(undefined, maxPrice === 30000000 ? undefined : 30000000),
              },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={p.onClick}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  p.isActive
                    ? "bg-[#0C0C0E] text-white shadow-xs"
                    : "bg-white text-dark-700 border border-dark-200 hover:border-[#D9381E] hover:text-[#D9381E]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Active Filter Pills Bar */}
          {activeChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3.5 border-t border-dark-900/[0.08]">
              <span className="text-xs font-bold text-dark-500 mr-1">
                Active:
              </span>
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#D9381E]/30 px-3 py-1 text-xs font-bold text-[#D9381E] shadow-2xs hover:bg-danger-soft hover:border-danger/30 hover:text-danger transition-colors capitalize"
                >
                  <span>{chip.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-dark-500 hover:text-[#D9381E] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto py-8 pb-24">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-dark-100 bg-white p-5 shadow-xs">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <>
                <div className="h-12 bg-gray-100 rounded-xl w-full mb-6 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <CarCardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : isError ? (
              <ErrorMessage onRetry={refetch} />
            ) : data ? (
              <>
                <SortBar
                  total={data.total}
                  currentPage={data.page}
                  totalPages={data.totalPages}
                />
                <CarGrid cars={data.cars} />
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  hasNextPage={data.hasNextPage}
                  hasPrevPage={data.hasPrevPage}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <MobileFilterDrawer totalResults={data?.total} />
    </div>
  );
}
