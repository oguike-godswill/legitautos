"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Gauge, Fuel, Calendar, MapPin, Eye, Scale, Check, MessageCircle, TrendingDown } from "lucide-react";
import { Car } from "@/app/types";
import { formatPrice, formatMileage } from "@/app/utils/format";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";
import { useCompare } from "@/app/stores/compareStore";

interface CarCardProps {
  car: Car;
  index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  const { addToCompare, removeFromCompare, compareList } = useCompare();
  const isInCompare = compareList.includes(car._id || car.slug);

  const discount = car.originalPrice
    ? Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)
    : null;

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(car._id || car.slug);
    } else if (compareList.length < 3) {
      addToCompare(car._id || car.slug);
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hello, I'm interested in the ${car.title} (${car.year}) listed for ${formatPrice(car.price)} on the ${dealership.name} website. Is it still available?`;
    window.open(dealershipWhatsApp(message), "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        href={`/cars/${car._id || car.slug}`}
        className="group block rounded-xl overflow-hidden bg-white border border-gray-200/80 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/80 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={car.images[0] || "/images/placeholder-car.jpg"}
            alt={car.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {car.condition === "new" && (
              <span className="px-2 py-0.5 bg-emerald-500 text-white t-mono text-[0.45rem] rounded-full font-medium">
                New
              </span>
            )}
            {car.featured && (
              <span className="px-2 py-0.5 bg-amber-500 text-white t-mono text-[0.45rem] rounded-full font-medium">
                Featured
              </span>
            )}
            {car.status === "sold" && (
              <span className="px-2 py-0.5 bg-danger text-white t-mono text-[0.45rem] rounded-full font-medium">
                Sold
              </span>
            )}
            {car.status === "reserved" && (
              <span className="px-2 py-0.5 bg-warning text-white t-mono text-[0.45rem] rounded-full font-medium">
                Reserved
              </span>
            )}
            {discount && discount > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white t-mono text-[0.45rem] rounded-full font-medium flex items-center gap-1">
                <TrendingDown className="w-2.5 h-2.5" />
                -{discount}%
              </span>
            )}
          </div>

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            disabled={!isInCompare && compareList.length >= 3}
            className={`absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isInCompare
                ? "bg-primary text-white"
                : "bg-white/90 text-dark-500 hover:text-primary hover:bg-white"
            } ${!isInCompare && compareList.length >= 3 ? "opacity-30 cursor-not-allowed" : ""}`}
            title={isInCompare ? "Remove from compare" : "Add to compare"}
          >
            {isInCompare ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          </button>

          {/* Views */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-dark-500 t-mono text-[0.45rem]">
            <Eye className="w-3 h-3" />
            {car.views}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Price - Dominant */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-dark-900">
                {formatPrice(car.price)}
              </span>
              {car.originalPrice && car.originalPrice > car.price && (
                <span className="text-xs text-dark-400 line-through">
                  {formatPrice(car.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Title & Location */}
          <div>
            <h3 className="text-sm font-semibold text-dark-800 group-hover:text-primary transition-colors line-clamp-1">
              {car.title}
            </h3>
            <p className="text-xs text-dark-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {car.location}
            </p>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 t-mono text-[0.45rem] text-dark-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {car.year}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              {formatMileage(car.mileage)}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <Fuel className="w-3 h-3" />
              {car.fuelType}
            </span>
          </div>

          {/* WhatsApp Button */}
          <div className="pt-2 border-t border-gray-100">
            {car.status === "sold" ? (
              <span className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 text-dark-400 text-xs font-semibold rounded-lg">
                <Check className="w-4 h-4" />
                This car has been sold
              </span>
            ) : (
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#128C7E]/10 hover:bg-[#128C7E]/20 text-[#25D366] text-xs font-semibold rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Ask about this car
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

