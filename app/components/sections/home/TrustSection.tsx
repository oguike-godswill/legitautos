"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CircleDollarSign, RotateCw, LayoutGrid, Handshake, ArrowRight } from "lucide-react";

/* Only claims the dealership can substantiate. No fake metrics or guarantees. */
const REASONS = [
  {
    icon: CircleDollarSign,
    title: "Transparent Pricing",
    desc: "Every car page shows the full asking price upfront. What you see is what you discuss — no hidden fees.",
  },
  {
    icon: Handshake,
    title: "One Dealership, Direct Answers",
    desc: "You deal with the LegitAutos team from first message to handover. No third-party sellers in between.",
  },
  {
    icon: RotateCw,
    title: "Current Availability",
    desc: "Each car page shows live status — available, reserved, or sold — so you know what you're enquiring about.",
  },
  {
    icon: LayoutGrid,
    title: "Compare Before You Decide",
    desc: "Save favourites and compare up to three cars side by side before you commit to a viewing.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 px-2 sm:px-8 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-teal/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-teal/20 to-transparent rounded-full blur-[120px]" />
      </div>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-3xl font-bold text-dark-900"
          >
            why choose <span className="font-light">us?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base text-dark-500 mt-5 max-w-lg mx-auto leading-relaxed"
          >
            Clear information and a straight path from browsing to buying — that&apos;s
            how a dealership should work.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto bg-teal/10 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 mb-2">{item.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed max-w-[280px] mx-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-teal transition-colors group"
          >
            More about LegitAutos{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
