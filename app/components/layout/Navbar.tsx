"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/app/animations/gsap";
import { Search, ArrowRight, MapPin, Phone, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  {
    label: "Cars",
    href: "/cars",
    description: "Browse inventory",
    hasDropdown: true,
  },
  { label: "Brands", href: "/brands", description: "All manufacturers" },
  { label: "Sell", href: "/sell", description: "List your car" },
  { label: "Contact", href: "/contact", description: "Get in touch" },
] as const;

const POPULAR_BRANDS = [
  { name: "Toyota", slug: "toyota", count: "340+" },
  { name: "Mercedes-Benz", slug: "mercedesbenz", count: "210+" },
  { name: "Lexus", slug: "lexus", count: "180+" },
  { name: "Honda", slug: "honda", count: "150+" },
  { name: "BMW", slug: "bmw", count: "120+" },
  { name: "Ford", slug: "ford", count: "90+" },
];

const CAR_CATEGORIES = [
  { name: "SUVs", href: "/cars?bodyType=suv" },
  { name: "Sedans", href: "/cars?bodyType=sedan" },
  { name: "Luxury", href: "/cars?category=luxury" },
  { name: "Electric", href: "/cars?fuel=electric" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Scroll-aware glass effect + progress bar
  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top -80",
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });

      // Scroll progress bar
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const links = mobileLinksRef.current.filter(Boolean);

    if (menuOpen) {
      gsap.set(mobileMenuRef.current, { display: "block" });
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        links,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(mobileMenuRef.current, { display: "none" });
        },
      });
    }
  }, [menuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("toggle-search"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-out"
      style={{
        background: scrolled ? "rgba(10, 10, 10, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(36px) saturate(1.5)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.04)"
          : "1px solid transparent",
      }}
    >
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.02] overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Top info bar */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-8 opacity-100"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 h-8 flex items-center justify-between border-b border-white/[0.03]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 t-mono text-[0.48rem] text-white/50">
              <MapPin className="w-2.5 h-2.5" />
              Lagos, Nigeria
            </span>
            <span className="hidden sm:flex items-center gap-1.5 t-mono text-[0.48rem] text-white/50">
              <Phone className="w-2.5 h-2.5" />
              +234 800 000 0000
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="t-mono text-[0.48rem] text-white/50 hidden sm:block">
              Nigeria&apos;s Premier Car Marketplace
            </span>
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 h-[4.5rem] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative z-10">
          <div className="relative w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.09] transition-all duration-500 border border-white/[0.05] group-hover:border-white/[0.1] group-hover:scale-[1.03]">
            <span className="text-[0.65rem] font-black text-white tracking-widest">
              LV
            </span>
            <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[0.72rem] font-bold text-white tracking-[0.18em] leading-none">
              LEGITVENTURE
            </span>
            <span className="t-mono text-[0.42rem] text-white/35 mt-1 tracking-[0.3em]">
              AUTOS
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const hasDropdown = "hasDropdown" in link && link.hasDropdown;

            return (
              <div
                key={link.label}
                className="relative"
                ref={hasDropdown ? dropdownRef : undefined}
              >
                {hasDropdown ? (
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`relative px-4 py-2 t-mono text-[0.6rem] transition-colors duration-300 group flex items-center gap-1.5 ${
                      active
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span
                      className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${
                        active
                          ? "bg-white/[0.06] border border-white/[0.04]"
                          : "bg-white/[0.03] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                      }`}
                    />
                    {active && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/35" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 t-mono text-[0.6rem] transition-colors duration-300 group ${
                      active
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span
                      className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${
                        active
                          ? "bg-white/[0.06] border border-white/[0.04]"
                          : "bg-white/[0.03] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                      }`}
                    />
                    {active && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/35" />
                    )}
                  </Link>
                )}

                {/* Cars dropdown */}
                {hasDropdown && dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[480px] bg-dark/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6">
                      {/* Categories */}
                      <div className="mb-6">
                        <span className="t-mono text-[0.5rem] text-white/35 block mb-3">
                          Categories
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {CAR_CATEGORIES.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors duration-200"
                            >
                              <span className="text-sm text-white/60 hover:text-white/90">
                                {cat.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Popular brands */}
                      <div>
                        <span className="t-mono text-[0.5rem] text-white/35 block mb-3">
                          Popular brands
                        </span>
                        <div className="grid grid-cols-2 gap-1">
                          {POPULAR_BRANDS.map((brand) => (
                            <Link
                              key={brand.name}
                              href={`/brands/${brand.slug}`}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors duration-200 group"
                            >
                              <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
                                {brand.name}
                              </span>
                              <span className="t-mono text-[0.45rem] text-white/25">
                                {brand.count}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* View all */}
                      <div className="mt-4 pt-4 border-t border-white/[0.04]">
                        <Link
                          href="/cars"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 t-mono text-[0.55rem] text-white/40 hover:text-white/70 transition-colors"
                        >
                          View all cars
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 relative z-10">
          {/* Search button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-search"))}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-300 group"
            aria-label="Search"
          >
            <Search className="w-[0.9rem] h-[0.9rem]" strokeWidth={1.5} />
            <kbd className="ml-1.5 hidden lg:inline t-mono text-[0.4rem] text-white/20 group-hover:text-white/40 px-1 py-0.5 rounded bg-white/[0.03]">
              /
            </kbd>
          </button>

          <Link
            href="/sell"
            className="hidden sm:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04] t-mono text-[0.55rem] text-white/60 hover:text-white transition-all duration-500 group"
          >
            Sell
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-[1.5px] bg-white/55 relative">
              <span
                className={`absolute left-0 block w-full h-full bg-white transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "rotate-45 translate-y-0" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute left-0 block w-full h-full bg-white transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "-rotate-45 translate-y-0" : "translate-y-[5px]"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-dark/[0.98] backdrop-blur-3xl hidden overflow-y-auto"
        style={{ display: "none" }}
      >
        <div className="px-6 pt-24 pb-12">
          <div className="flex items-center gap-2 mb-8 px-4">
            <MapPin className="w-3 h-3 text-white/25" />
            <span className="t-mono text-[0.48rem] text-white/25">
              Lagos, Nigeria
            </span>
          </div>

          <div className="space-y-1 mb-10">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  ref={(el) => {
                    mobileLinksRef.current[i] = el;
                  }}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-300 ${
                    active
                      ? "text-white bg-white/[0.04]"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <span className="t-mono text-[0.7rem] tracking-[0.12em] block">
                      {link.label}
                    </span>
                    <span className="text-[0.52rem] text-white/25 mt-0.5 block">
                      {link.description}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-white/15" />
                </Link>
              );
            })}
          </div>

          {/* Categories */}
          <div className="mb-8">
            <span className="t-mono text-[0.48rem] text-white/25 px-4 block mb-3">
              Categories
            </span>
            <div className="flex flex-wrap gap-2 px-4">
              {CAR_CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full border border-white/[0.04] t-mono text-[0.48rem] text-white/18 hover:text-white/45 hover:border-white/[0.08] transition-all duration-300"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular brands */}
          <div className="mb-10">
            <span className="t-mono text-[0.48rem] text-white/25 px-4 block mb-3">
              Popular brands
            </span>
            <div className="flex flex-wrap gap-2 px-4">
              {POPULAR_BRANDS.map((brand) => (
                <Link
                  key={brand.name}
                  href={`/brands/${brand.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1.5 rounded-full border border-white/[0.06] t-mono text-[0.48rem] text-white/30 hover:text-white/60 hover:border-white/[0.12] transition-all duration-300"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="px-4">
            <Link
              href="/sell"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.06] hover:border-white/[0.12] t-mono text-[0.6rem] text-white/60 hover:text-white transition-all duration-300"
            >
              List your car
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-white/[0.03] px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/[0.03] flex items-center justify-center">
                <span className="text-[0.42rem] font-black text-white/25">
                  LV
                </span>
              </div>
              <div>
                <span className="text-[0.58rem] text-white/35 block">
                  LegitVenture Autos
                </span>
                <span className="text-[0.42rem] text-white/20 block">
                  &copy; {new Date().getFullYear()} All rights reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
