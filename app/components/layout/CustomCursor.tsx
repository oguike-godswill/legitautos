"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/animations/gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !dotRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
    };

    const handleHover = () => {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: "power2.out" });
    };

    const handleUnhover = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    window.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleUnhover);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleUnhover);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
