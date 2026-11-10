"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Fuel,
  Gauge,
  Settings2,
  MapPin,
  Scale,
  Check,
  ArrowUpRight,
  Heart,
  Camera,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Car } from "@/app/types";
import {
  formatPrice,
  formatMileage,
  formatConditionLabel,
} from "@/app/utils/format";
import { useCompare } from "@/app/stores/compareStore";
import { useFavorites } from "@/app/stores/favoriteStore";

interface CarCardProps {
  car: Car;
  index?: number;
  /** "default" for grid listings, "featured" for the wide highlight card. */
  variant?: "default" | "featured";
  /** Renders a larger type scale for the first card in a row. */
  priority?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  sold: "bg-[#0C0C0E]/95 text-white",
  reserved: "bg-[#C89D54] text-[#0C0C0E]",
};

export function CarCard({
  car,
  index = 0,
  variant = "default",
  priority = false,
}: CarCardProps) {
  const isFeatured = variant === "featured";
  const isSold = car.status === "sold";
  const isReserved = car.status === "reserved";
  const isUnavailable = isSold || isReserved;

  const images = car.images?.length ? car.images : ["/images/placeholder-car.jpg"];
  const [imgIdx, setImgIdx] = useState(0);

  const { addToCompare, removeFromCompare, compareList } = useCompare();
  const { toggleFavorite, favorites } = useFavorites();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const carId = car._id;
  const carHref = `/cars/${car.slug || car._id}`;
  const isInCompare = mounted && compareList.includes(carId);
  const compareFull = mounted && !isInCompare && compareList.length >= 3;
  const isSaved = mounted && favorites.includes(carId);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(carId);
    } else if (!compareFull) {
      addToCompare(carId, {
        _id: car._id,
        slug: car.slug,
        title: car.title,
        price: car.price,
        year: car.year,
        image: car.images?.[0],
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(carId);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev + 1) % images.length);
  };

  const discountPct =
    car.originalPrice && car.originalPrice > car.price
      ? Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 5) * 0.04 }}
      className="group/card relative h-full"
    >
      <Link
        href={carHref}
        className={`relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#0C0C0E]/10 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D9381E]/50 hover:shadow-[0_24px_50px_-20px_rgba(12,12,14,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9381E] focus-visible:ring-offset-2 ${
          isFeatured ? "lg:flex-row" : ""
        }`}
      >
        {/* Media Frame */}
        <div
          className={`relative shrink-0 overflow-hidden bg-[#EFECE6] ${
            isFeatured ? "aspect-[16/10] lg:aspect-auto lg:w-[56%]" : "aspect-[16/10]"
          }`}
        >
          <Image
            src={images[imgIdx] || images[0]}
            alt={`${car.year} ${car.title}`}
            fill
            priority={priority}
            className={`object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.05] ${
              isSold ? "grayscale-[65%]" : ""
            }`}
            sizes={
              isFeatured
                ? "(max-width: 1024px) 100vw, 56vw"
                : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            }
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/75 via-transparent to-[#0C0C0E]/20" />

          {/* Top Left Badges */}
          <div className="absolute left-3 top-3 flex max-w-[calc(100%-5.5rem)] flex-wrap items-center gap-1.5">
            {isUnavailable && (
              <span
                className={`t-mono rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase backdrop-blur-md ${
                  STATUS_STYLES[car.status]
                }`}
              >
                {car.status}
              </span>
            )}
            {!isUnavailable && car.condition && (
              <span className="t-mono rounded-full bg-[#0C0C0E]/90 border border-white/15 px-2.5 py-1 text-[0.6rem] font-bold uppercase text-white backdrop-blur-md">
                {formatConditionLabel(car.condition)}
              </span>
            )}
            {!isUnavailable && discountPct && discountPct > 0 && (
              <span className="t-mono rounded-full bg-[#D9381E] px-2.5 py-1 text-[0.6rem] font-bold text-white shadow-xs">
                -{discountPct}% DROP
              </span>
            )}
            {!isUnavailable && car.featured && !discountPct && (
              <span className="t-mono rounded-full bg-[#C89D54] px-2.5 py-1 text-[0.6rem] font-bold uppercase text-[#0C0C0E]">
                Atelier Pick
              </span>
            )}
          </div>

          {/* Bottom Image Meta: Location & Photo Counter */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-white">
            <span className="flex min-w-0 items-center gap-1 text-[0.7rem] font-medium text-white/90">
              <MapPin className="h-3 w-3 shrink-0 text-[#D9381E]" />
              <span className="truncate">{car.location}</span>
            </span>

            {images.length > 1 && (
              <span className="t-mono flex shrink-0 items-center gap-1 rounded-full bg-[#0C0C0E]/75 border border-white/15 px-2 py-0.5 text-[0.6rem] font-semibold text-white backdrop-blur-sm">
                <Camera className="h-3 w-3 text-[#C89D54]" />
                {imgIdx + 1}/{images.length}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div
          className={`flex flex-1 flex-col ${
            isFeatured ? "p-5 sm:p-7 lg:justify-center" : "p-4 sm:p-5"
          }`}
        >
          {/* Brand & Body Type Eyebrow */}
          <div className="flex items-center justify-between gap-2">
            <span className="t-mono text-[0.65rem] font-bold text-[#D9381E] truncate">
              {car.brand} • {car.year}
            </span>
            {car.bodyType && (
              <span className="t-mono rounded-md bg-[#EFECE6] px-2 py-0.5 text-[0.58rem] font-bold uppercase text-[#52504D]">
                {car.bodyType}
              </span>
            )}
          </div>

          {/* Vehicle Title */}
          <h3
            className={`font-display mt-1 font-extrabold leading-snug text-[#0C0C0E] transition-colors group-hover/card:text-[#D9381E] ${
              isFeatured
                ? "text-xl sm:text-2xl line-clamp-2"
                : "text-base sm:text-[1.05rem] line-clamp-1"
            }`}
          >
            {car.title}
          </h3>

          {/* Price Block */}
          <div className="mt-2.5 flex flex-wrap items-baseline gap-2">
            <span
              className={`font-display font-black leading-none tracking-tight text-[#0C0C0E] ${
                isFeatured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
              }`}
            >
              {formatPrice(car.price)}
            </span>
            {car.originalPrice && car.originalPrice > car.price && (
              <span className="t-mono text-xs text-[#787884] line-through">
                {formatPrice(car.originalPrice)}
              </span>
            )}
          </div>

          {isFeatured && car.description && (
            <p className="mt-3 hidden text-sm leading-relaxed text-[#52504D] lg:line-clamp-2">
              {car.description}
            </p>
          )}

          {/* Core 4 Automotive Specs Grid */}
          <div
            className={`mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#FAF9F6] border border-[#0C0C0E]/[0.06] p-2.5 text-xs font-medium text-[#2B2B30] ${
              isFeatured ? "sm:grid-cols-4" : ""
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-[#D9381E]" />
              <span className="t-mono text-[0.68rem]">{car.year}</span>
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Gauge className="h-3.5 w-3.5 shrink-0 text-[#D9381E]" />
              <span className="t-mono text-[0.68rem] truncate">{formatMileage(car.mileage)}</span>
            </span>
            <span className="flex items-center gap-1.5 truncate capitalize">
              <Settings2 className="h-3.5 w-3.5 shrink-0 text-[#D9381E]" />
              <span className="truncate text-xs font-semibold">{car.transmission}</span>
            </span>
            <span className="flex items-center gap-1.5 truncate capitalize">
              <Fuel className="h-3.5 w-3.5 shrink-0 text-[#D9381E]" />
              <span className="truncate text-xs font-semibold">{car.fuelType}</span>
            </span>
          </div>

          {/* Footer Action */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold transition-colors ${
                isSold
                  ? "text-[#787884]"
                  : "text-[#0C0C0E] group-hover/card:text-[#D9381E]"
              }`}
            >
              {isSold ? "View Archive" : "Inspect Vehicle"}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
            </span>

            {isSold ? (
              <span className="t-mono flex items-center gap-1 text-[0.62rem] font-bold text-[#DC2626]">
                <Check className="h-3 w-3" />
                SOLD
              </span>
            ) : (
              <span className="t-mono inline-flex items-center gap-1 text-[0.62rem] font-bold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                DUTY PAID
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Image Scrub Arrows (Desktop Hover when >1 image) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevImg}
            aria-label="Previous car photo"
            className="absolute left-2.5 top-[26%] z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0C0C0E] opacity-0 shadow-md transition-opacity hover:bg-white group-hover/card:opacity-100 sm:flex cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextImg}
            aria-label="Next car photo"
            className="absolute right-2.5 top-[26%] z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#0C0C0E] opacity-0 shadow-md transition-opacity hover:bg-white group-hover/card:opacity-100 sm:flex cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Top-Right Action Buttons (Save + Compare) */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isSaved ? "Remove from saved garage" : "Save to garage"}
          title={isSaved ? "Saved in garage" : "Save car"}
          className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isSaved
              ? "bg-[#D9381E] text-white shadow-sm"
              : "bg-white/90 text-[#0C0C0E] hover:bg-white hover:text-[#D9381E]"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleCompare}
          disabled={compareFull}
          aria-label={isInCompare ? "Remove from compare" : "Add to compare"}
          title={
            compareFull
              ? "Compare list is full (max 3)"
              : isInCompare
              ? "Remove from compare"
              : "Add to compare"
          }
          className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isInCompare
              ? "bg-[#0C0C0E] text-white shadow-sm"
              : "bg-white/90 text-[#0C0C0E] hover:bg-white hover:text-[#D9381E]"
          } ${compareFull ? "cursor-not-allowed opacity-40" : ""}`}
        >
          {isInCompare ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Scale className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </motion.article>
  );
}
