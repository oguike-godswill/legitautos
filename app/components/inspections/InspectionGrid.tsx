"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  X,
  BadgeCheck,
  ArrowRight,
  Film,
  ImageIcon,
  Search,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Inspection } from "@/app/types";
import { getInspectionPoster } from "@/app/config/media";
import { dealershipWhatsApp } from "@/app/config/dealership";

interface InspectionGridProps {
  inspections: Inspection[];
}

type Filter = "all" | "video" | "image";

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Editorial aspect ratio rhythms for a true masonry waterfall
const ASPECT_RATIOS = [
  "aspect-[9/13]",   // Tall reel / vertical walkaround
  "aspect-[4/3]",    // Medium classic frame
  "aspect-[16/10]",  // Wide cinematic lot overview
  "aspect-[1/1]",    // Square condition focus
  "aspect-[4/5]",    // Editorial portrait
  "aspect-[3/2]",    // 35mm automotive landscape
];

function MasonryCard({
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

  // Determine aspect ratio for masonry flow
  const aspectClass = ASPECT_RATIOS[index % ASPECT_RATIOS.length];

  return (
    <div className="break-inside-avoid mb-4 sm:mb-6 w-full inline-block align-top">
      <motion.button
        type="button"
        onClick={onSelect}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: Math.min(index % 8, 6) * 0.05 }}
        className={`group relative ${aspectClass} w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-[#0C0C0E] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D9381E]/60 hover:shadow-[0_24px_50px_-16px_rgba(217,56,30,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9381E]`}
      >
        {/* Media Frame */}
        {poster && !imgError ? (
          <Image
            src={poster}
            alt={item.title}
            fill
            unoptimized={poster.includes("res.cloudinary.com")}
            onError={() => setImgError(true)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1400px) 33vw, 25vw"
          />
        ) : item.type === "video" ? (
          <video
            src={item.url}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900">
            <ImageIcon className="h-8 w-8 text-zinc-600" />
          </div>
        )}

        {/* Ambient Dark Gradient Vignette */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/95 via-[#0C0C0E]/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

        {/* Top Badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-3.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#0C0C0E]/75 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md">
            {item.type === "video" ? (
              <>
                <Film className="h-3 w-3 text-[#D9381E]" />
                Walkaround
              </>
            ) : (
              <>
                <ImageIcon className="h-3 w-3 text-[#C89D54]" />
                Photo
              </>
            )}
          </span>

          {duration && (
            <span className="rounded-full border border-white/15 bg-[#0C0C0E]/80 px-2.5 py-0.5 font-mono text-[0.62rem] font-bold text-white shadow-sm backdrop-blur-md">
              {duration}
            </span>
          )}
        </div>

        {/* Video Center Play Disc */}
        {item.type === "video" && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#D9381E] shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:bg-[#D9381E] group-hover:text-white">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
          </span>
        )}

        {/* Bottom Metadata Plinth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          {item.carTitle && (
            <div className="mb-1 flex items-center gap-1.5 text-[0.68rem] text-[#C89D54]">
              <BadgeCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-semibold tracking-wide">{item.carTitle}</span>
            </div>
          )}

          <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white sm:text-sm">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-1 line-clamp-1 text-[0.68rem] text-zinc-300/80">
              {item.description}
            </p>
          )}

          <div className="mt-2.5 flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white/70 group-hover:text-white transition-colors">
            <span>Watch Inspection</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 text-[#D9381E]" />
          </div>
        </div>
      </motion.button>
    </div>
  );
}

/**
 * Editorial Masonry Media Library with live filters, instant search, and unedited media lightbox.
 */
export function InspectionGrid({ inspections }: InspectionGridProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Inspection | null>(null);

  const videoCount = useMemo(
    () => inspections.filter((i) => i.type === "video").length,
    [inspections]
  );
  const imageCount = useMemo(
    () => inspections.filter((i) => i.type === "image").length,
    [inspections]
  );

  const visible = useMemo(() => {
    return inspections.filter((item) => {
      // Type filter
      if (filter !== "all" && item.type !== filter) return false;
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchCar = item.carTitle?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        return matchTitle || matchCar || matchDesc;
      }
      return true;
    });
  }, [inspections, filter, search]);

  const tabs: Array<{ value: Filter; label: string; count: number; icon: typeof Film }> = [
    { value: "all", label: "All Media", count: inspections.length, icon: Film },
    { value: "video", label: "Walkaround Videos", count: videoCount, icon: Film },
    { value: "image", label: "Condition Photos", count: imageCount, icon: ImageIcon },
  ];

  return (
    <>
      {/* Control Bar: Filters & Live Search */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "border-[#0C0C0E] bg-[#0C0C0E] text-white shadow-sm"
                    : "border-black/10 bg-white text-zinc-600 hover:border-black/20 hover:text-black"
                }`}
              >
                <tab.icon className={`h-3.5 w-3.5 ${isActive ? "text-[#D9381E]" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.2 font-mono text-[0.62rem] font-bold ${
                    isActive
                      ? "bg-[#D9381E] text-white"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by car, e.g. Camry, Benz..."
            className="w-full rounded-xl border border-black/10 bg-white py-2 pl-9 pr-8 text-xs font-medium text-black placeholder:text-zinc-400 focus:border-[#D9381E] focus:outline-none focus:ring-1 focus:ring-[#D9381E]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:text-black"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Masonry Waterfall Grid */}
      {visible.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
          {visible.map((item, i) => (
            <MasonryCard
              key={item._id}
              item={item}
              index={i}
              onSelect={() => setActive(item)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-zinc-600">
            No inspection clips match your filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setSearch("");
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#D9381E] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Cinematic Modal Lightbox */}
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

              <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  {active.carTitle && (
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#C89D54]">
                      <BadgeCheck className="h-4 w-4 shrink-0" />
                      <span>{active.carTitle}</span>
                    </p>
                  )}
                  <p className="mt-1 text-base font-bold text-white">{active.title}</p>
                  {active.description && (
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                      {active.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  {active.car && (
                    <Link
                      href={`/cars/${active.car}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20"
                    >
                      <span>Vehicle Specs</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  <a
                    href={dealershipWhatsApp(
                      `Hello LegitAutos, I watched the inspection media for "${active.title}" ${active.carTitle ? `(${active.carTitle})` : ""} and would like to ask some questions.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#D9381E] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#b82e17]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
