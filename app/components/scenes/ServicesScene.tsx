"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const services = [
  {
    num: "01",
    title: "BUY\nA CAR",
    description: "Browse thousands of verified cars from trusted dealers across Nigeria. Transparent pricing, zero surprises.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=80",
  },
  {
    num: "02",
    title: "SELL\nYOUR CAR",
    description: "List your vehicle to thousands of serious buyers. We handle verification, you close the deal.",
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1400&q=80",
  },
  {
    num: "03",
    title: "GET\nFINANCED",
    description: "Flexible financing to make your dream car affordable. Quick approvals, competitive rates.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=80",
  },
  {
    num: "04",
    title: "CAR\nDELIVERY",
    description: "Secure delivery to your doorstep anywhere in Nigeria. Fully insured, fully tracked.",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=80",
  },
  {
    num: "05",
    title: "IMPORT\nYOUR CAR",
    description: "Import your dream car from the US, UAE, or Europe. We handle customs and clearance.",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80",
  },
  {
    num: "06",
    title: "PRE-PURCHASE\nINSPECTION",
    description: "Comprehensive inspection by certified mechanics. Know exactly what you're buying.",
    image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1400&q=80",
  },
];

export function ServicesScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll(".service-item");

      items.forEach((item) => {
        const img = item.querySelector(".service-img");
        const num = item.querySelector(".service-num");
        const title = item.querySelector(".service-title");
        const desc = item.querySelector(".service-desc");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            pin: true,
            scrub: 1,
            start: "top top",
            end: "bottom top",
          },
        });

        tl.fromTo(img as Element, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 }, 0)
          .fromTo(num as Element, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.1)
          .fromTo(title as Element, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.15)
          .fromTo(desc as Element, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.25)
          .to(item as Element, { opacity: 0, duration: 0.2 }, 0.7);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-dark">
      <div ref={containerRef}>
        {services.map((service) => (
          <div key={service.num} className="service-item relative h-screen overflow-hidden">
            <div className="service-img absolute inset-0 opacity-0">
              <img
                src={service.image}
                alt={service.title.replace("\n", " ")}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-dark/50" />
            </div>

            <div className="relative z-10 h-full flex items-center px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                <div>
                  <div className="service-num t-mono text-white/30 mb-4 opacity-0">{service.num}</div>
                  <div className="service-title t-editorial text-white whitespace-pre-line opacity-0">{service.title}</div>
                </div>
                <div className="lg:pl-12">
                  <div className="service-desc max-w-md opacity-0">
                    <p className="text-lg text-white/60 leading-relaxed mb-8">{service.description}</p>
                    <a href="/cars" className="btn-cinematic">
                      Explore
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
