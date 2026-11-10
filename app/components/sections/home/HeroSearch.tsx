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
  CarFront,
  Sparkles,
} from "lucide-react";
import { dealership } from "@/app/config/dealership";

const POPULAR_LINKS = [
  { label: "Foreign Used", href: "/cars?condition=foreign-used" },
  { label: "Brand New", href: "/cars?condition=new" },
  { label: "Toyota", href: "/cars?brand=Toyota" },
  { label: "Lexus", href: "/cars?brand=Lexus" },
  { label: "Mercedes-Benz", href: "/cars?brand=Mercedes-Benz" },
  { label: "Under ₦10M", href: "/cars?maxPrice=10000000" },
  { label: "2020+", href: "/cars?minYear=2020" },
];

const BODY_STYLES = [
  { value: "", label: "All Body Types" },
  { value: "suv", label: "SUV / Crossover" },
  { value: "sedan", label: "Sedan" },
  { value: "coupe", label: "Coupe / Sport" },
  { value: "pickup", label: "Pickup / Truck" },
  { value: "hatchback", label: "Hatchback" },
  { value: "van", label: "Bus / Van" },
];

/* Only claims the dealership can stand behind. */
const ASSURANCES = [
  { icon: Handshake, label: "Direct from our Lagos showroom" },
  { icon: ShieldCheck, label: "Walkaround video & live status" },
  { icon: Gauge, label: "Transparent asking price upfront" },
];

export function HeroSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [conditionTab, setConditionTab] = useState<string>("");
  const [bodyType, setBodyType] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const searchHref = (() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (conditionTab) params.set("condition", conditionTab);
    if (bodyType) params.set("bodyType", bodyType);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min && min !== "0") params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    const qs = params.toString();
    return `/cars${qs ? `?${qs}` : ""}`;
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchHref);
  };

  return (
    <section className="px-3 pb-8 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-24">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-ink shadow-xl">
        {/* Video & Gradient Backdrop */}
        <div className="absolute inset-0" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/og-image.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          >
            <source src="/herovid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        </div>

        <div className="relative px-4 pb-8 pt-8 sm:px-8 sm:pb-12 sm:pt-12 lg:px-12 lg:pb-14 lg:pt-14">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Copy Column */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/15 px-3.5 py-1.5 backdrop-blur-sm sm:mb-6"
              >
                <MapPin className="h-3.5 w-3.5 text-teal" />
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-white">
                  {dealership.address.area}, {dealership.address.city} Showroom
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl font-extrabold uppercase leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
              >
                Buy Verified Cars
                <br />
                <span className="relative inline-block text-teal">
                  Without Guesswork.
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-teal/60"
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-6 sm:text-base lg:text-lg"
              >
                Inspect real showroom inventory in {dealership.address.city}. Every listing
                shows transparent pricing, real condition footage, and live availability.
              </motion.p>

              {/* Assurances — visible on tablet/desktop */}
              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 hidden flex-wrap gap-x-6 gap-y-2.5 sm:flex"
              >
                {ASSURANCES.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-xs font-semibold text-white/90"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/20">
                      <item.icon className="h-3.5 w-3.5 text-teal" />
                    </span>
                    {item.label}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Right Search Console — Now Visible on ALL Screens (Mobile + Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full lg:col-span-5"
            >
              <form
                onSubmit={handleSubmit}
                className={`rounded-2xl bg-white p-4 sm:p-6 transition-all duration-300 ${
                  isFocused
                    ? "shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6),0_0_0_2px_rgba(22,125,120,0.5)]"
                    : "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
                }`}
              >
                {/* Condition Tabs */}
                <div className="mb-4 grid grid-cols-4 gap-1 rounded-xl bg-dark-50 p-1">
                  {[
                    { value: "", label: "All" },
                    { value: "foreign-used", label: "Foreign Used" },
                    { value: "nigerian-used", label: "NG Used" },
                    { value: "new", label: "Brand New" },
                  ].map((tab) => {
                    const active = conditionTab === tab.value;
                    return (
                      <button
                        key={tab.label}
                        type="button"
                        onClick={() => setConditionTab(tab.value)}
                        className={`rounded-lg py-2 text-[0.7rem] font-bold transition-all ${
                          active
                            ? "bg-white text-teal shadow-xs"
                            : "text-dark-500 hover:text-dark-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {/* Search Field */}
                  <div>
                    <label
                      htmlFor="hero-search"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-dark-500"
                    >
                      Make, Model, or Keyword
                    </label>
                    <div className="flex h-11 items-center gap-2.5 rounded-xl border border-dark-200 bg-dark-50/40 px-3.5 transition-all focus-within:border-teal focus-within:bg-white focus-within:ring-2 focus-within:ring-teal/15">
                      <Search className="h-4 w-4 shrink-0 text-teal" />
                      <input
                        id="hero-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="e.g. Toyota Camry, Lexus RX 350, GLE..."
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-dark-900 placeholder:text-dark-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 2-Column Selects: Budget + Body Type */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="hero-budget"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-dark-500"
                      >
                        Price Range
                      </label>
                      <div className="flex h-11 items-center gap-2 rounded-xl border border-dark-200 bg-dark-50/40 px-3 transition-all focus-within:border-teal focus-within:bg-white focus-within:ring-2 focus-within:ring-teal/15">
                        <TrendingDown className="h-4 w-4 shrink-0 text-dark-400" />
                        <select
                          id="hero-budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="min-w-0 flex-1 cursor-pointer bg-transparent text-sm font-medium text-dark-900 focus:outline-none"
                        >
                          <option value="">Any Budget</option>
                          <option value="0-5000000">Under ₦5M</option>
                          <option value="5000000-10000000">₦5M – ₦10M</option>
                          <option value="10000000-20000000">₦10M – ₦20M</option>
                          <option value="20000000-40000000">₦20M – ₦40M</option>
                          <option value="40000000-">₦40M+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="hero-bodytype"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-dark-500"
                      >
                        Body Style
                      </label>
                      <div className="flex h-11 items-center gap-2 rounded-xl border border-dark-200 bg-dark-50/40 px-3 transition-all focus-within:border-teal focus-within:bg-white focus-within:ring-2 focus-within:ring-teal/15">
                        <CarFront className="h-4 w-4 shrink-0 text-dark-400" />
                        <select
                          id="hero-bodytype"
                          value={bodyType}
                          onChange={(e) => setBodyType(e.target.value)}
                          className="min-w-0 flex-1 cursor-pointer bg-transparent text-sm font-medium text-dark-900 focus:outline-none"
                        >
                          {BODY_STYLES.map((style) => (
                            <option key={style.value} value={style.value}>
                              {style.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-teal-700 cursor-pointer"
                  >
                    Search Showroom Inventory
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick Filter Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-dark-100 pt-3.5">
                  <span className="mr-1 flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-wider text-dark-400">
                    <Sparkles className="h-3 w-3 text-teal" />
                    Quick:
                  </span>
                  {POPULAR_LINKS.map((term) => (
                    <Link
                      key={term.label}
                      href={term.href}
                      className="rounded-full border border-dark-100 bg-dark-50/70 px-2.5 py-1 text-xs font-semibold text-dark-600 transition-colors hover:border-teal hover:bg-teal/5 hover:text-teal"
                    >
                      {term.label}
                    </Link>
                  ))}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
