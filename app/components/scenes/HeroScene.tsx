"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const HERO_STATS = [
  { value: "2,500+", label: "Cars Listed" },
  { value: "36", label: "States Covered" },
  { value: "98%", label: "Satisfaction" },
];

export function HeroScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: "bottom top",
        },
      });

      tl.to(imageRef.current, { scale: 1.15, duration: 1 }, 0)
        .to(titleRef.current, { y: -120, duration: 1 }, 0)
        .to(subtitleRef.current, { y: -80, opacity: 0, duration: 0.8 }, 0.1)
        .to(labelRef.current, { y: -60, opacity: 0, duration: 0.6 }, 0.15)
        .to(statsRef.current, { y: -40, opacity: 0, duration: 0.6 }, 0.15)
        .to(scrollRef.current, { opacity: 0, duration: 0.3 }, 0.1)
        .to(imageRef.current, { x: -100, duration: 1 }, 0.3);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-dark"
    >
      <div ref={imageRef} className="scene-layer">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=85"
          alt="Luxury sports car"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/20 to-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-24 sm:pb-32 pt-36 sm:pt-44 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div ref={labelRef} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-white/30" />
          <span className="t-mono text-white/30 text-[0.55rem] tracking-[0.2em]">
            LegitAutos Autos &mdash; Est. 2018
          </span>
        </div>

        <div ref={titleRef}>
          <h1 className="t-hero text-white">
            EVERY JOURNEY
            <br />
            <span className="text-white/40">STARTS SOMEWHERE.</span>
          </h1>
        </div>

        <div ref={subtitleRef} className="mt-8 max-w-lg">
          <p className="text-[1.05rem] sm:text-lg text-white/55 leading-[1.7] mb-6">
            Nigeria&apos;s most trusted car marketplace. We connect buyers
            with verified sellers, offering transparent pricing, certified
            inspections, and nationwide delivery &mdash; so every drive
            feels like the first.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/cars"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] hover:border-white/[0.18] t-mono text-[0.6rem] text-white/70 hover:text-white transition-all duration-500"
            >
              Browse inventory
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="/request"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/[0.06] hover:border-white/[0.12] t-mono text-[0.6rem] text-white/35 hover:text-white/60 transition-all duration-500"
            >
              Sell your car
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="mt-12 pt-8 border-t border-white/[0.06] flex items-center gap-8 sm:gap-12"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </span>
              <span className="t-mono text-[0.5rem] text-white/25 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="t-mono text-white/20 text-[0.5rem] tracking-[0.2em]">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}

