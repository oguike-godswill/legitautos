"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/app/animations/gsap";
import { Search, X, ArrowRight } from "lucide-react";

const POPULAR_SEARCHES = [
  "Toyota Camry",
  "Lexus RX 350",
  "Mercedes GLE",
  "Honda Accord",
  "BMW X5",
  "Ford Explorer",
];

const RECENT_SEARCHES = [
  "SUVs under 10M",
  "Tokunbo cars Lagos",
  "Clean title only",
  "2024 models",
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-dark/[0.98] backdrop-blur-3xl items-center justify-center hidden"
      style={{ display: "none" }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.1] transition-all duration-300"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-2xl px-6">
        {/* Search input */}
        <div className="relative mb-12">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cars, brands, or keywords..."
            className="w-full bg-transparent border-b border-white/10 focus:border-white/30 text-xl sm:text-2xl text-white placeholder:text-white/15 pl-10 pb-4 outline-none transition-colors duration-300"
          />
        </div>

        {/* Quick links */}
        {!query && (
          <>
            <div className="mb-10">
              <span className="t-mono text-[0.5rem] text-white/15 block mb-4">
                Popular searches
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 rounded-full border border-white/[0.06] t-mono text-[0.55rem] text-white/25 hover:text-white/50 hover:border-white/[0.12] transition-all duration-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <span className="t-mono text-[0.5rem] text-white/15 block mb-4">
                Recent
              </span>
              <div className="space-y-2">
                {RECENT_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors duration-200 group"
                  >
                    <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors">
                      {term}
                    </span>
                    <ArrowRight className="w-3 h-3 text-white/10 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Search results */}
        {query && (
          <div className="space-y-2">
            <span className="t-mono text-[0.5rem] text-white/15 block mb-4">
              Results for &ldquo;{query}&rdquo;
            </span>
            <Link
              href={`/cars?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-white/[0.03] transition-colors duration-200 group"
            >
              <div>
                <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors block">
                  Search all cars
                </span>
                <span className="text-[0.55rem] text-white/15 mt-0.5 block">
                  Browse {query} listings
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors" />
            </Link>
            <Link
              href={`/brands?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-white/[0.03] transition-colors duration-200 group"
            >
              <div>
                <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors block">
                  Search brands
                </span>
                <span className="text-[0.55rem] text-white/15 mt-0.5 block">
                  Find {query} brand page
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors" />
            </Link>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <kbd className="px-2 py-1 rounded bg-white/[0.04] t-mono text-[0.45rem] text-white/15">
            ESC
          </kbd>
          <span className="t-mono text-[0.45rem] text-white/10">to close</span>
        </div>
      </div>
    </div>
  );
}
