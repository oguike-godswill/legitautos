"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/app/animations/gsap";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });

      tl.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          textRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          0.3
        )
        .to(progressRef.current, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0.2)
        .to(logoRef.current, { scale: 1.1, duration: 0.3, ease: "power2.in" }, 1.5)
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }, 1.8);
    });

    return () => ctx.revert();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center"
    >
      <div ref={logoRef} className="flex flex-col items-center gap-4 opacity-0">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center border border-white/[0.08]">
          <span className="text-xl font-black text-white tracking-widest">
            LV
          </span>
        </div>
        <div ref={textRef} className="flex flex-col items-center opacity-0">
          <span className="text-[0.8rem] font-bold text-white tracking-[0.2em]">
            LEGITVENTURE
          </span>
          <span className="t-mono text-[0.5rem] text-white/25 mt-1 tracking-[0.3em]">
            AUTOS
          </span>
        </div>
      </div>

      <div className="mt-12 w-48 h-[1px] bg-white/[0.06] overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-white/30 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
