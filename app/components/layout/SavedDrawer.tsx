"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Trash2,
  ArrowRight,
  MessageCircle,
  Scale,
  Calendar,
  Gauge,
} from "lucide-react";
import { useUIStore } from "@/app/stores/uiStore";
import { useFavorites } from "@/app/stores/favoriteStore";
import { useCompare } from "@/app/stores/compareStore";
import { useCars } from "@/app/hooks/useCars";
import { formatPrice, formatMileage, formatConditionLabel } from "@/app/utils/format";
import { dealershipWhatsApp, dealership } from "@/app/config/dealership";

export function SavedDrawer() {
  const { savedDrawerOpen, setSavedDrawerOpen } = useUIStore();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { addToCompare, compareList } = useCompare();

  const { data, isLoading } = useCars(
    favorites.length > 0
      ? { ids: favorites, limit: 20 }
      : undefined
  );

  const savedCars = favorites.length > 0 ? data?.cars || [] : [];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && savedDrawerOpen) {
        setSavedDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [savedDrawerOpen, setSavedDrawerOpen]);

  const shareShortlistText =
    savedCars.length > 0
      ? `Hello ${dealership.name}, I shortlisted ${savedCars.length} car(s) on your website and would like to enquire:\n` +
        savedCars
          .map(
            (c, i) =>
              `${i + 1}. ${c.title} (${c.year}) — ${formatPrice(c.price)}`
          )
          .join("\n")
      : undefined;

  return (
    <AnimatePresence>
      {savedDrawerOpen && (
        <div
          className="fixed inset-0 z-[95]"
          role="dialog"
          aria-modal="true"
          aria-label="Saved Garage"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setSavedDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-10 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-soft text-danger">
                  <Heart className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-dark-900">
                    Saved Garage
                  </h2>
                  <p className="text-xs text-dark-500">
                    {favorites.length}{" "}
                    {favorites.length === 1 ? "vehicle" : "vehicles"} shortlisted
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {favorites.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFavorites}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-dark-500 hover:bg-dark-50 hover:text-danger"
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSavedDrawerOpen(false)}
                  aria-label="Close Saved Garage"
                  className="rounded-xl p-2 text-dark-500 hover:bg-dark-50 hover:text-dark-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {favorites.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
                    <Heart className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-dark-900">
                    Your garage is empty
                  </h3>
                  <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-dark-500">
                    Tap the heart icon on any vehicle while browsing to save it
                    here for quick comparison or WhatsApp enquiry.
                  </p>
                  <Link
                    href="/cars"
                    onClick={() => setSavedDrawerOpen(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-teal-700"
                  >
                    Explore Inventory
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : isLoading ? (
                <div className="space-y-3">
                  {favorites.map((id) => (
                    <div
                      key={id}
                      className="h-24 animate-pulse rounded-2xl bg-dark-50"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {savedCars.map((car) => {
                    const inCompare = compareList.includes(car._id);
                    return (
                      <div
                        key={car._id}
                        className="group relative flex gap-3.5 rounded-2xl border border-dark-100 bg-white p-3 shadow-xs transition-all hover:border-teal/40 hover:shadow-md"
                      >
                        <Link
                          href={`/cars/${car.slug || car._id}`}
                          onClick={() => setSavedDrawerOpen(false)}
                          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-dark-100"
                        >
                          <Image
                            src={
                              car.images?.[0] || "/images/placeholder-car.jpg"
                            }
                            alt={car.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="112px"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/cars/${car.slug || car._id}`}
                              onClick={() => setSavedDrawerOpen(false)}
                              className="truncate text-sm font-bold text-dark-900 hover:text-teal"
                            >
                              {car.title}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFavorite(car._id)}
                              aria-label={`Remove ${car.title} from saved`}
                              className="shrink-0 rounded-lg p-1 text-dark-400 hover:bg-danger-soft hover:text-danger"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <p className="mt-0.5 text-sm font-extrabold text-teal">
                            {formatPrice(car.price)}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.7rem] text-dark-500">
                            <span className="rounded bg-dark-50 px-1.5 py-0.5 font-semibold text-dark-700">
                              {formatConditionLabel(car.condition)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {car.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gauge className="h-3 w-3" />
                              {formatMileage(car.mileage)}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                addToCompare(car._id, {
                                  _id: car._id,
                                  slug: car.slug,
                                  title: car.title,
                                  price: car.price,
                                  year: car.year,
                                  image: car.images?.[0],
                                })
                              }
                              disabled={inCompare || compareList.length >= 3}
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[0.7rem] font-semibold transition-colors ${
                                inCompare
                                  ? "bg-teal/10 text-teal"
                                  : "bg-dark-50 text-dark-700 hover:bg-dark-100"
                              }`}
                            >
                              <Scale className="h-3 w-3" />
                              {inCompare ? "In Compare" : "Compare"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {savedCars.length > 0 && (
              <div className="border-t border-dark-100 bg-dark-50/50 p-4 space-y-2.5">
                <a
                  href={dealershipWhatsApp(shareShortlistText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#128C7E] py-3 text-xs font-bold text-white transition-colors hover:bg-[#0e7a6e]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire About Shortlist on WhatsApp
                </a>
                {compareList.length > 0 && (
                  <Link
                    href="/compare"
                    onClick={() => setSavedDrawerOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white py-2.5 text-xs font-bold text-dark-800 transition-colors hover:bg-dark-50"
                  >
                    <Scale className="h-4 w-4 text-teal" />
                    Compare Selected ({compareList.length}/3)
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
