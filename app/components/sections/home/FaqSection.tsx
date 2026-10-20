"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { faqs } from "@/app/config/faq";
import { dealershipWhatsApp } from "@/app/config/dealership";
import { SectionHeader } from "./SectionHeader";

/**
 * Frequently asked questions. Copy lives in app/config/faq.ts so it stays in
 * step with the contact page.
 */
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-dark-900/[0.06] bg-ivory py-16 sm:py-20 px-2 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="FAQ"
          title="Common Questions"
          description="The things buyers ask us most before they come to see a car."
          align="center"
        />

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i, 4) * 0.06, duration: 0.35 }}
                className="overflow-hidden rounded-2xl border border-dark-900/[0.07] bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-dark-900/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-inset"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 shrink-0 text-teal" />
                    <span className="text-sm font-semibold text-dark-900">
                      {item.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-dark-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed text-dark-500">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href={dealershipWhatsApp(
              "Hello, I have a question about buying a car from LegitAutos."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-700"
          >
            <MessageCircle className="h-4 w-4" />
            Ask us on WhatsApp
          </a>
          <p className="mt-4 text-xs text-dark-400">
            Prefer to read more first?{" "}
            <Link href="/contact" className="font-semibold text-teal hover:underline">
              Visit the contact page
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
