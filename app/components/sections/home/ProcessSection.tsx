"use client";

import { motion } from "framer-motion";
import { Search, MessageCircle, ShieldCheck, Car } from "lucide-react";

const STEPS = [
  { step: "01", title: "Search", desc: "Browse our current inventory", icon: Search },
  { step: "02", title: "Connect", desc: "Chat with our sales team on WhatsApp", icon: MessageCircle },
  { step: "03", title: "Inspect", desc: "View the car in person", icon: ShieldCheck },
  { step: "04", title: "Drive", desc: "Complete the purchase and drive home", icon: Car },
];

export function ProcessSection() {
  return (
    <section className="py-16 px-2 sm:px-8 lg:px-12 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em]"
          >
            Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
          >
            How It Works
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
          {STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center mb-3 relative z-10 group-hover:border-teal group-hover:shadow-xl group-hover:shadow-teal/15 group-hover:scale-110 transition-all duration-400">
                <item.icon className="w-8 h-8 text-teal group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[0.5rem] font-bold text-teal tracking-[0.2em] mb-1">
                STEP {item.step}
              </span>
              <h3 className="font-semibold text-dark-900 text-base">{item.title}</h3>
              <p className="text-xs text-dark-500 mt-0.5 max-w-[170px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
