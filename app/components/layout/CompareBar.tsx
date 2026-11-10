"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCompare } from "@/app/stores/compareStore";
import { Scale, X, ArrowRight } from "lucide-react";
import { useSyncExternalStore } from "react";
import { formatCompactPrice } from "@/app/utils/format";

export function CompareBar() {
  const pathname = usePathname();
  const { compareList, compareSummaries, removeFromCompare, clearCompare } =
    useCompare();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Hide on the /compare page itself or in /admin
  if (
    !mounted ||
    compareList.length === 0 ||
    pathname === "/compare" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Vehicle comparison dock"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-ink text-white border border-white/15 rounded-2xl px-3.5 py-2.5 shadow-2xl flex items-center gap-3 max-w-[calc(100vw-1.5rem)] overflow-x-auto"
    >
      <div className="flex items-center gap-2 shrink-0 pl-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal/20 text-teal">
          <Scale className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-white/60">
            Compare
          </span>
          <span className="block text-xs font-bold text-white">
            {compareList.length} of 3 cars
          </span>
        </div>
      </div>

      <div className="w-px h-7 bg-white/15 shrink-0" />

      <div className="flex items-center gap-2">
        {compareList.map((id) => {
          const summary = compareSummaries[id];
          return (
            <div
              key={id}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-white/10 border border-white/10"
            >
              {summary?.image && (
                <div className="relative h-7 w-10 shrink-0 overflow-hidden rounded-md bg-white/5">
                  <Image
                    src={summary.image}
                    alt={summary.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div className="min-w-0 max-w-[110px] sm:max-w-[140px]">
                <p className="truncate text-xs font-semibold text-white">
                  {summary?.title || "Selected Car"}
                </p>
                {summary?.price && (
                  <p className="text-[0.65rem] font-bold text-teal">
                    {formatCompactPrice(summary.price)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFromCompare(id)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={`Remove ${summary?.title || "car"} from compare`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <Link
        href="/compare"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal hover:bg-teal-700 text-white text-xs font-bold transition-all shrink-0"
      >
        Compare Now
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>

      <button
        type="button"
        onClick={clearCompare}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        aria-label="Clear comparison list"
        title="Clear all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
