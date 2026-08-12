"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function Scene07FinalShot() {
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text1Lines = text1Ref.current?.querySelectorAll(".reveal-line");
    const text2Lines = text2Ref.current?.querySelectorAll(".reveal-line");
    if (text1Lines) gsap.set(text1Lines, { y: "110%", opacity: 0 });
    if (text2Lines) gsap.set(text2Lines, { y: "110%", opacity: 0 });
    gsap.set(ctaRef.current, { opacity: 0, y: 40 });
    gsap.set(fadeRef.current, { opacity: 0 });

    const ctx = gsap.context(() => {
      const segH = 3500;

      // Background zoom
      gsap.to(bgRef.current, {
        scale: 1.4,
        ease: "none",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: "top top",
          end: `top+=${segH} top`,
          scrub: 1.5,
        },
      });

      // Phase 1: "SOME CARS ARE DRIVEN."
      if (text1Lines) {
        gsap.to(text1Lines, {
          y: "0%",
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: `top+=${segH * 0.05} top`,
            end: `top+=${segH * 0.2} top`,
            scrub: 1,
          },
        });

        gsap.to(text1Lines, {
          y: "-100%",
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: `top+=${segH * 0.22} top`,
            end: `top+=${segH * 0.32} top`,
            scrub: 1,
          },
        });
      }

      // Phase 2: "OTHERS ARE EXPERIENCED."
      if (text2Lines) {
        gsap.to(text2Lines, {
          y: "0%",
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: `top+=${segH * 0.35} top`,
            end: `top+=${segH * 0.48} top`,
            scrub: 1,
          },
        });

        gsap.to(text2Lines, {
          y: "-100%",
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: `top+=${segH * 0.5} top`,
            end: `top+=${segH * 0.58} top`,
            scrub: 1,
          },
        });
      }

      // Phase 3: Fade to near-black
      gsap.to(fadeRef.current, {
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.55} top`,
          end: `top+=${segH * 0.65} top`,
          scrub: 1,
        },
      });

      // Phase 4: CTA appears
      gsap.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.65} top`,
          end: `top+=${segH * 0.75} top`,
          scrub: 1,
        },
      });

      // Phase 5: Final fade to black
      gsap.to(fadeRef.current, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.88} top`,
          end: `top+=${segH} top`,
          scrub: 1,
        },
      });

      gsap.to(ctaRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.9} top`,
          end: `top+=${segH} top`,
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Spacer */}
      <div
        ref={spacerRef}
        style={{ height: "400vh" }}
        className="relative bg-black"
      />

      {/* Pinned viewport */}
      <section
        ref={sectionRef}
        className="relative h-screen bg-black overflow-hidden"
        style={{ marginTop: "-100vh" }}
      >
        {/* Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=85"
            alt="Cinematic vehicle"
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.2) saturate(0.85) brightness(0.55)" }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-0 left-0 right-0 h-[15vh] bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[15vh] bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Film grain */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Text 1 */}
        <div
          ref={text1Ref}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="text-center px-6">
            <div className="overflow-hidden">
              <h2 className="reveal-line block text-5xl md:text-7xl lg:text-[8vw] font-black text-white leading-[0.9] tracking-tighter">
                SOME CARS
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="reveal-line block text-5xl md:text-7xl lg:text-[8vw] font-black text-primary-400 leading-[0.9] tracking-tighter">
                ARE DRIVEN.
              </h2>
            </div>
          </div>
        </div>

        {/* Text 2 */}
        <div
          ref={text2Ref}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="text-center px-6">
            <div className="overflow-hidden">
              <h2 className="reveal-line block text-5xl md:text-7xl lg:text-[8vw] font-black text-white leading-[0.9] tracking-tighter">
                OTHERS ARE
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="reveal-line block text-5xl md:text-7xl lg:text-[8vw] font-black text-primary-400 leading-[0.9] tracking-tighter">
                EXPERIENCED.
              </h2>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="absolute inset-0 flex items-center justify-center z-30 opacity-0"
        >
          <div className="text-center px-6">
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary-400/60 mb-6 font-semibold">
              Your Journey Awaits
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tight">
              EXPLORE THE COLLECTION.
            </h2>
            <Link
              href="/cars"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-dark-950 text-lg font-bold rounded-full hover:bg-primary-400 transition-all duration-500 shadow-2xl"
            >
              Browse Cars
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <div className="mt-12 flex items-center justify-center gap-8">
              <Link href="/request" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Sell Your Car
              </Link>
              <div className="h-4 w-px bg-white/15" />
              <Link href="/brands" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Browse Brands
              </Link>
            </div>
          </div>
        </div>

        {/* Fade overlay */}
        <div
          ref={fadeRef}
          className="absolute inset-0 bg-black z-40 pointer-events-none opacity-0"
        />
      </section>
    </>
  );
}
