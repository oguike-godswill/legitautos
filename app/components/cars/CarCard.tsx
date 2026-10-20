"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Gauge,
  Fuel,
  Calendar,
  MapPin,
  Scale,
  Check,
  ArrowRight,
  TrendingDown,
  Settings2,
} from "lucide-react";
import { Car } from "@/app/types";
import { formatPrice, formatMileage } from "@/app/utils/format";
import { useCompare } from "@/app/stores/compareStore";

interface CarCardProps {
  car: Car;
  index?: number;
  /** "default" for grid listings, "featured" for the wide highlight card. */
  variant?: "default" | "featured";
  /** Renders a larger type scale for the first card in a row. */
  priority?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  sold: "bg-dark-900/90 text-white",
  reserved: "bg-warning text-white",
};

/**
 * Inventory card. Purely presentational: the whole card links to the car page
 * and WhatsApp enquiries are handled there, so no click target nests a button
 * inside another link.
 */
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

  const { addToCompare, removeFromCompare, compareList } = useCompare();
  const carId = car._id || car.slug;
  const isInCompare = compareList.includes(carId);
  const compareFull = !isInCompare && compareList.length >= 3;

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) removeFromCompare(carId);
    else if (!compareFull) addToCompare(carId);
  };

  const discount =
    car.originalPrice && car.originalPrice > car.price
      ? Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)
      : null;

  const specs = [
    { icon: Calendar, value: car.year.toString() },
    { icon: Gauge, value: formatMileage(car.mileage) },
    { icon: Settings2, value: car.transmission },
    { icon: Fuel, value: car.fuelType },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.05 }}
      className="relative h-full"
    >
      <Link
        href={`/cars/${car._id || car.slug}`}
        className={`group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-dark-900/[0.07] bg-white transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-dark-900/15 hover:shadow-[0_28px_60px_-24px_rgba(23,26,30,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${
          isFeatured ? "lg:flex-row" : ""
        }`}
      >
        {/* Media */}
        <div
          className={`relative shrink-0 overflow-hidden bg-dark-900/[0.04] ${
            isFeatured ? "aspect-[4/3] lg:aspect-auto lg:w-[58%]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={car.images[0] || "/images/placeholder-car.jpg"}
            alt={car.title}
            fill
            priority={priority}
            className={`object-cover transition-transform duration-[600ms] ease-out group-hover/card:scale-[1.06] ${
              isSold ? "grayscale-[60%]" : ""
            }`}
            sizes={
              isFeatured
                ? "(max-width: 1024px) 100vw, 58vw"
                : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw"
            }
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900/45 via-dark-900/0 to-dark-900/5" />

          {/* Status + promo badges */}
          <div className="absolute left-2 top-2 flex max-w-[calc(100%-2.75rem)] flex-wrap items-center gap-1 sm:left-3 sm:top-3 sm:max-w-[calc(100%-3.5rem)] sm:gap-1.5">
            {isUnavailable && (
              <span
                className={`t-mono rounded-full px-2 py-1 text-[0.5rem] backdrop-blur-sm sm:px-2.5 ${
                  STATUS_STYLES[car.status]
                }`}
              >
                {car.status}
              </span>
            )}
            {!isUnavailable && car.featured && (
              <span className="t-mono rounded-full bg-white px-2 py-1 text-[0.5rem] text-dark-700 sm:px-2.5">
                Featured
              </span>
            )}
            {!isUnavailable && car.condition === "new" && (
              <span className="t-mono rounded-full bg-teal px-2 py-1 text-[0.5rem] text-white sm:px-2.5">
                New
              </span>
            )}
            {!isUnavailable && car.condition === "certified" && (
              <span className="t-mono rounded-full bg-white/95 px-2 py-1 text-[0.5rem] text-dark-700 sm:px-2.5">
                Certified
              </span>
            )}
            {discount && discount > 0 && !isUnavailable && (
              <span className="t-mono flex items-center gap-1 rounded-full bg-rose-500 px-2 py-1 text-[0.5rem] text-white sm:px-2.5">
                <TrendingDown className="h-2.5 w-2.5" />
                {discount}%
              </span>
            )}
          </div>

          {/* Price chip on the media */}
          <div className="absolute bottom-2 left-2 flex items-end sm:bottom-3 sm:left-3">
            <div className="max-w-full rounded-lg bg-white/95 px-2 py-1.5 backdrop-blur-md shadow-sm sm:rounded-xl sm:px-3 sm:py-2">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`truncate font-bold leading-none text-dark-900 ${
                    isFeatured ? "text-xl" : "text-sm sm:text-base"
                  }`}
                >
                  {formatPrice(car.price)}
                </span>
                {car.originalPrice && car.originalPrice > car.price && (
                  <span className="hidden text-[0.65rem] text-dark-400 line-through sm:inline">
                    {formatPrice(car.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          className={`flex flex-1 flex-col ${
            isFeatured ? "p-6 lg:justify-center lg:p-9" : "p-3 sm:p-4"
          }`}
        >
          <h3
            className={`font-semibold leading-snug text-dark-900 transition-colors group-hover/card:text-teal ${
              isFeatured ? "text-xl sm:text-2xl line-clamp-2" : "text-sm line-clamp-2"
            }`}
          >
            {car.title}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-dark-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{car.location}</span>
          </p>

          {isFeatured && car.description && (
            <p className="mt-4 hidden text-sm leading-relaxed text-dark-500 lg:line-clamp-3">
              {car.description}
            </p>
          )}

          {/* Spec strip */}
          <div
            className={`mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-dark-900/[0.06] ${
              isFeatured ? "py-4 lg:gap-x-6" : "py-3"
            }`}
          >
            {specs.map((spec) => (
              <span
                key={spec.value + spec.icon.displayName}
                className="flex items-center gap-1.5 text-[0.7rem] capitalize text-dark-500"
              >
                <spec.icon className="h-3.5 w-3.5 shrink-0 text-dark-300" />
                <span className="truncate">{spec.value}</span>
              </span>
            ))}
          </div>

          {/* Footer action */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                isSold
                  ? "text-dark-400"
                  : "text-dark-900 group-hover/card:text-teal"
              }`}
            >
              {isSold ? (
                "View details"
              ) : (
                <>
                  {/* Short label for narrow cards; the full phrase below is the
                      accessible one, so hide this from screen readers. */}
                  <span aria-hidden="true" className="sm:hidden">
                    Enquire
                  </span>
                  <span className="hidden sm:inline">Enquire on WhatsApp</span>
                </>
              )}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-1" />
            </span>
            {isSold && (
              <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-danger">
                <Check className="h-3 w-3" />
                Sold
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Compare toggle — kept outside the link so it stays a real button */}
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
        className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:rounded-xl ${
          isInCompare
            ? "bg-teal text-white shadow-sm"
            : "bg-white/85 text-dark-500 hover:bg-white hover:text-teal sm:opacity-0 sm:group-hover/card:opacity-100 focus-visible:opacity-100"
        } ${compareFull ? "cursor-not-allowed opacity-40" : ""}`}
      >
        {isInCompare ? (
          <Check className="h-4 w-4" />
        ) : (
          <Scale className="h-4 w-4" />
        )}
      </button>
    </motion.div>
  );
}
