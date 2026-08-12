"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const details = [
  {
    title: "HEADLIGHTS",
    subtitle: "Precision Engineering",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1400&q=85",
  },
  {
    title: "WHEELS",
    subtitle: "Forged Alloy Design",
    image: "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1400&q=85",
  },
  {
    title: "INTERIOR",
    subtitle: "Handcrafted Luxury",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1400&q=85",
  },
  {
    title: "ENGINE",
    subtitle: "Heart of the Machine",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1400&q=85",
  },
];

export function Scene03DetailShot() {
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Set initial states
    imageRefs.current.forEach((el) => {
      if (el) gsap.set(el, { scale: 1.2, opacity: 0 });
    });
    textRefs.current.forEach((el) => {
      if (el) {
        const lines = el.querySelectorAll(".reveal-line");
        gsap.set(lines, { y: "110%", opacity: 0 });
      }
    });

    const ctx = gsap.context(() => {
      // Each detail gets its own scroll segment
      const segHeight = 2500;

      details.forEach((_, i) => {
        const img = imageRefs.current[i];
        const text = textRefs.current[i];
        if (!img || !text) return;

        const lines = text.querySelectorAll(".reveal-line");
        const start = i * segHeight;

        // Image zoom to scale 1
        gsap.to(img, {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: `top+=${start} top`,
            end: `top+=${start + 800} top`,
            scrub: 1,
          },
        });

        // Text lines reveal
        gsap.to(lines, {
          y: "0%",
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: `top+=${start + 300} top`,
            end: `top+=${start + 900} top`,
            scrub: 1,
          },
        });

        // Image fades out before next
        if (i < details.length - 1) {
          gsap.to(img, {
            opacity: 0,
            scale: 0.95,
            ease: "power2.in",
            scrollTrigger: {
              trigger: spacerRef.current,
              start: `top+=${start + segHeight - 600} top`,
              end: `top+=${start + segHeight} top`,
              scrub: 1,
            },
          });

          gsap.to(lines, {
            y: "-80%",
            opacity: 0,
            ease: "power2.in",
            scrollTrigger: {
              trigger: spacerRef.current,
              start: `top+=${start + segHeight - 500} top`,
              end: `top+=${start + segHeight} top`,
              scrub: 1,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Massive spacer for scroll distance */}
      <div
        ref={spacerRef}
        style={{ height: `${details.length * 2500}vh` }}
        className="relative bg-black"
      />

      {/* Pinned detail viewport */}
      <section
        ref={sectionRef}
        className="relative h-screen bg-black overflow-hidden"
        style={{ marginTop: "-100vh" }}
      >
        <div ref={contentRef} className="absolute inset-0">
          {details.map((detail, i) => (
            <div key={detail.title} className="absolute inset-0">
              {/* Full-bleed image */}
              <div
                ref={(el) => { imageRefs.current[i] = el; }}
                className="absolute inset-0 will-change-[opacity,transform]"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${detail.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "contrast(1.1) saturate(1.1)",
                  }}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Text content */}
              <div
                ref={(el) => { textRefs.current[i] = el; }}
                className={`absolute inset-0 flex items-center ${
                  i % 2 === 0 ? "justify-start pl-[8vw]" : "justify-end pr-[8vw]"
                }`}
              >
                <div>
                  <div className="overflow-hidden mb-3">
                    <span className="reveal-line block text-[10px] tracking-[0.5em] uppercase text-primary-400 font-semibold">
                      {detail.subtitle}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="reveal-line block text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter">
                      {detail.title}
                    </h3>
                  </div>
                  <div className="overflow-hidden mt-6">
                    <div className="reveal-line block h-[2px] w-16 bg-primary-500" />
                  </div>
                </div>
              </div>

              {/* Corner number */}
              <div className="absolute bottom-12 right-12 pointer-events-none">
                <span className="text-[100px] font-black text-white/[0.03] leading-none">
                  0{i + 1}
                </span>
              </div>
            </div>
          ))}

          {/* Progress bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 pointer-events-none">
            <div className="h-px w-12 bg-white/15" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-white/20">
              Details
            </span>
            <div className="h-px w-12 bg-white/15" />
          </div>
        </div>
      </section>
    </>
  );
}
