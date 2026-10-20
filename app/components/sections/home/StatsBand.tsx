"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { formatNumber } from "@/app/utils/format";
import { dealershipWhatsApp } from "@/app/config/dealership";

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          if (reduceMotion) {
            setCount(target);
            return;
          }
          let start = 0;
          const duration = 1500;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span
      ref={ref}
      className="text-4xl font-bold leading-none text-white sm:text-5xl lg:text-6xl"
    >
      {formatNumber(count)}
    </span>
  );
}

interface StatsBandProps {
  carsInStock?: number;
  brandCount?: number;
}

/**
 * Data-driven inventory band. Every number comes from the live database —
 * nothing is hardcoded. Renders nothing until real values arrive.
 */
export function StatsBand({ carsInStock, brandCount }: StatsBandProps) {
  const stats = [
    carsInStock !== undefined && carsInStock > 0
      ? { value: carsInStock, label: carsInStock === 1 ? "Car in Stock" : "Cars in Stock" }
      : null,
    brandCount !== undefined && brandCount > 0
      ? { value: brandCount, label: brandCount === 1 ? "Brand Available" : "Brands Available" }
      : null,
  ].filter((s): s is { value: number; label: string } => s !== null);

  if (stats.length === 0) return null;

  return (
    <section className="px-2 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 sm:px-12 sm:py-16"
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal/20 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal/10 blur-[110px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-teal">
                Live Inventory
              </span>
              <h2 className="mt-3 text-xl font-bold uppercase leading-[1.15] tracking-[-0.02em] text-white sm:text-2xl">
                What&apos;s on the lot right now
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
                These counts come straight from our listings, so the numbers move
                as cars arrive and sell. Every car page shows its own live
                availability.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-700"
                >
                  Browse Inventory
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={dealershipWhatsApp(
                    "Hello, I'd like to ask about the cars you currently have in stock."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/80 transition-colors hover:border-white/30 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-6 sm:gap-10">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="border-l border-white/10 pl-5 sm:pl-8"
                  >
                    <CountUp target={stat.value} />
                    <p className="mt-3 text-xs uppercase tracking-wider text-white/40">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
