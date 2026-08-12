"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

export function StatementScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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

      tl.fromTo(
        line1Ref.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0
      )
        .fromTo(
          line2Ref.current,
          { y: 150, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.2
        )
        .to(bgRef.current, { scale: 1.1, duration: 1.5 }, 0)
        .fromTo(
          copyRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.5
        )
        .to(line1Ref.current, { y: -60, duration: 1 }, 0.8)
        .to(line2Ref.current, { y: -40, duration: 1 }, 0.8)
        .to(copyRef.current, { y: -20, opacity: 0, duration: 0.4 }, 0.9)
        .to(
          [line1Ref.current, line2Ref.current],
          { opacity: 0, duration: 0.5 },
          1.2
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
          src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80"
          alt="Fleet of luxury cars"
          className="w-full h-full object-cover opacity-40"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-dark/60" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div ref={line1Ref} className="overflow-hidden">
          <h2 className="t-editorial text-white text-center">EVERY CAR,</h2>
        </div>
        <div ref={line2Ref} className="overflow-hidden">
          <h2 className="t-editorial text-white/40 text-center">
            EVERY DREAM.
          </h2>
        </div>
        <div ref={copyRef} className="mt-10 max-w-md text-center opacity-0">
          <p className="text-sm text-white/40 leading-relaxed">
            From the first ignition to the thousandth mile &mdash; we make
            sure every car finds its home. Verified. Transparent. Yours.
          </p>
        </div>
      </div>
    </section>
  );
}
