"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Handshake,
  Gauge,
} from "lucide-react";
import { dealership } from "@/app/config/dealership";

const POPULAR_LINKS = [
  { label: "Toyota", href: "/cars?search=Toyota" },
  { label: "Honda", href: "/cars?search=Honda" },
  { label: "Lexus", href: "/cars?search=Lexus" },
  { label: "Under ₦5M", href: "/cars?maxPrice=5000000" },
  { label: "2020+", href: "/cars?minYear=2020" },
];

/* Only claims the dealership can stand behind. */
const ASSURANCES = [
  { icon: Handshake, label: "Direct from the dealership" },
  { icon: ShieldCheck, label: "Live availability on every car" },
  { icon: Gauge, label: "Full specs and asking price upfront" },
];

export function HeroSearch() {
  const router = useRouter();
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
    <section className="px-2 pb-10 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-ink">
        {/* Backdrop */}
        <div className="absolute inset-0" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/herovid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/70" />
        </div>

        <div className="relative px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-14 lg:pt-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal/30 bg-teal/10 backdrop-blur-sm mb-6"
            >
              <MapPin className="w-3.5 h-3.5 text-teal" />
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/85">
                {dealership.address.city}, {dealership.address.country}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-[2.1rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold text-white uppercase leading-[0.98] tracking-[-0.03em]"
            >
              Find Your
              <br />
              <span className="relative inline-block text-teal">
                Next Car
                {/* Underline accent anchoring the highlighted phrase. */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-teal/50"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-7 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed"
            >
              Browse the cars currently on our lot at {dealership.name}. Every
              page shows the real asking price, full specifications and whether
              the car is still available.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6"
            >
              {ASSURANCES.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-[0.8rem] font-medium text-white/90"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/15">
                    <item.icon className="h-3.5 w-3.5 text-teal" />
                  </span>
                  {item.label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Search panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden w-full lg:col-span-5 lg:block"
          >
            <div
              className={`bg-white rounded-2xl p-4 sm:p-5 transition-all duration-500 ${
                isFocused
                  ? "shadow-[0_12px_50px_-12px_rgba(0,0,0,0.5),0_0_0_2px_rgba(22,125,120,0.35)]"
                  : "shadow-[0_12px_50px_-12px_rgba(0,0,0,0.5)]"
              }`}
            >
              <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider mb-4">
                Search Inventory
              </h2>

              <div className="space-y-3">
                {/* Search field */}
                <div>
                  <label
                    htmlFor="hero-search"
                    className="text-[0.6rem] font-bold text-dark-400 uppercase tracking-wider block mb-2"
                  >
                    Make or model
                  </label>
                  <div className="flex items-center gap-3 px-4 h-11 rounded-xl border border-gray-200 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15 transition-all">
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
                          router.push(searchHref);
                        }
                      }}
                      placeholder="Toyota, Honda, Lexus..."
                      className="flex-1 min-w-0 bg-transparent text-dark-900 placeholder:text-dark-300 focus:outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label
                    htmlFor="hero-budget"
                    className="text-[0.6rem] font-bold text-dark-400 uppercase tracking-wider block mb-2"
                  >
                    Budget
                  </label>
                  <div className="flex items-center gap-3 px-4 h-11 rounded-xl border border-gray-200 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15 transition-all">
                    <TrendingDown className="w-4 h-4 text-dark-300 shrink-0" />
                    <select
                      id="hero-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent text-dark-900 focus:outline-none text-sm font-medium cursor-pointer"
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

                <Link
                  href={searchHref}
                  className="w-full h-11 bg-ink text-white text-sm font-bold rounded-xl hover:bg-teal transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Search cars
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-gray-100">
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
      </div>
    </section>
  );
}
