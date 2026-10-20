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
import { ArrowLeft } from "lucide-react";

export default function CarsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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
  } = useFilterStore();

  // Seed filters from the URL once, so shared links like /cars?brand=bmw
  // work without clobbering choices the visitor makes afterwards.
  const seededFromUrl = useRef(false);
  useEffect(() => {
    if (seededFromUrl.current) return;
    seededFromUrl.current = true;

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

    const store = useFilterStore.getState();

    if (s) store.setSearch(s);
    if (b) store.setBrand(b.split(","));
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
    if (sort) store.setSortBy(sort as CarFilters["sortBy"]);
    if (p) store.setPage(Number(p));
  }, [searchParams]);

  // Mirror filter changes back into the URL (replaceState, no navigation) so
  // the current view is shareable and survives a reload.
  const queryString = useFilterStore((state) => state.getQueryString());
  useEffect(() => {
    if (!seededFromUrl.current) return;
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(target, { scroll: false });
  }, [queryString, pathname, router]);

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
          Browse the cars currently in our inventory. Filter by brand, price and
          year to narrow things down.
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
