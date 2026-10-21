"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowRight, BadgeCheck } from "lucide-react";
import { Inspection } from "@/app/types";
import { SectionHeader } from "./SectionHeader";

interface InspectionRowProps {
  inspections: Inspection[];
  className?: string;
}

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * "See It Before You Visit" — the dealership's own inspection footage.
 *
 * This section is deliberately only rendered when real media exists. A buyer
 * who sees an inspection strip expects to be able to watch something, so an
 * empty or placeholder version would undermine the trust it is meant to build.
 */
export function InspectionRow({ inspections, className = "" }: InspectionRowProps) {
  const [active, setActive] = useState<Inspection | null>(null);

  if (inspections.length === 0) return null;

  return (
    <section
      className={`border-t border-dark-900/[0.06] bg-ink py-16 sm:py-20 px-2 sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="Inspection Media"
          title="See It Before You Visit"
          description="Walkaround clips and condition photos we record of our own stock. Watch the actual car you are considering before you make the trip."
          linkHref="/inspections"
          linkLabel="All Inspections"
          tone="dark"
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {inspections.slice(0, 8).map((item, i) => {
            const duration = formatDuration(item.duration);
            const poster = item.thumbnailUrl || (item.type === "image" ? item.url : null);

            return (
              <motion.button
                key={item._id}
                type="button"
                onClick={() => setActive(item)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.05 }}
                className="group relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/40"
              >
                {poster ? (
                  <Image
                    src={poster}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Play className="h-8 w-8 text-white/40" />
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

                {item.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 h-4 w-4 fill-teal text-teal" />
                    </span>
                  </span>
                )}

                <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <span className="line-clamp-2 block text-xs font-semibold text-white sm:text-sm">
                    {item.title}
                  </span>
                  {item.carTitle && (
                    <span className="mt-1 flex items-center gap-1.5 text-[0.65rem] text-white/60">
                      <BadgeCheck className="h-3 w-3 shrink-0 text-teal" />
                      <span className="truncate">{item.carTitle}</span>
                    </span>
                  )}
                </span>

                {duration && (
                  <span className="t-mono absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[0.6rem] text-white backdrop-blur-sm">
                    {duration}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="text-xs text-white/40">
            Sourcing a car from elsewhere?{" "}
            <Link href="/request" className="font-semibold text-teal hover:underline">
              Tell us what you want
            </Link>{" "}
            and we will inspect it on arrival.
          </p>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {active.type === "video" ? (
                <video
                  src={active.url}
                  poster={active.thumbnailUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full rounded-xl bg-black"
                />
              ) : (
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-black">
                  <Image
                    src={active.url}
                    alt={active.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{active.title}</p>
                  {active.description && (
                    <p className="mt-1 text-xs leading-relaxed text-white/60">
                      {active.description}
                    </p>
                  )}
                </div>
                {active.car && (
                  <Link
                    href={`/cars/${active.car}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-700"
                  >
                    View this car
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
