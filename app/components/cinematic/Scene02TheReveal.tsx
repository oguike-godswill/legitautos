"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { num: "01", title: "BROWSE", desc: "Explore our curated collection of premium vehicles" },
  { num: "02", title: "DISCOVER", desc: "Detailed inspections and transparent history" },
  { num: "03", title: "EXPERIENCE", desc: "Seamless buying from selection to delivery" },
  { num: "04", title: "DRIVE", desc: "Your dream car, delivered to your doorstep" },
];

export function Scene02TheReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial states
    gsap.set(trackRef.current, { x: "100vw" });
    gsap.set(headingRef.current, { opacity: 0, y: 60 });

    const ctx = gsap.context(() => {
      // Massive spacer for scroll distance
      const getScrollDistance = () => {
        if (!trackRef.current || !spacerRef.current) return 0;
        return trackRef.current.scrollWidth;
      };

      // Heading reveal
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Horizontal scroll — track moves left as user scrolls
      gsap.to(trackRef.current, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: trackRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate each service card as it enters
      const cards = trackRef.current?.querySelectorAll(".service-card");
      cards?.forEach((card, i) => {
        const inner = card.querySelector(".card-inner");
        gsap.fromTo(
          inner,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "left 85%",
              end: "left 50%",
              scrub: 1,
              containerAnimation: undefined,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Spacer block — this creates the massive scroll distance */}
      <div ref={spacerRef} style={{ height: "800vh" }} className="relative bg-dark-950">
        {/* Background gradient during scroll */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      </div>

      {/* Pinned section — horizontal scroll track */}
      <section
        ref={sectionRef}
        className="relative bg-dark-950 overflow-hidden"
        style={{ marginTop: "-100vh" }}
      >
        {/* Section heading */}
        <div ref={headingRef} className="px-[8vw] pt-16 pb-8 opacity-0">
          <p className="text-[10px] tracking-[0.6em] uppercase text-primary-400/50 font-semibold mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            ONE JOURNEY.
            <br />
            <span className="text-primary-400">FOUR STEPS.</span>
          </h2>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex items-center gap-8 md:gap-12 px-[8vw] pb-20 will-change-transform"
        >
          {services.map((service, i) => (
            <div
              key={service.num}
              className="service-card flex-shrink-0 w-[350px] md:w-[500px]"
            >
              <div className="card-inner">
                {/* Card number */}
                <span className="text-8xl md:text-[10rem] font-black text-white/[0.04] leading-none block mb-4">
                  {service.num}
                </span>

                {/* Card content */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-sm">
                    {service.desc}
                  </p>
                  <div className="h-px w-0 hover:w-full bg-primary-500/40 mt-6 transition-all duration-700" />
                </div>
              </div>
            </div>
          ))}

          {/* End card */}
          <div className="flex-shrink-0 w-[300px] md:w-[400px] border border-white/10 rounded-3xl p-10 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/25 mb-4">
                Ready to start?
              </p>
              <a
                href="/cars"
                className="text-xl font-bold text-primary-400 hover:text-primary-300 transition-colors"
              >
                Browse Collection →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
