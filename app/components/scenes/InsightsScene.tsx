"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";

const articles = [
  {
    title: "The Rise of Electric Cars in Nigeria",
    category: "Industry",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    date: "2026",
  },
  {
    title: "How to Import a Car from the US to Nigeria",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
    date: "2026",
  },
  {
    title: "Top 10 SUVs for Nigerian Roads",
    category: "Reviews",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
    date: "2026",
  },
  {
    title: "Understanding Car Insurance in Nigeria",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    date: "2026",
  },
  {
    title: "Luxury Cars: Worth the Investment?",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    date: "2026",
  },
];

export function InsightsScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const totalScroll = cardsRef.current!.scrollWidth - window.innerWidth;

      gsap.to(cardsRef.current, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${totalScroll}`,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-dark">
      <div className="absolute top-12 left-6 sm:left-8 lg:left-12 z-10">
        <div className="t-mono text-white/30 mb-3">Insights</div>
        <h2 className="t-display text-white">WHAT&apos;S DRIVING.</h2>
      </div>

      <div ref={cardsRef} className="absolute top-0 left-0 h-full flex items-center gap-8 pl-6 sm:pl-8 lg:pl-12 pr-[30vw]">
        {articles.map((article, i) => (
          <div key={i} className="flex-shrink-0 w-[350px] sm:w-[450px] group cursor-pointer">
            <div className="relative h-[350px] sm:h-[450px] rounded-2xl overflow-hidden mb-5">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="t-mono text-white/50 text-[0.55rem]">{article.category}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300 leading-tight">
              {article.title}
            </h3>
            <div className="t-mono text-white/30 text-[0.55rem] mt-2">{article.date}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
