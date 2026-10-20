"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Brand } from "@/app/types";

interface BrandsRowProps {
  brands: Brand[];
}

/**
 * Category browser: manufacturers read from the live API, ordered by how many
 * cars we actually have. Counts only render when the API supplies a real one.
 */
export function BrandsRow({ brands }: BrandsRowProps) {
  if (brands.length === 0) return null;

  const ordered = [...brands].sort((a, b) => (b.carCount || 0) - (a.carCount || 0));

  return (
    <section className="py-16 px-2 sm:px-8 lg:px-12 bg-ivory">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em]"
            >
              Categories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
            >
              Shop by Brand
            </motion.h2>
          </div>
          <Link
            href="/cars"
            className="flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-teal transition-colors group"
          >
            All Cars{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {ordered.slice(0, 12).map((brand, i) => {
            const hasCount = typeof brand.carCount === "number" && brand.carCount > 0;

            return (
              <motion.div
                key={brand._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <Link
                  href={`/cars?brand=${encodeURIComponent(brand.name)}`}
                  className="group relative h-full min-h-[176px] rounded-2xl bg-white border border-gray-200/80 p-5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-300/40 hover:border-teal/30 hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Hover wash */}
                  <div className="absolute inset-0 bg-gradient-to-b from-teal/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative flex items-start justify-between w-full">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden group-hover:bg-white transition-colors duration-300">
                      {brand.logo ? (
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={44}
                          height={44}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-dark-300 group-hover:text-teal transition-colors duration-300">
                          {brand.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-dark-200 group-hover:text-teal group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>

                  <div className="relative mt-5">
                    <h3 className="text-sm font-bold text-dark-800 group-hover:text-teal transition-colors truncate">
                      {brand.name}
                    </h3>
                    <p className="text-[0.65rem] text-dark-400 mt-1">
                      {hasCount
                        ? `${brand.carCount} ${brand.carCount === 1 ? "car" : "cars"} in stock`
                        : "View inventory"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
