"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const TRUST_ITEMS = [
  "Verified Sellers",
  "Inspected Vehicles",
  "Nationwide Delivery",
  "Secure Payments",
];

export function FinalScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

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

      tl.to(imgRef.current, { scale: 1.15, duration: 2 }, 0)
        .fromTo(
          line1Ref.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.3
        )
        .fromTo(
          line2Ref.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.6
        )
        .fromTo(
          copyRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          0.8
        )
        .fromTo(
          trustRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          0.9
        )
        .to(
          [line1Ref.current, line2Ref.current],
          { y: -60, opacity: 0, duration: 0.5 },
          1.2
        )
        .to(
          [copyRef.current, trustRef.current],
          { y: -30, opacity: 0, duration: 0.4 },
          1.3
        )
        .fromTo(
          ctaRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          1.4
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-dark"
    >
      <div ref={imgRef} className="scene-layer">
        <img
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80"
          alt="Dream car"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/40" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <div ref={line1Ref} className="overflow-hidden opacity-0">
          <h2 className="t-editorial text-white">ONE MARKETPLACE.</h2>
        </div>
        <div ref={line2Ref} className="overflow-hidden opacity-0 mt-3">
          <h2 className="t-editorial text-white/40">
            EVERY CAR,
            <br />
            EVERY DREAM.
          </h2>
        </div>

        <div ref={copyRef} className="mt-8 max-w-md opacity-0">
          <p className="text-sm text-white/40 leading-relaxed">
            Whether you&apos;re buying your first car, upgrading your ride, or
            selling to a trusted buyer &mdash; LegitAutos Autos is where
            it happens.
          </p>
        </div>

        {/* Trust badges */}
        <div
          ref={trustRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0"
        >
          {TRUST_ITEMS.map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 rounded-full border border-white/[0.08] t-mono text-[0.5rem] text-white/30"
            >
              {item}
            </span>
          ))}
        </div>

        <div ref={ctaRef} className="mt-14 opacity-0 flex flex-col items-center gap-4">
          <Link
            href="/cars"
            className="btn-cinematic text-[0.65rem] py-3.5 px-10"
          >
            FIND YOUR CAR
            <svg
              className="w-4 h-4"
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
          </Link>
          <span className="t-mono text-[0.45rem] text-white/20">
            No account required &middot; Browse 2,500+ cars
          </span>
        </div>
      </div>
    </section>
  );
}

