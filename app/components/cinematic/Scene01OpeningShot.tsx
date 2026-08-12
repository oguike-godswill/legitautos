"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Scene01OpeningShot() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Split text into individual lines for reveal
    const titleLines = titleRef.current?.querySelectorAll(".split-line");
    const descLines = descRef.current?.querySelectorAll(".split-line");

    if (titleLines) {
      gsap.set(titleLines, { y: "100%", opacity: 0 });
    }
    if (descLines) {
      gsap.set(descLines, { y: "100%", opacity: 0 });
    }
    gsap.set(labelRef.current, { opacity: 0, y: 20 });
    gsap.set(ctaRef.current, { opacity: 0, y: 30 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2500",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Phase 1: Text reveals (line by line)
      tl.to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.08,
        ease: "power3.out",
      }, 0);

      if (titleLines) {
        tl.to(titleLines, {
          y: "0%",
          opacity: 1,
          duration: 0.12,
          stagger: 0.04,
          ease: "power3.out",
        }, 0.02);
      }

      if (descLines) {
        tl.to(descLines, {
          y: "0%",
          opacity: 1,
          duration: 0.1,
          stagger: 0.03,
          ease: "power3.out",
        }, 0.1);
      }

      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.08,
        ease: "power2.out",
      }, 0.15);

      // Phase 2: Background zooms, everything shifts
      tl.to(bgRef.current, {
        scale: 1.3,
        ease: "none",
        duration: 0.6,
      }, 0.3);

      tl.to(heroContentRef.current, {
        y: "-40vh",
        opacity: 0,
        ease: "power2.in",
        duration: 0.4,
      }, 0.35);

      // Phase 3: New text enters
      tl.fromTo(
        ".hero-secondary-text",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: "power3.out",
        },
        0.6
      );

      tl.to(".hero-secondary-text", {
        opacity: 0,
        y: -60,
        duration: 0.1,
        ease: "power2.in",
      }, 0.8);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark-950"
      style={{ height: "350vh" }}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80"
          >
            <source src="/herovid.mp4" type="video/mp4" />
          </video>
          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-dark-950/60" />
          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)"
          }} />
        </div>

        {/* Hero content */}
        <div
          ref={heroContentRef}
          className="absolute inset-0 flex items-center justify-center z-10 will-change-transform"
        >
          <div className="text-center px-6 max-w-5xl">
            <div ref={labelRef} className="overflow-hidden mb-6">
              <span className="inline-block text-[10px] tracking-[0.6em] uppercase text-primary-400 font-semibold">
                Nigeria&apos;s Premium Car Marketplace
              </span>
            </div>

            <div ref={titleRef}>
              <div className="overflow-hidden">
                <h1 className="heading text-5xl md:text-7xl lg:text-[7vw] font-black text-white leading-[0.9] tracking-tighter">
                  <span className="split-line block">FIND YOUR</span>
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="heading text-5xl md:text-7xl lg:text-[7vw] font-black leading-[0.9] tracking-tighter">
                  <span className="split-line block text-primary-400">DREAM CAR</span>
                </h1>
              </div>
            </div>

            <div ref={descRef} className="mt-8">
              <div className="overflow-hidden">
                <p className="txt text-base md:text-lg text-white/50 max-w-lg mx-auto">
                  <span className="split-line block">
                    Browse thousands of verified cars from trusted dealers
                  </span>
                </p>
              </div>
            </div>

            <div ref={ctaRef} className="mt-10">
              <a
                href="/cars"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark-950 font-bold text-sm rounded-full hover:bg-primary-400 hover:text-dark-950 transition-all duration-500"
              >
                Browse Cars
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Secondary text — enters after hero exits */}
        <div className="hero-secondary-text absolute inset-0 flex items-center justify-center z-10 opacity-0 pointer-events-none">
          <div className="text-center px-6">
            <p className="text-xs tracking-[0.5em] uppercase text-primary-400/60 mb-4 font-medium">
              The Experience Begins
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              EVERY SCROLL
              <br />
              <span className="text-primary-400">TELLS A STORY</span>
            </h2>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
          <span className="text-[9px] tracking-[0.5em] uppercase text-white/30 font-medium">
            Scroll
          </span>
          <div className="w-px h-10 bg-white/20 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-3 bg-white/60"
              style={{ animation: "scrollLine 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
