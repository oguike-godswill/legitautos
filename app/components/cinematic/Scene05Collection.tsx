"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const collectionCars = [
  { id: "1", title: "Mercedes-Benz AMG GT", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=85", price: "₦45,000,000", year: 2023, slug: "mercedes-amg-gt-2023", power: "585 HP" },
  { id: "2", title: "BMW M4 Competition", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=85", price: "₦38,000,000", year: 2023, slug: "bmw-m4-2023", power: "510 HP" },
  { id: "3", title: "Porsche 911 Turbo S", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=85", price: "₦62,000,000", year: 2023, slug: "porsche-911-2023", power: "650 HP" },
  { id: "4", title: "Lexus LC 500", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=85", price: "₦32,000,000", year: 2022, slug: "lexus-lc500-2022", power: "471 HP" },
  { id: "5", title: "Audi R8 V10", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=85", price: "₦55,000,000", year: 2023, slug: "audi-r8-2023", power: "620 HP" },
  { id: "6", title: "Ford Mustang GT", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=85", price: "₦22,000,000", year: 2022, slug: "ford-mustang-2022", power: "460 HP" },
  { id: "7", title: "Nissan GT-R Nismo", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=85", price: "₦48,000,000", year: 2023, slug: "nissan-gtr-2023", power: "600 HP" },
  { id: "8", title: "Toyota Supra GR", image: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800&q=85", price: "₦28,000,000", year: 2023, slug: "toyota-supra-2023", power: "382 HP" },
];

export function Scene05Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(trackRef.current, { x: "100vw" });

    const ctx = gsap.context(() => {
      const getScrollDistance = () => {
        if (!trackRef.current) return 0;
        return trackRef.current.scrollWidth;
      };

      // Heading reveal
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Horizontal scroll
      gsap.to(trackRef.current, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: trackRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Spacer */}
      <div
        ref={spacerRef}
        style={{ height: "600vh" }}
        className="relative bg-dark-950"
      />

      {/* Pinned section */}
      <section
        ref={sectionRef}
        className="relative bg-dark-950 overflow-hidden"
        style={{ marginTop: "-100vh" }}
      >
        <div ref={headingRef} className="px-[8vw] pt-16 pb-8 opacity-0">
          <p className="text-[10px] tracking-[0.6em] uppercase text-primary-400/50 font-semibold mb-4">
            Scene 05
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            THE COLLECTION
          </h2>
        </div>

        <div
          ref={trackRef}
          className="flex items-center gap-6 md:gap-10 px-[8vw] pb-20 will-change-transform"
        >
          {collectionCars.map((car, i) => (
            <Link
              key={car.id}
              href={`/cars/${car.slug}`}
              className="group relative flex-shrink-0 w-[350px] md:w-[420px] h-[500px] md:h-[560px] rounded-3xl overflow-hidden bg-dark-900 border border-white/5"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  style={{ filter: "contrast(1.05) saturate(1.1)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              <div className="absolute top-6 left-6 z-10">
                <span className="text-7xl font-black text-white/[0.05] leading-none">0{i + 1}</span>
              </div>

              <div className="absolute top-6 right-6 z-10">
                <span className="px-3 py-1.5 bg-primary-600/80 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  {car.power}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary-400 mb-2 font-semibold">
                  {car.year}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{car.title}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-400">{car.price}</span>
                  <span className="text-xs text-white/30 group-hover:text-white/60 transition-colors">Details →</span>
                </div>
                <div className="h-px w-0 group-hover:w-full bg-primary-500/40 mt-4 transition-all duration-700" />
              </div>
            </Link>
          ))}

          <div className="flex-shrink-0 w-[280px] h-[500px] md:h-[560px] rounded-3xl border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-4">Explore</p>
              <Link href="/cars" className="text-xl font-bold text-primary-400 hover:text-primary-300 transition-colors">
                View All Cars →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
