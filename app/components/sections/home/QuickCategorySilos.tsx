"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CarFront,
  Truck,
  Sparkles,
  Wallet,
  Globe,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const SILOS = [
  {
    title: "SUVs & Crossovers",
    subtitle: "High ground clearance for Nigerian roads",
    href: "/cars?bodyType=suv",
    icon: CarFront,
    badge: "Most Popular",
  },
  {
    title: "Executive Sedans",
    subtitle: "Fuel-efficient daily drivers & luxury saloons",
    href: "/cars?bodyType=sedan",
    icon: Sparkles,
    badge: "Fuel Savers",
  },
  {
    title: "Foreign Used (Tokunbo)",
    subtitle: "Clean title imports, duty paid & inspected",
    href: "/cars?condition=foreign-used",
    icon: Globe,
    badge: "Direct Import",
  },
  {
    title: "Under ₦10 Million",
    subtitle: "Dependable, thoroughly vetted budget rides",
    href: "/cars?maxPrice=10000000",
    icon: Wallet,
    badge: "Best Value",
  },
  {
    title: "Pickups & Trucks",
    subtitle: "Hilux, Tacoma, Ranger & heavy-duty utility",
    href: "/cars?bodyType=pickup",
    icon: Truck,
    badge: "Work & Fleet",
  },
  {
    title: "Brand New & 2022+",
    subtitle: "Zero-mileage & late-model showroom vehicles",
    href: "/cars?minYear=2022",
    icon: ShieldCheck,
    badge: "Showroom Grade",
  },
];

export function QuickCategorySilos() {
  return (
    <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-dark-900/[0.06]">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-teal">
              Curated Collections
            </span>
            <h2 className="mt-1.5 text-xl font-extrabold uppercase tracking-tight text-dark-900 sm:text-2xl lg:text-3xl">
              Shop by Lifestyle & Budget
            </h2>
          </div>
          <Link
            href="/cars"
            className="text-xs font-bold text-dark-600 hover:text-teal transition-colors"
          >
            Browse Full Showroom &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {SILOS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
            >
              <Link
                href={item.href}
                className="group relative flex items-start justify-between gap-4 rounded-2xl border border-dark-900/[0.08] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-lg"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-dark-50 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-teal">
                      {item.badge}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-dark-900 group-hover:text-teal transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-dark-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-dark-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
