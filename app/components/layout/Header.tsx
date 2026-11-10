"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  Search,
  Heart,
  Scale,
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
} from "lucide-react";
import {
  dealership,
  dealershipWhatsApp,
  dealershipCall,
} from "@/app/config/dealership";
import { useFavorites } from "@/app/stores/favoriteStore";
import { useCompare } from "@/app/stores/compareStore";
import { useUIStore } from "@/app/stores/uiStore";

const navLinks = [
  { href: "/cars", label: "Showroom" },
  { href: "/inspections", label: "Inspections" },
  { href: "/request", label: "Custom Sourcing" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "The Atelier" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { compareList } = useCompare();
  const { setSavedDrawerOpen, setCommandSearchOpen } = useUIStore();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const favCount = mounted ? favorites.length : 0;
  const cmpCount = mounted ? compareList.length : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top Atelier Telemetry Bar (Desktop) */}
        <div
          className={`hidden md:block bg-[#0C0C0E] text-white/75 border-b border-white/10 transition-all duration-300 overflow-hidden ${
            scrolled ? "max-h-0 opacity-0 border-none" : "max-h-10 opacity-100"
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between t-mono text-[0.65rem]">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D9381E]" />
                150-Point Certified • Customs Duty Verified
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#D9381E]" />
                {dealership.address.display}
              </span>
              <span className="hidden lg:flex items-center gap-1.5 text-white/55">
                <Clock className="w-3 h-3 text-[#C89D54]" />
                {dealership.openingHours}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href={dealershipCall()}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-[#D9381E]" />
                {dealership.phone}
              </a>
              <span className="h-3 w-px bg-white/15" />
              <a
                href={dealershipWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live WhatsApp Desk
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={`transition-all duration-300 ${
            scrolled
              ? "border-b border-[#0C0C0E]/12 bg-[#F6F4EF]/95 backdrop-blur-xl shadow-[0_10px_30px_-15px_rgba(12,12,14,0.12)]"
              : "border-b border-[#0C0C0E]/10 bg-[#F6F4EF]/90 backdrop-blur-md"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-[4.5rem] gap-3 max-w-[1440px] mx-auto">
              {/* Brand Logo */}
              <Link
                href="/"
                aria-label={`${dealership.name} home`}
                className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9381E] rounded-xl"
              >
                <Image
                  src="/logo-blue.png"
                  alt={`${dealership.name} logo`}
                  width={279}
                  height={156}
                  className="h-10 w-auto object-contain md:h-11"
                  priority
                />
              </Link>

              {/* Desktop Architectural Navigation Links */}
              <nav
                aria-label="Main navigation"
                className="hidden lg:flex items-center gap-1 rounded-full border border-[#0C0C0E]/10 bg-[#EFECE6] p-1"
              >
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all duration-200 ${
                        isActive
                          ? "bg-[#0C0C0E] text-white shadow-xs"
                          : "text-[#2B2B30] hover:text-[#0C0C0E] hover:bg-white/80"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Right Utility & CTA Cluster */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Command Search Trigger */}
                <button
                  type="button"
                  onClick={() => setCommandSearchOpen(true)}
                  aria-label="Search inventory (Ctrl+K)"
                  className="flex items-center gap-2.5 rounded-full border border-[#0C0C0E]/12 bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2B30] transition-all hover:border-[#D9381E] hover:text-[#0C0C0E] cursor-pointer shadow-2xs"
                >
                  <Search className="h-3.5 w-3.5 text-[#D9381E] shrink-0" />
                  <span className="hidden sm:inline">Search make, model...</span>
                  <kbd className="hidden xl:inline-block rounded bg-[#EFECE6] px-1.5 py-0.5 t-mono text-[0.58rem] text-[#52504D]">
                    ⌘K
                  </kbd>
                </button>

                {/* Saved Garage Drawer Button */}
                <button
                  type="button"
                  onClick={() => setSavedDrawerOpen(true)}
                  aria-label={`Saved garage (${favCount} cars)`}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#0C0C0E]/12 bg-white text-[#0C0C0E] transition-colors hover:border-[#D9381E] hover:text-[#D9381E] cursor-pointer"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favCount > 0 ? "fill-[#D9381E] text-[#D9381E]" : ""
                    }`}
                  />
                  {favCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9381E] px-1 t-mono text-[0.58rem] font-bold text-white">
                      {favCount}
                    </span>
                  )}
                </button>

                {/* Compare Page Link */}
                <Link
                  href="/compare"
                  aria-label={`Compare cars (${cmpCount} selected)`}
                  className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-[#0C0C0E]/12 bg-white text-[#0C0C0E] transition-colors hover:border-[#D9381E] hover:text-[#D9381E]"
                >
                  <Scale className="h-4 w-4" />
                  {cmpCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0C0C0E] px-1 t-mono text-[0.58rem] font-bold text-white">
                      {cmpCount}
                    </span>
                  )}
                </Link>

                {/* Sell / Trade-In Primary Button */}
                <Link
                  href="/sell"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 bg-[#D9381E] text-white hover:bg-[#B82B14] shadow-sm"
                >
                  <span>Sell / Swap</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[#0C0C0E]/12 bg-white text-[#0C0C0E] hover:bg-[#EFECE6] transition-colors"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-[6.75rem]" />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div
              className="absolute inset-0 bg-[#0C0C0E]/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 flex w-[85vw] max-w-sm flex-col bg-[#F6F4EF] shadow-2xl border-l border-[#0C0C0E]/10"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#0C0C0E]/10">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  aria-label={`${dealership.name} home`}
                  className="flex items-center"
                >
                  <Image
                    src="/logo-blue.png"
                    alt={`${dealership.name} logo`}
                    width={279}
                    height={156}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full bg-white border border-[#0C0C0E]/10 text-[#0C0C0E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-1.5">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between py-3.5 px-4 rounded-2xl transition-all ${
                          pathname === link.href
                            ? "bg-[#0C0C0E] text-white font-bold"
                            : "bg-white/70 text-[#0C0C0E] hover:bg-white font-semibold border border-[#0C0C0E]/5"
                        }`}
                      >
                        <span className="text-sm">{link.label}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-60" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-[#EFECE6] border border-[#0C0C0E]/10 p-4 space-y-1.5 text-xs text-[#52504D]">
                  <p className="font-bold text-[#0C0C0E]">
                    {dealership.address.display}
                  </p>
                  <p>{dealership.openingHours}</p>
                  <p className="t-mono font-bold text-[#D9381E] pt-1">{dealership.phone}</p>
                </div>

                <div className="mt-6 space-y-2.5">
                  <Link
                    href="/sell"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#D9381E] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B82B14] transition-colors"
                  >
                    Sell or Swap Your Car
                  </Link>
                  <a
                    href={dealershipWhatsApp()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0C0C0E] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#242322] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    WhatsApp Showroom
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
