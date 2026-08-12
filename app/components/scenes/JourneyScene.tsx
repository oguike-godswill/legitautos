"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

export function JourneyScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.5,
          start: "top top",
          end: "+=4000",
        },
      });

      // Image 1 — Showroom
      tl.to(img1Ref.current, { scale: 1.2, duration: 0.3 }, 0)
        .fromTo(
          step1Ref.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.05
        )
        .to(step1Ref.current, { y: -20, opacity: 0, duration: 0.1 }, 0.2)
        .to(img1Ref.current, { opacity: 0, duration: 0.2 }, 0.2)

        // Image 2 — Test Drive
        .fromTo(
          img2Ref.current,
          { x: "100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.3 },
          0.2
        )
        .fromTo(
          text1Ref.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.35
        )
        .fromTo(
          step2Ref.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.4
        )
        .to(text1Ref.current, { y: -40, opacity: 0, duration: 0.1 }, 0.55)
        .to(step2Ref.current, { y: -20, opacity: 0, duration: 0.1 }, 0.55)
        .to(img2Ref.current, { x: "-20%", scale: 1.1, duration: 0.3 }, 0.5)

        // Image 3 — Delivery
        .to(img2Ref.current, { opacity: 0, duration: 0.15 }, 0.75)
        .fromTo(
          img3Ref.current,
          { scale: 1.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.2 },
          0.75
        )
        .fromTo(
          text2Ref.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.8
        )
        .fromTo(
          step3Ref.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.85
        )
        .fromTo(
          text3Ref.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.9
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-dark"
    >
      {/* Image 1 — Showroom */}
      <div ref={img1Ref} className="scene-layer">
        <img
          src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&q=80"
          alt="Car showroom"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/30 to-dark/50" />
      </div>

      {/* Image 2 — Test Drive */}
      <div ref={img2Ref} className="scene-layer opacity-0">
        <img
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1920&q=80"
          alt="Test drive"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/30 to-dark/50" />
      </div>

      {/* Image 3 — Delivery */}
      <div ref={img3Ref} className="scene-layer opacity-0">
        <img
          src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80"
          alt="Car delivery"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/30 to-dark/50" />
      </div>

      {/* Step 1 — Showroom */}
      <div
        ref={step1Ref}
        className="absolute inset-0 z-10 flex items-end pb-24 sm:pb-32 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto opacity-0"
      >
        <div>
          <span className="t-mono text-white/25 text-[0.5rem] tracking-[0.2em] block mb-3">
            Step 01
          </span>
          <h2 className="t-editorial text-white mb-4">THE SHOWROOM</h2>
          <p className="text-sm text-white/35 max-w-md leading-relaxed">
            Browse our curated collection of verified vehicles. Every car
            inspected, every detail documented — so you know exactly what
            you&apos;re getting.
          </p>
        </div>
      </div>

      {/* Step 2 — Test Drive */}
      <div
        ref={text1Ref}
        className="absolute inset-0 z-10 flex items-center justify-center opacity-0"
      >
        <h2 className="t-editorial text-white text-center drop-shadow-2xl">
          FROM SHOWROOM
        </h2>
      </div>
      <div
        ref={step2Ref}
        className="absolute inset-0 z-10 flex items-end pb-24 sm:pb-32 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto opacity-0"
      >
        <div>
          <span className="t-mono text-white/25 text-[0.5rem] tracking-[0.2em] block mb-3">
            Step 02
          </span>
          <h2 className="t-display text-white mb-3">THE TEST DRIVE</h2>
          <p className="text-sm text-white/35 max-w-md leading-relaxed">
            Feel the wheel. Experience the power. Schedule a test drive at any
            of our partner locations across Nigeria.
          </p>
        </div>
      </div>

      {/* Step 3 — Delivery */}
      <div
        ref={text2Ref}
        className="absolute inset-0 z-10 flex items-center justify-center opacity-0"
      >
        <h2 className="t-editorial text-white text-center drop-shadow-2xl">
          TO YOUR DRIVEWAY
        </h2>
      </div>
      <div
        ref={step3Ref}
        className="absolute inset-0 z-20 flex items-end pb-24 sm:pb-32 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto opacity-0"
      >
        <div>
          <span className="t-mono text-white/25 text-[0.5rem] tracking-[0.2em] block mb-3">
            Step 03
          </span>
          <h2 className="t-display text-white mb-3">DELIVERED</h2>
          <p className="text-sm text-white/35 max-w-md leading-relaxed">
            Keys in hand. Fully insured delivery to your doorstep — anywhere
            in Nigeria. Your journey starts now.
          </p>
        </div>
      </div>
    </section>
  );
}
