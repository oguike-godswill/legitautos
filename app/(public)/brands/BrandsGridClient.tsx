"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, X, ArrowUpRight, ArrowLeft } from "lucide-react";

export type BrandType = {
  _id?: string;
  name: string;
  slug?: string;
  carCount?: number;
  country?: string;
};

const BRAND_COUNTRIES: Record<string, string> = {
  Toyota: "Japan",
  Honda: "Japan",
  Lexus: "Japan",
  Nissan: "Japan",
  "Mercedes-Benz": "Germany",
  BMW: "Germany",
  Audi: "Germany",
  Volkswagen: "Germany",
  Porsche: "Germany",
  Ford: "USA",
  Hyundai: "South Korea",
  Kia: "South Korea",
};

const BRAND_LOGOS: Record<string, string> = {
  Toyota: "https://cdn.worldvectorlogo.com/logos/toyota-1.svg",
  Honda: "https://cdn.worldvectorlogo.com/logos/honda-1.svg",
  Lexus: "https://cdn.worldvectorlogo.com/logos/lexus-1.svg",
  Nissan: "https://cdn.worldvectorlogo.com/logos/nissan-6.svg",
  "Mercedes-Benz": "https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg",
  BMW: "https://cdn.worldvectorlogo.com/logos/bmw.svg",
  Audi: "https://cdn.worldvectorlogo.com/logos/audi-1.svg",
  Volkswagen: "https://cdn.worldvectorlogo.com/logos/volkswagen-3.svg",
  Porsche: "https://cdn.worldvectorlogo.com/logos/porsche-2.svg",
  Ford: "https://cdn.worldvectorlogo.com/logos/ford-4.svg",
  Hyundai: "https://cdn.worldvectorlogo.com/logos/hyundai-motor-company-2.svg",
  Kia: "https://cdn.worldvectorlogo.com/logos/kia-motors-1.svg",
};

function BrandLogo({ name }: { name: string }) {
  const logoUrl = BRAND_LOGOS[name];

  if (logoUrl) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={32}
          height={32}
          className="object-contain opacity-60 group-hover:opacity-90 transition-opacity duration-300"
          unoptimized
        />
      </div>
    );
  }

  const initials = name
    .split(/[\s\-]/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-dark-400">{initials}</span>
    </div>
  );
}

interface BrandsGridClientProps {
  brands: BrandType[];
}

export default function BrandsGridClient({ brands }: BrandsGridClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const enrichedBrands = brands.map((brand) => ({
    ...brand,
    country: brand.country || BRAND_COUNTRIES[brand.name] || "International",
    slug: brand.slug || brand.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  const filteredBrands = enrichedBrands.filter((brand) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry
      ? brand.country === selectedCountry
      : true;
    return matchesSearch && matchesCountry;
  });

  const countries = [...new Set(enrichedBrands.map((b) => b.country))].sort();

  const featuredBrands = [...enrichedBrands]
    .sort((a, b) => (b.carCount || 0) - (a.carCount || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-32 pb-12 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-dark-400 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[0.65rem] font-bold text-primary uppercase tracking-wider block mb-3">
            Manufacturers
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-3 tracking-tight">
            Browse by Brand
          </h1>
          <p className="text-sm text-dark-500 max-w-md leading-relaxed">
            Find your perfect car from {brands.length} trusted manufacturers.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-10 pr-9 py-3 bg-white border border-gray-200 rounded-lg text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-3 h-3 text-dark-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCountry(null)}
              className={`px-3 py-2 rounded-full text-xs whitespace-nowrap transition-all duration-300 ${
                selectedCountry === null
                  ? "bg-primary text-white"
                  : "text-dark-400 hover:text-dark-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All
            </button>
            {countries.map((country) => (
              <button
                key={country}
                onClick={() =>
                  setSelectedCountry(
                    country === selectedCountry ? null : country
                  )
                }
                className={`px-3 py-2 rounded-full text-xs whitespace-nowrap transition-all duration-300 ${
                  selectedCountry === country
                    ? "bg-primary text-white"
                    : "text-dark-400 hover:text-dark-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Featured Brands */}
      {!searchQuery && !selectedCountry && (
        <div className="px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
              Popular Brands
            </h2>
            <span className="text-[0.65rem] text-dark-300">
              {featuredBrands.length} featured
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {featuredBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group block p-4 rounded-xl bg-white border border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400"
                >
                  <div className="flex flex-col items-center text-center gap-2.5">
                    <BrandLogo name={brand.name} />
                    <div>
                      <h3 className="text-xs font-semibold text-dark-700 group-hover:text-primary transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-[0.6rem] text-dark-400 mt-0.5">
                        {brand.country}
                      </p>
                    </div>
                    {typeof brand.carCount === "number" &&
                      brand.carCount > 0 && (
                        <span className="text-[0.65rem] text-dark-400 px-2 py-0.5 rounded-full bg-gray-100">
                          {brand.carCount}
                        </span>
                      )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Brands */}
      <div className="px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
            {searchQuery || selectedCountry ? "Results" : "All Brands"}
          </h2>
          <span className="text-[0.65rem] text-dark-300">
            {filteredBrands.length}
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredBrands.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-4 h-4 text-dark-300" />
              </div>
              <h3 className="text-sm font-medium text-dark-500">
                No brands found
              </h3>
              <p className="text-xs text-dark-400 mt-1">
                Try adjusting your search or filters
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
            >
              {filteredBrands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                  onMouseEnter={() => setHoveredBrand(brand.name)}
                  onMouseLeave={() => setHoveredBrand(null)}
                >
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="group flex items-center gap-3 p-3.5 rounded-lg bg-white border border-gray-200 hover:shadow-md hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300"
                  >
                    <BrandLogo name={brand.name} />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-dark-600 group-hover:text-primary transition-colors truncate">
                        {brand.name}
                      </h3>
                      <p className="text-[0.6rem] text-dark-400 mt-0.5">
                        {brand.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {typeof brand.carCount === "number" && (
                        <span className="text-[0.65rem] text-dark-300 tabular-nums">
                          {brand.carCount}
                        </span>
                      )}
                      <motion.div
                        animate={{
                          x: hoveredBrand === brand.name ? 0 : -3,
                          opacity: hoveredBrand === brand.name ? 1 : 0,
                        }}
                        transition={{ duration: 0.15 }}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                      </motion.div>
                      <ChevronRight className="w-3.5 h-3.5 text-dark-300 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-6 rounded-xl bg-gray-50 border border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-dark-700 mb-0.5">
              Can&apos;t find your brand?
            </h3>
            <p className="text-xs text-dark-500">
              Browse all available cars across every brand.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-600 transition-all duration-300 shrink-0"
          >
            Browse All Cars
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
