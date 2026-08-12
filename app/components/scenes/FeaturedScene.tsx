"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";
import { formatPrice, formatMileage } from "@/app/utils/format";
import { ArrowRight, MapPin } from "lucide-react";

interface Car {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  location: string;
  condition: string;
  featured: boolean;
}

export function FeaturedScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("/api/cars?featured=true&limit=6");
        const data = await res.json();
        setCars(data.cars || []);
      } catch {
        // silently fail
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        gridRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [cars]);

  if (cars.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-20 bg-dark">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-8 lg:px-12">
        <div ref={headingRef} className="flex items-end justify-between mb-10 opacity-0">
          <div>
            <span className="t-mono text-[0.5rem] text-white/20 block mb-3">
              Featured Cars
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white/80">
              Handpicked for You.
            </h2>
          </div>
          <Link
            href="/cars"
            className="hidden sm:flex items-center gap-1.5 t-mono text-[0.5rem] text-white/25 hover:text-white/50 transition-colors"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {cars.map((car) => (
            <Link
              key={car._id}
              href={`/cars/${car._id}`}
              className="group rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-white/[0.02] overflow-hidden">
                {car.images?.[0] ? (
                  <Image
                    src={car.images[0]}
                    alt={car.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    sizes="33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="t-mono text-[0.5rem] text-white/10">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />
                {car.condition === "new" && (
                  <span className="absolute top-3 left-3 t-mono text-[0.4rem] text-white/50 bg-emerald-500/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-emerald-500/20">
                    New
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors truncate">
                  {car.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="t-mono text-[0.45rem] text-white/20">{car.year}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                  <span className="t-mono text-[0.45rem] text-white/20">{formatMileage(car.mileage)}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                  <span className="text-sm font-bold text-white/70">
                    {formatPrice(car.price)}
                  </span>
                  <span className="flex items-center gap-1 t-mono text-[0.4rem] text-white/15">
                    <MapPin className="w-2.5 h-2.5" />
                    {car.location}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/cars"
          className="sm:hidden flex items-center justify-center gap-1.5 t-mono text-[0.5rem] text-white/25 hover:text-white/50 transition-colors mt-6"
        >
          View All Cars
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </section>
  );
}
