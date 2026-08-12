"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const statements = [
  {
    title: "VERIFIED LISTINGS",
    description: "Every car is inspected and verified before it hits our platform.",
  },
  {
    title: "TRANSPARENT PRICING",
    description: "No hidden fees. No surprises. What you see is what you pay.",
  },
  {
    title: "24/7 SUPPORT",
    description: "Our team is always here — before, during, and after your purchase.",
  },
];

export function ReliabilityScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const statementsRef = useRef<(HTMLDivElement | null)[]>([]);
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
          end: "+=3500",
        },
      });

      tl.to(headingRef.current, { y: -200, duration: 1.5 }, 0)
        .to(bgRef.current, { y: -150, scale: 1.1, duration: 2 }, 0);

      statementsRef.current.forEach((stmt, i) => {
        if (!stmt) return;
        const start = 0.2 + i * 0.25;
        tl.fromTo(
          stmt,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3 },
          start
        ).to(stmt, { y: -30, opacity: 0, duration: 0.2 }, start + 0.2);
      });

      tl.fromTo(
        copyRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.95
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-dark"
    >
      <div ref={bgRef} className="scene-layer">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80"
          alt="Premium car"
          className="w-full h-full object-cover opacity-30"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-dark/50" />
      </div>

      <div
        ref={headingRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="t-hero text-white leading-[0.9]">
            TRUST
            <br />
            <span className="text-white/30">AT EVERY</span>
            <br />
            MILE.
          </h2>
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        {statements.map((stmt, i) => (
          <div
            key={stmt.title}
            ref={(el) => {
              statementsRef.current[i] = el;
            }}
            className="absolute opacity-0 text-center"
          >
            <span className="t-mono text-white/70 text-sm tracking-[0.2em] block mb-2">
              {stmt.title}
            </span>
            <span className="text-[0.7rem] text-white/35 max-w-xs block">
              {stmt.description}
            </span>
          </div>
        ))}
      </div>

      <div
        ref={copyRef}
        className="absolute bottom-12 left-6 sm:left-8 lg:left-12 z-10 opacity-0"
      >
        <p className="text-sm text-white/35 max-w-sm leading-relaxed">
          We don&apos;t just list cars — we stand behind every transaction.
          LegitVenture Autos is built on trust, transparency, and the belief
          that every Nigerian deserves a reliable vehicle.
        </p>
      </div>
    </section>
  );
}
