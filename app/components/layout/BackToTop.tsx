"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top -600",
        onEnter: () => setVisible(true),
        onLeaveBack: () => setVisible(false),
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={ref}
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[90] w-12 h-12 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-dark-500 hover:text-primary hover:border-primary/30 hover:shadow-lg transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
