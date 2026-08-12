"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const locations = [
  { name: "Lagos", x: "48%", y: "52%", count: "1,200+" },
  { name: "Abuja", x: "47%", y: "48%", count: "450+" },
  { name: "Port Harcourt", x: "49%", y: "53%", count: "280+" },
  { name: "Ibadan", x: "46%", y: "51%", count: "180+" },
  { name: "Kano", x: "47%", y: "45%", count: "150+" },
  { name: "Enugu", x: "50%", y: "52%", count: "120+" },
  { name: "Benin City", x: "47%", y: "52%", count: "90+" },
];

export function GlobalNetworkScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: "+=3000",
        },
      });

      tl.fromTo(
        mapRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3 },
        0
      );

      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const start = 0.1 + i * 0.08;
        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.15, ease: "back.out(2)" },
          start
        );
      });

      tl.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        0.2
      )
        .fromTo(
          copyRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3 },
          0.35
        )
        .to(mapRef.current, { scale: 1.1, duration: 0.5 }, 0.6);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-dark"
    >
      <div
        ref={mapRef}
        className="absolute inset-0 flex items-center justify-center opacity-0"
      >
        <div className="relative w-full max-w-5xl aspect-[2/1]">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path
              d="M450 150 L480 140 L510 160 L520 200 L510 250 L490 280 L470 300 L450 310 L430 300 L420 270 L410 240 L420 200 L430 170 Z"
              className="text-white/10"
              fill="currentColor"
            />
            <path
              d="M440 100 L460 90 L490 95 L510 110 L500 130 L480 140 L460 135 Z"
              className="text-white/10"
              fill="currentColor"
            />
            <path
              d="M550 100 L620 80 L700 90 L750 120 L740 160 L700 180 L650 190 L600 180 L560 160 L540 130 Z"
              className="text-white/10"
              fill="currentColor"
            />
          </svg>

          {locations.map((loc, i) => (
            <div
              key={loc.name}
              ref={(el) => {
                dotsRef.current[i] = el;
              }}
              className="absolute opacity-0"
              style={{
                left: loc.x,
                top: loc.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-3 h-3 rounded-full bg-primary relative group cursor-pointer">
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-dark/90 backdrop-blur-sm border border-white/[0.08] rounded-lg px-3 py-2 whitespace-nowrap">
                    <span className="t-mono text-[0.5rem] text-white/60 block">
                      {loc.name}
                    </span>
                    <span className="text-[0.55rem] text-white/40 block">
                      {loc.count} cars
                    </span>
                  </div>
                </div>
              </div>
              <span className="absolute top-5 left-1/2 -translate-x-1/2 t-mono text-white/50 text-[0.5rem] whitespace-nowrap">
                {loc.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-6 sm:left-8 lg:left-12 z-10">
        <div ref={headingRef} className="opacity-0">
          <span className="t-mono text-white/25 text-[0.5rem] tracking-[0.2em] block mb-3">
            Coverage
          </span>
          <h2 className="t-display text-white">
            Nationwide
            <br />
            Delivery Network
          </h2>
        </div>
        <div ref={copyRef} className="mt-4 max-w-sm opacity-0">
          <p className="text-sm text-white/40 leading-relaxed">
            From Lagos to Kano, Abuja to Port Harcourt — we deliver verified
            vehicles to all 36 states. Your dream car is never out of reach.
          </p>
        </div>
      </div>
    </section>
  );
}
