"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const metrics = [
  {
    value: 2500,
    suffix: "+",
    label: "CARS LISTED",
    description: "Verified vehicles from trusted dealers nationwide",
  },
  {
    value: 98.2,
    suffix: "%",
    label: "BUYER SATISFACTION",
    description: "Rated by real buyers after every transaction",
  },
  {
    value: 8,
    suffix: "+",
    label: "YEARS IN NIGERIA",
    description: "Building trust in Africa's largest car market",
  },
  {
    value: 36,
    suffix: "",
    label: "STATES COVERED",
    description: "From Lagos to Kano, we deliver everywhere",
  },
];

export function MetricsScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      }

      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const value = item.querySelector(".metric-value");
        const label = item.querySelector(".metric-label");
        const desc = item.querySelector(".metric-desc");
        const line = item.querySelector(".metric-line");

        gsap.fromTo(
          value,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          label,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );

        if (desc) {
          gsap.fromTo(
            desc,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 70%",
                end: "top 45%",
                scrub: 1,
              },
            }
          );
        }

        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "top 50%",
                scrub: 1,
              },
            }
          );
        }

        // Animated counter
        const counter = countersRef.current[i];
        if (counter) {
          const metric = metrics[i];
          const obj = { value: 0 };
          gsap.to(obj, {
            value: metric.value,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              if (metric.value % 1 !== 0) {
                counter.textContent = obj.value.toFixed(1) + metric.suffix;
              } else {
                counter.textContent =
                  Math.floor(obj.value).toLocaleString() + metric.suffix;
              }
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 sm:py-48 bg-dark">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div ref={headingRef} className="mb-20 sm:mb-28">
          <span className="t-mono text-white/20 text-[0.55rem] tracking-[0.2em] block mb-4">
            By the numbers
          </span>
          <h3 className="t-display text-white/70 max-w-lg">
            The numbers behind
            <br />
            <span className="text-white">every mile driven.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="text-left"
            >
              <div className="metric-line h-[1px] bg-white/10 mb-8 origin-left" />
              <div className="metric-value text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
                <span
                  ref={(el) => {
                    countersRef.current[i] = el;
                  }}
                >
                  0{metric.suffix}
                </span>
              </div>
              <div className="metric-label t-mono text-white/30 mb-3">
                {metric.label}
              </div>
              <div className="metric-desc text-[0.75rem] text-white/15 leading-relaxed">
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
