"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CarCard } from "@/app/components/cars/CarCard";
import { useCars } from "@/app/hooks/useCars";
import { CarFilters } from "@/app/types";
import { Search, X } from "lucide-react";
import { CarCardSkeleton } from "@/app/components/ui/Skeleton";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const brands = ["All", "Toyota", "Honda", "Lexus", "Mercedes-Benz", "BMW", "Audi", "Ford", "Hyundai", "Kia", "Nissan", "Volkswagen", "Porsche"];

export function Scene06Marketplace() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const filters: CarFilters = {
    search: search || undefined,
    brand: selectedBrand !== "All" ? [selectedBrand] : undefined,
    limit: 12,
  };

  const { data, isLoading } = useCars(filters);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      const headingLines = headingRef.current?.querySelectorAll(".reveal-line");
      if (headingLines) {
        gsap.set(headingLines, { y: "110%", opacity: 0 });
        gsap.to(headingLines, {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });
      }

      // Grid cards stagger
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".marketplace-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-dark-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={headingRef} className="mb-12">
          <div className="overflow-hidden mb-3">
            <span className="reveal-line block text-[10px] tracking-[0.6em] uppercase text-primary-400/50 font-semibold">
              Scene 06
            </span>
          </div>
          <div className="overflow-hidden">
            <h2 className="reveal-line block text-3xl sm:text-5xl font-black text-white tracking-tight">
              BROWSE OUR
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="reveal-line block text-3xl sm:text-5xl font-black text-primary-400 tracking-tight">
              COLLECTION
            </h2>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-4">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedBrand === brand
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                    : "bg-white/5 text-dark-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)}
          </div>
        ) : data?.cars && data.cars.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.cars.map((car, i) => (
              <div key={car._id} className="marketplace-card">
                <CarCard car={car} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No cars found matching your criteria.</p>
            <button
              onClick={() => { setSearch(""); setSelectedBrand("All"); }}
              className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link href="/cars" className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-primary-600 text-white font-semibold">
            View All Cars →
          </Link>
        </div>
      </div>
    </section>
  );
}
