"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, TrendingDown, ArrowRight } from "lucide-react";
import { dealership } from "@/app/config/dealership";

const POPULAR_LINKS = [
  { label: "Toyota", href: "/cars?search=Toyota" },
  { label: "Honda", href: "/cars?search=Honda" },
  { label: "Lexus", href: "/cars?search=Lexus" },
  { label: "Under ₦5M", href: "/cars?maxPrice=5000000" },
  { label: "2020+", href: "/cars?minYear=2020" },
];

export function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchHref = (() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min && min !== "0") params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    const qs = params.toString();
    return `/cars${qs ? `?${qs}` : ""}`;
  })();

  return (
    <section className="relative min-h-[85vh] flex flex-col overflow-hidden bg-ink pb-8">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/herovid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent w-[55%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-end px-2 sm:px-8 lg:px-12 pb-0">
        <div className="flex-1 flex flex-col justify-end max-w-[1400px] mx-auto w-full">
          <div className="max-w-2xl pt-32">
            {/* Location tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-2 mb-5"
            >
              <MapPin className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/40 font-medium tracking-wide">
                {dealership.address.city}, {dealership.address.country}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-[1.05] tracking-[-0.02em] mb-5"
            >
              Find Your<br />Dream Car Today
            </motion.h1>
          </div>

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full mt-8"
          >
            <div
              className={`bg-white rounded-2xl p-5 sm:p-6 transition-all duration-500 ${
                isFocused
                  ? "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4),0_0_0_2px_rgba(22,125,120,0.3)]"
                  : "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)]"
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search field */}
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="hero-search"
                    className="text-[0.6rem] font-bold text-dark-400 uppercase tracking-wider block mb-2"
                  >
                    Search
                  </label>
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-dark-300 shrink-0" />
                    <input
                      id="hero-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          window.location.href = searchHref;
                        }
                      }}
                      placeholder="Toyota, Honda, Lexus..."
                      className="flex-1 bg-transparent text-dark-900 placeholder:text-dark-400 focus:outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200 my-1" />

                {/* Budget */}
                <div className="lg:w-44 shrink-0">
                  <label
                    htmlFor="hero-budget"
                    className="text-[0.6rem] font-bold text-dark-400 uppercase tracking-wider block mb-2"
                  >
                    Budget
                  </label>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-dark-300 shrink-0" />
                    <select
                      id="hero-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="flex-1 bg-transparent text-dark-900 focus:outline-none text-sm font-medium cursor-pointer"
                    >
                      <option value="">Any Price</option>
                      <option value="0-2000000">Under ₦2M</option>
                      <option value="2000000-5000000">₦2M - ₦5M</option>
                      <option value="5000000-10000000">₦5M - ₦10M</option>
                      <option value="10000000-20000000">₦10M - ₦20M</option>
                      <option value="20000000-">₦20M+</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Link
                    href={searchHref}
                    className="w-full lg:w-auto px-8 py-3.5 bg-ink text-white text-sm font-bold rounded-xl hover:bg-graphite transition-all duration-300 flex items-center justify-center gap-2 shrink-0"
                  >
                    Search cars
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Quick filters row */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="text-[0.6rem] text-dark-400 font-medium uppercase tracking-wider">
                  Popular:
                </span>
                {POPULAR_LINKS.map((term) => (
                  <Link
                    key={term.label}
                    href={term.href}
                    className="text-xs text-dark-500 hover:text-teal font-medium transition-colors"
                  >
                    {term.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
