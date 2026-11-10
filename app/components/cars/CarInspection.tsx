"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, BadgeCheck, ImageIcon } from "lucide-react";
import { Inspection } from "@/app/types";
import { getInspectionPoster } from "@/app/config/media";

interface CarInspectionProps {
  inspections: Inspection[];
}

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function CarInspectionItem({
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index, 4) * 0.05 }}
      className="group relative aspect-[3/2] overflow-hidden rounded-xl border border-dark-900/[0.07] bg-[#0C0C0E] text-left hover:border-[#D9381E]/40"
    >
      {poster && !imgError ? (
        <Image
          src={poster}
          alt={item.title}
          fill
          unoptimized={poster.includes("res.cloudinary.com")}
          onError={() => setImgError(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 50vw, 200px"
        />
      ) : item.type === "video" ? (
        <video
          src={item.url}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-zinc-900">
          <ImageIcon className="h-6 w-6 text-zinc-600" />
        </span>
      )}

      {item.type === "video" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#D9381E] shadow-md transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          </span>
        </span>
      )}

      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2">
        <span className="line-clamp-1 block text-[0.68rem] font-bold text-white">
          {item.title}
        </span>
      </span>

      {duration && (
        <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-full bg-black/80 px-1.5 py-0.5 font-mono text-[0.55rem] font-bold text-white backdrop-blur-sm">
          {duration}
        </span>
      )}
    </motion.button>
  );
}

/**
 * Inspection footage for one car, shown on its detail page next to the enquiry
 * actions. Renders nothing when the car has no media rather than showing an
 * empty shell.
 */
export function CarInspection({ inspections }: CarInspectionProps) {
  const [active, setActive] = useState<Inspection | null>(null);

  if (inspections.length === 0) return null;

  return (
    <section className="rounded-2xl border border-dark-900/[0.07] bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2">
        <BadgeCheck className="h-4 w-4 text-[#D9381E]" />
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-dark-900">
          Verified Inspection Media
        </h2>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-dark-500">
        Authentic unedited walkaround clips and condition shots recorded on our Lagos lot.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {inspections.map((item, i) => (
          <CarInspectionItem
            key={item._id}
            item={item}
            index={i}
            onSelect={() => setActive(item)}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl"
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
                <div className="relative aspect-[3/2] max-h-[75vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                  <Image
                    src={active.url}
                    alt={active.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
              )}

              <p className="mt-3 text-sm font-bold text-white">{active.title}</p>
              {active.description && (
                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  {active.description}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
