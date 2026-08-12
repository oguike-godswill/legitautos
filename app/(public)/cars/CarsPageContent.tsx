"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFilterStore } from "@/app/stores/filterStore";
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
import { ArrowLeft } from "lucide-react";

export default function CarsPageContent() {
  const searchParams = useSearchParams();
  const {
    search,
    brand,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    transmission,
    fuelType,
    condition,
    sortBy,
    page,
    setSearch,
    setBrand,
    setPriceRange,
    setYearRange,
    setTransmission,
    setFuelType,
    setCondition,
    setSortBy,
    setPage,
  } = useFilterStore();

  useEffect(() => {
    const s = searchParams.get("search");
    const b = searchParams.get("brand");
    const minP = searchParams.get("minPrice");
    const maxP = searchParams.get("maxPrice");
    const minY = searchParams.get("minYear");
    const maxY = searchParams.get("maxYear");
    const t = searchParams.get("transmission");
    const f = searchParams.get("fuelType");
    const c = searchParams.get("condition");
    const sort = searchParams.get("sortBy");
    const p = searchParams.get("page");

    if (s) setSearch(s);
    if (b) setBrand(b.split(","));
    if (minP || maxP)
      setPriceRange(
        minP ? Number(minP) : undefined,
        maxP ? Number(maxP) : undefined
      );
    if (minY || maxY)
      setYearRange(
        minY ? Number(minY) : undefined,
        maxY ? Number(maxY) : undefined
      );
    if (t) setTransmission(t.split(","));
    if (f) setFuelType(f.split(","));
    if (c) setCondition(c.split(","));
    if (sort) setSortBy(sort as typeof sortBy);
    if (p) setPage(Number(p));
  }, []);

  const { data, isLoading, isError, refetch } = useCars({
    search,
    brand,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    transmission,
    fuelType,
    condition,
    sortBy,
    page,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-28 pb-6 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 t-mono text-[0.5rem] text-dark-400 hover:text-dark-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to home
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-3 tracking-tight">
          Browse Cars
        </h1>
        <p className="text-sm text-dark-500 max-w-md leading-relaxed mb-8">
          Find your perfect car from our collection of verified listings.
        </p>

        <div className="max-w-xl">
          <SearchBar />
        </div>
      </div>

      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <>
                <div className="h-8 bg-gray-100 rounded-lg w-full mb-6 animate-pulse" />
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

      <MobileFilterDrawer />
    </div>
  );
}
