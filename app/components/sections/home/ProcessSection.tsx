"use client";

import { motion } from "framer-motion";
import { Search, MessageCircle, ShieldCheck, Car } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const STEPS = [
  { step: "01", title: "Search", desc: "Browse our current inventory", icon: Search },
  { step: "02", title: "Connect", desc: "Chat with our sales team on WhatsApp", icon: MessageCircle },
  { step: "03", title: "Inspect", desc: "View the car in person", icon: ShieldCheck },
  { step: "04", title: "Drive", desc: "Complete the purchase and drive home", icon: Car },
];

export function ProcessSection() {
  return (
    <section className="border-t border-dark-900/[0.06] py-16 sm:py-20 px-2 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="Process"
          title="How It Works"
          description="Four straightforward steps from browsing our lot to driving the car home."
          align="center"
        />
        <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent md:block" />
          {STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 4) * 0.08, duration: 0.4 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white transition-all duration-300 group-hover:scale-110 group-hover:border-teal group-hover:shadow-xl group-hover:shadow-teal/15 sm:h-20 sm:w-20">
                <item.icon className="h-6 w-6 text-teal transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8" />
              </div>
              <span className="mb-1 text-[0.5rem] font-bold tracking-[0.2em] text-teal">
                STEP {item.step}
              </span>
              <h3 className="text-base font-semibold text-dark-900">{item.title}</h3>
              <p className="mt-0.5 max-w-[170px] text-xs text-dark-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
