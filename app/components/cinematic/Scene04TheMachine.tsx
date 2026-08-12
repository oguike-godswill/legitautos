"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const specs = [
  { label: "POWER", value: "450", unit: "HP", detail: "Twin-Turbo V8" },
  { label: "TORQUE", value: "650", unit: "NM", detail: "All-Wheel Drive" },
  { label: "0-100", value: "3.9", unit: "SEC", detail: "Launch Control" },
  { label: "TOP SPEED", value: "290", unit: "KM/H", detail: "Electronically Limited" },
];

export function Scene04TheMachine() {
  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const specRefs = useRef<(HTMLDivElement | null)[]>([]);
  const speedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial states
    const statementLines = statementRef.current?.querySelectorAll(".reveal-line");
    if (statementLines) gsap.set(statementLines, { y: "110%", opacity: 0 });
    gsap.set(vehicleRef.current, { scale: 0.9, opacity: 0, y: 40 });
    specRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 60 });
    });
    gsap.set(speedRef.current, { opacity: 0 });

    const ctx = gsap.context(() => {
      const segH = 4000;

      // Phase 1: Statement text reveals line by line
      if (statementLines) {
        gsap.to(statementLines, {
          y: "0%",
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: "top top",
            end: `top+=${segH * 0.25} top`,
            scrub: 1,
          },
        });
      }

      // Vehicle appears
      gsap.to(vehicleRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.1} top`,
          end: `top+=${segH * 0.3} top`,
          scrub: 1,
        },
      });

      // Statement exits, vehicle moves left
      gsap.to(statementRef.current, {
        opacity: 0,
        y: -200,
        ease: "power2.in",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.25} top`,
          end: `top+=${segH * 0.4} top`,
          scrub: 1,
        },
      });

      gsap.to(vehicleRef.current, {
        x: "-20vw",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.3} top`,
          end: `top+=${segH * 0.5} top`,
          scrub: 1,
        },
      });

      // Speed counter appears
      gsap.to(speedRef.current, {
        opacity: 1,
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.35} top`,
          end: `top+=${segH * 0.45} top`,
          scrub: 1,
        },
      });

      // Specs cycle through
      specs.forEach((_, i) => {
        const specStart = segH * (0.45 + i * 0.12);
        const spec = specRefs.current[i];
        if (!spec) return;

        gsap.to(spec, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: `top+=${specStart} top`,
            end: `top+=${specStart + 400} top`,
            scrub: 1,
          },
        });

        if (i > 0 && specRefs.current[i - 1]) {
          gsap.to(specRefs.current[i - 1], {
            opacity: 0,
            y: -40,
            ease: "power2.in",
            scrollTrigger: {
              trigger: spacerRef.current,
              start: `top+=${specStart} top`,
              end: `top+=${specStart + 300} top`,
              scrub: 1,
            },
          });
        }
      });

      // Vehicle exits
      gsap.to(vehicleRef.current, {
        x: "40vw",
        opacity: 0,
        scale: 0.8,
        ease: "power3.in",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: `top+=${segH * 0.85} top`,
          end: `top+=${segH} top`,
          scrub: 1,
        },
      });

      gsap.to(speedRef.current, {
        opacity: 0,
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
      {/* Massive spacer */}
      <div
        ref={spacerRef}
        style={{ height: "500vh" }}
        className="relative bg-dark-950"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      </div>

      {/* Pinned viewport */}
      <section
        ref={sectionRef}
        className="relative h-screen bg-dark-950 overflow-hidden"
        style={{ marginTop: "-100vh" }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[200px]" />

        {/* Statement text */}
        <div
          ref={statementRef}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="text-center max-w-5xl px-8">
            <div className="overflow-hidden mb-3">
              <span className="reveal-line block text-[10px] tracking-[0.6em] uppercase text-primary-400/50 font-semibold">
                Scene 04
              </span>
            </div>
            <div className="overflow-hidden">
              <h2 className="reveal-line block text-5xl md:text-7xl lg:text-[7vw] font-black text-white leading-[0.85] tracking-tighter">
                ENGINEERED
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="reveal-line block text-5xl md:text-7xl lg:text-[7vw] font-black text-white leading-[0.85] tracking-tighter">
                WITHOUT
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="reveal-line block text-5xl md:text-7xl lg:text-[7vw] font-black text-primary-400 leading-[0.85] tracking-tighter">
                COMPROMISE
              </h2>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div
          ref={vehicleRef}
          className="absolute inset-0 flex items-center justify-center z-10 will-change-[opacity,transform]"
        >
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85"
            alt="Performance vehicle"
            className="w-[60vw] max-w-[850px] h-[50vh] object-cover rounded-2xl shadow-2xl"
            style={{ filter: "contrast(1.15) brightness(0.9) saturate(1.1)" }}
          />
        </div>

        {/* Speed counter */}
        <div
          ref={speedRef}
          className="absolute top-[15vh] left-[8vw] z-30 opacity-0"
        >
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary-400/50 mb-2 font-semibold">
              Performance
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter">
                450
              </span>
              <span className="text-lg font-bold text-primary-400">HP</span>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="absolute right-[6vw] top-1/2 -translate-y-1/2 z-30">
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              ref={(el) => { specRefs.current[i] = el; }}
              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0"
            >
              <div className="text-right">
                <p className="text-[10px] tracking-[0.5em] uppercase text-primary-400/50 mb-3 font-semibold">
                  {spec.label}
                </p>
                <div className="flex items-baseline gap-3 justify-end">
                  <span className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter">
                    {spec.value}
                  </span>
                  <span className="text-lg font-bold text-primary-400 tracking-wide">
                    {spec.unit}
                  </span>
                </div>
                <p className="text-sm text-white/30 mt-3 tracking-wide">{spec.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
