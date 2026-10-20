"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatNumber } from "@/app/utils/format";

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
    <span ref={ref} className="text-2xl sm:text-5xl font-bold text-white">
      {formatNumber(count)}
    </span>
  );
}

interface StatsBandProps {
  carsInStock?: number;
  brandCount?: number;
}

/**
 * Data-driven stats band. Every number comes from the live database —
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
    <section className="py-16 px-2 sm:px-8 lg:px-12 bg-ink">
      <div className="max-w-[1400px] mx-auto">
        <div
          className={`grid grid-cols-2 gap-8 ${
            stats.length > 1 ? "md:grid-cols-4" : "md:grid-cols-2 max-w-md mx-auto"
          }`}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <CountUp target={stat.value} />
              <p className="text-xs text-white/40 mt-2 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
