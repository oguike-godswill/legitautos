"use client";

import { motion } from "framer-motion";
import { CircleDollarSign, RotateCw, LayoutGrid, Handshake } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

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
    <section className="border-t border-dark-900/[0.06] py-16 sm:py-20 px-2 sm:px-8 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-teal/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-teal/20 to-transparent rounded-full blur-[120px]" />
      </div>
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeader
          eyebrow="Why LegitAutos"
          title="Why Choose Us"
          description="Clear information and a straight path from browsing to buying — that's how a dealership should work."
          linkHref="/about"
          linkLabel="More about LegitAutos"
          align="center"
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 4) * 0.08 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10">
                <item.icon className="h-6 w-6 text-teal" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-dark-900">{item.title}</h3>
              <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-dark-500">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
