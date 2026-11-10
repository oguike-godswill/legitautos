"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ArrowRight, BadgeCheck, ImageIcon } from "lucide-react";
import { Inspection } from "@/app/types";
import { getInspectionPoster } from "@/app/config/media";
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

function InspectionRowCard({
  item,
  index,
  onSelect,
}: {
  item: Inspection;
  index: number;
  onSelect: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const duration = formatDuration(item.duration);
  const poster = getInspectionPoster(item);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.05 }}
      className="group relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/10 bg-[#0C0C0E] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D9381E]/50 hover:shadow-[0_20px_40px_-16px_rgba(217,56,30,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9381E]"
    >
      {poster && !imgError ? (
        <Image
          src={poster}
          alt={item.title}
          fill
          unoptimized={poster.includes("res.cloudinary.com")}
          onError={() => setImgError(true)}
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      ) : item.type === "video" ? (
        <video
          src={item.url}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-900">
          <ImageIcon className="h-8 w-8 text-zinc-600" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/90 via-[#0C0C0E]/25 to-transparent" />

      {item.type === "video" && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#D9381E] shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </span>
        </span>
      )}

      <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <span className="line-clamp-2 block text-xs font-bold leading-snug text-white sm:text-sm">
          {item.title}
        </span>
        {item.carTitle && (
          <span className="mt-1.5 flex items-center gap-1.5 text-[0.65rem] text-zinc-300">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#C89D54]" />
            <span className="truncate font-medium">{item.carTitle}</span>
          </span>
        )}
      </span>

      {duration && (
        <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-full border border-white/10 bg-[#0C0C0E]/80 px-2.5 py-0.5 font-mono text-[0.62rem] font-bold text-white shadow-sm backdrop-blur-md">
          {duration}
        </span>
      )}
    </motion.button>
  );
}

/**
 * "See It Before You Visit" — the dealership's own inspection footage.
 */
export function InspectionRow({ inspections, className = "" }: InspectionRowProps) {
  const [active, setActive] = useState<Inspection | null>(null);

  if (inspections.length === 0) return null;

  return (
    <section
      className={`border-t border-dark-900/[0.06] bg-[#0C0C0E] py-16 sm:py-20 px-2 sm:px-8 lg:px-12 text-white ${className}`}
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow="Inspection Media"
          title="See It Before You Visit"
          description="Walkaround clips and condition photos we record of our own stock in Lagos. Inspect the actual car you are considering before you make the trip."
          linkHref="/inspections"
          linkLabel="All Inspections"
          tone="dark"
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {inspections.slice(0, 8).map((item, i) => (
            <InspectionRowCard
              key={item._id}
              item={item}
              index={i}
              onSelect={() => setActive(item)}
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="text-xs text-white/50">
            Sourcing a car from elsewhere?{" "}
            <Link href="/request" className="font-semibold text-[#D9381E] hover:underline">
              Tell us what you want
            </Link>{" "}
            and we will inspect it on arrival in Lagos.
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0C0C0E]/95 p-4 backdrop-blur-md"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {active.type === "video" ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                  <video
                    src={active.url}
                    poster={getInspectionPoster(active) || undefined}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[75vh] w-full bg-black object-contain"
                  />
                </div>
              ) : (
                <div className="relative aspect-[16/10] max-h-[75vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
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
                  <p className="text-base font-bold text-white">{active.title}</p>
                  {active.description && (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                      {active.description}
                    </p>
                  )}
                  {active.carTitle && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#C89D54]">
                      <BadgeCheck className="h-4 w-4 shrink-0" />
                      <span>{active.carTitle}</span>
                    </p>
                  )}
                </div>
                {active.car && (
                  <Link
                    href={`/cars/${active.car}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D9381E] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#b82e17]"
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
