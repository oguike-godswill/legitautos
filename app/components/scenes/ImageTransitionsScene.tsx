"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80",
    label: "Exterior",
    title: "SCULPTED\nPERFECTION",
    description: "Every curve, every line — designed to turn heads and command the road.",
  },
  {
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80",
    label: "Performance",
    title: "BUILT TO\nPERFORM",
    description: "Engineering that delivers power, precision, and pure driving pleasure.",
  },
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
    label: "Luxury",
    title: "CRAFTED\nLUXURY",
    description: "Premium materials, meticulous detail — comfort that redefines the journey.",
  },
];

export function ImageTransitionsScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=2500",
        },
      });

      // Slide 1
      tl.to(img1Ref.current, { scale: 1.1, duration: 0.2 }, 0)
        .fromTo(
          text1Ref.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.05
        )
        .to(text1Ref.current, { y: -30, opacity: 0, duration: 0.1 }, 0.15)

        // Slide 2
        .fromTo(
          img2Ref.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.2 },
          0.2
        )
        .fromTo(
          text2Ref.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.25
        )
        .to(img2Ref.current, { scale: 1.05, duration: 0.2 }, 0.35)
        .to(text2Ref.current, { y: -30, opacity: 0, duration: 0.1 }, 0.4)

        // Slide 3
        .fromTo(
          img3Ref.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.2 },
          0.5
        )
        .fromTo(
          text3Ref.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15 },
          0.55
        )
        .to(img3Ref.current, { scale: 1.05, duration: 0.2 }, 0.65);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-dark"
    >
      <div ref={img1Ref} className="scene-layer">
        <img
          src={SLIDES[0].image}
          alt="Luxury car side profile"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-dark/40" />
      </div>

      <div ref={img2Ref} className="scene-layer">
        <img
          src={SLIDES[1].image}
          alt="Sports car front view"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-dark/40" />
      </div>

      <div ref={img3Ref} className="scene-layer">
        <img
          src={SLIDES[2].image}
          alt="Premium car detail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-dark/40" />
      </div>

      {/* Text overlays */}
      <div ref={text1Ref} className="absolute inset-0 z-10 flex items-end pb-24 sm:pb-32 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto opacity-0">
        <div>
          <span className="t-mono text-white/30 text-[0.5rem] tracking-[0.2em] block mb-3">{SLIDES[0].label}</span>
          <h2 className="t-editorial text-white whitespace-pre-line mb-4">{SLIDES[0].title}</h2>
          <p className="text-sm text-white/35 max-w-sm leading-relaxed">{SLIDES[0].description}</p>
        </div>
      </div>

      <div ref={text2Ref} className="absolute inset-0 z-10 flex items-end pb-24 sm:pb-32 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto opacity-0">
        <div>
          <span className="t-mono text-white/30 text-[0.5rem] tracking-[0.2em] block mb-3">{SLIDES[1].label}</span>
          <h2 className="t-editorial text-white whitespace-pre-line mb-4">{SLIDES[1].title}</h2>
          <p className="text-sm text-white/35 max-w-sm leading-relaxed">{SLIDES[1].description}</p>
        </div>
      </div>

      <div ref={text3Ref} className="absolute inset-0 z-10 flex items-end pb-24 sm:pb-32 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto opacity-0">
        <div>
          <span className="t-mono text-white/30 text-[0.5rem] tracking-[0.2em] block mb-3">{SLIDES[2].label}</span>
          <h2 className="t-editorial text-white whitespace-pre-line mb-4">{SLIDES[2].title}</h2>
          <p className="text-sm text-white/35 max-w-sm leading-relaxed">{SLIDES[2].description}</p>
        </div>
      </div>
    </section>
  );
}
