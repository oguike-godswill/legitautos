"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { dealership } from "@/app/config/dealership";

const navLinks = [
  { href: "/cars", label: "Browse Cars" },
  { href: "/request", label: "Request a Car" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-dark-900/[0.06] bg-white"
      >
        <div className="px-1 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-[3.5rem] md:h-[4.25rem] gap-4 max-w-[1400px] mx-auto">
            {/* Logo only — no wordmark. The source PNG is 279x156 (~1.8:1)
                with the transparent padding already cropped out, so it is
                sized directly: the rendered image is exactly this tall. */}
            <Link href="/" aria-label={`${dealership.name} home`} className="flex items-center md:relative">
              <Image
                src="/logo-blue.png"
                alt={`${dealership.name} logo`}
                width={279}
                height={156}
                className="h-[2.75rem] w-auto object-contain md:h-[3.5rem]"
                priority
              />
            </Link>

            {/* Desktop Nav - center */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[0.8rem] font-bold uppercase tracking-[0.08em] transition-colors duration-300 ${
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "text-teal"
                      : "text-dark-900 hover:text-teal"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-4">
              <Link
                href="/sell"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] rounded-lg transition-all duration-300 bg-teal text-white hover:bg-teal-700"
              >
                Sell or Trade In
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 transition-colors text-dark-900"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-sm bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Link href="/" onClick={() => setMobileOpen(false)} aria-label={`${dealership.name} home`} className="flex items-center">
                  <Image
                    src="/logo-blue.png"
                    alt={`${dealership.name} logo`}
                    width={279}
                    height={156}
                    className="h-11 w-auto object-contain"
                  />
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-dark-700" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between py-3 px-3 rounded-lg transition-all ${
                          pathname === link.href
                            ? "bg-teal/10 text-teal font-semibold"
                            : "text-dark-600 hover:bg-gray-50"
                        }`}
                       
                      >
                        <span className="text-sm font-bold uppercase tracking-[0.08em]">{link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-dark-300" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="/sell"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-teal text-white text-sm font-bold uppercase tracking-[0.08em] rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Sell or Trade In
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

