"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CarCard } from "@/app/components/cars/CarCard";
import { Car } from "@/app/types";

interface InventoryRowProps {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  cars: Car[];
}

/**
 * Shared homepage inventory row: heading + link + responsive grid of CarCard.
 * Used for both "Featured Cars" and "Latest Arrivals".
 */
export function InventoryRow({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel = "View All",
  cars,
}: InventoryRowProps) {
  if (cars.length === 0) return null;

  return (
    <section className="py-16 px-2 sm:px-8 lg:px-12 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em]"
            >
              {eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
            >
              {title}
            </motion.h2>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-teal transition-colors group"
          >
            {viewAllLabel}{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cars.slice(0, 8).map((car, i) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
