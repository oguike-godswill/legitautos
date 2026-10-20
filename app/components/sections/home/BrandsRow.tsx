"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/app/types";

interface BrandsRowProps {
  brands: Brand[];
}

export function BrandsRow({ brands }: BrandsRowProps) {
  if (brands.length === 0) return null;

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
              Manufacturers
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
            >
              Shop by Brand
            </motion.h2>
          </div>
          <Link
            href="/brands"
            className="flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-teal transition-colors group"
          >
            All Brands{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {brands.slice(0, 12).map((brand, i) => (
            <motion.div
              key={brand._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
            >
              <Link
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-gray-200/80 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/80 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal/5 transition-colors duration-300 overflow-hidden">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-dark-300 group-hover:text-teal transition-colors">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xs font-semibold text-dark-800 group-hover:text-teal transition-colors truncate w-full">
                    {brand.name}
                  </h3>
                  {brand.carCount > 0 && (
                    <p className="text-[0.55rem] text-dark-400 mt-0.5">
                      {brand.carCount} {brand.carCount === 1 ? "car" : "cars"}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
