"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Car as CarIcon,
  Calendar,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { useUIStore } from "@/app/stores/uiStore";
import { useCars } from "@/app/hooks/useCars";
import { formatPrice, formatMileage, formatConditionLabel } from "@/app/utils/format";

const QUICK_SEARCHES = [
  { label: "Toyota SUVs", href: "/cars?brand=Toyota&bodyType=suv" },
  { label: "Lexus RX", href: "/cars?search=Lexus+RX" },
  { label: "Mercedes-Benz", href: "/cars?brand=Mercedes-Benz" },
  { label: "Under ₦10M", href: "/cars?maxPrice=10000000" },
  { label: "₦10M – ₦25M", href: "/cars?minPrice=10000000&maxPrice=25000000" },
  { label: "2020 & Newer", href: "/cars?minYear=2020" },
];

export function CommandSearch() {
  const router = useRouter();
  const { commandSearchOpen, setCommandSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 220);
    return () => clearTimeout(timer);
  }, [query]);

  // Global keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandSearchOpen(!commandSearchOpen);
      } else if (e.key === "Escape" && commandSearchOpen) {
        setCommandSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandSearchOpen, setCommandSearchOpen]);

  useEffect(() => {
    if (commandSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [commandSearchOpen]);

  const { data, isLoading } = useCars({
    search: debouncedQuery || undefined,
    limit: 6,
    sortBy: "newest",
  });

  const results = data?.cars || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommandSearchOpen(false);
    if (query.trim()) {
      router.push(`/cars?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/cars");
    }
  };

  return (
    <AnimatePresence>
      {commandSearchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Quick vehicle search"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/70 backdrop-blur-md"
            onClick={() => setCommandSearchOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-dark-900/10 bg-white shadow-2xl"
          >
            {/* Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 border-b border-dark-100 px-4 py-3.5 sm:px-5"
            >
              <Search className="h-5 w-5 shrink-0 text-teal" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by make, model, year, or keyword (e.g. Camry, GLE, 2021)..."
                className="flex-1 min-w-0 bg-transparent text-base font-medium text-dark-900 placeholder:text-dark-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search query"
                  className="rounded-lg p-1.5 text-dark-400 hover:bg-dark-50 hover:text-dark-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setCommandSearchOpen(false)}
                className="rounded-lg border border-dark-200 px-2.5 py-1 text-xs font-semibold text-dark-500 hover:bg-dark-50"
              >
                ESC
              </button>
            </form>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">
              {/* Quick Filters */}
              <div className="mb-5">
                <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-400">
                  <TrendingUp className="h-3.5 w-3.5 text-teal" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCHES.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setCommandSearchOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-dark-100 bg-dark-50/70 px-3 py-1.5 text-xs font-semibold text-dark-700 transition-colors hover:border-teal hover:bg-teal/5 hover:text-teal"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Matching Results */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-400">
                    <Sparkles className="h-3.5 w-3.5 text-teal" />
                    {debouncedQuery ? `Matching Vehicles (${data?.total || 0})` : "Latest Showroom Arrivals"}
                  </span>
                  <Link
                    href={debouncedQuery ? `/cars?search=${encodeURIComponent(debouncedQuery)}` : "/cars"}
                    onClick={() => setCommandSearchOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal hover:underline"
                  >
                    View all
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-2.5">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-20 animate-pulse rounded-xl bg-dark-50"
                      />
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-dark-200 bg-dark-50/50 p-6 text-center">
                    <CarIcon className="mx-auto mb-2 h-7 w-7 text-dark-300" />
                    <p className="text-sm font-semibold text-dark-800">
                      No exact match for &ldquo;{debouncedQuery}&rdquo; in current stock
                    </p>
                    <p className="mt-1 text-xs text-dark-500">
                      Our sourcing team can find and inspect this exact vehicle for you.
                    </p>
                    <Link
                      href={`/request`}
                      onClick={() => setCommandSearchOpen(false)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-teal-700"
                    >
                      Request This Car
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {results.map((car) => (
                      <Link
                        key={car._id}
                        href={`/cars/${car.slug || car._id}`}
                        onClick={() => setCommandSearchOpen(false)}
                        className="group flex items-center gap-3.5 rounded-xl border border-dark-100/80 bg-white p-2.5 transition-all hover:border-teal/40 hover:bg-teal/[0.02] hover:shadow-sm"
                      >
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-dark-100">
                          <Image
                            src={car.images?.[0] || "/images/placeholder-car.jpg"}
                            alt={car.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="96px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-teal/10 px-2 py-0.5 text-[0.65rem] font-bold text-teal">
                              {formatConditionLabel(car.condition)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-dark-500">
                              <Calendar className="h-3 w-3" />
                              {car.year}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-dark-500">
                              <Gauge className="h-3 w-3" />
                              {formatMileage(car.mileage)}
                            </span>
                          </div>
                          <h4 className="mt-1 truncate text-sm font-bold text-dark-900 group-hover:text-teal">
                            {car.title}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-extrabold text-dark-900">
                            {formatPrice(car.price)}
                          </p>
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-teal">
                            View <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
