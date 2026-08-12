"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Car, ChevronDown, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/cars", label: "Vehicles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Support" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = isHome && !scrolled
    ? "bg-transparent"
    : scrolled
    ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
    : "bg-white";

  const textColor = isHome && !scrolled ? "text-white" : "text-dark-900";
  const textNav = isHome && !scrolled ? "text-white/60 hover:text-white" : "text-dark-500 hover:text-dark-900";

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 max-w-[1400px] mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-500 ${
                isHome && !scrolled ? "bg-white/10 border border-white/15" : "bg-dark"
              }`}>
                <Car className="w-4.5 h-4.5 text-white" />
              </div>
              <span className={`text-sm font-bold tracking-[0.15em] uppercase transition-colors duration-500 ${textColor}`}
               >
                LegitVenture
              </span>
            </Link>

            {/* Desktop Nav - center */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[0.8rem] font-medium transition-colors duration-300 ${
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                      ? "text-primary"
                      : `${textNav}`
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
                className={`hidden md:flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                  isHome && !scrolled
                    ? "bg-white text-dark-900 hover:bg-white/90"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                Sell Your Car
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isHome && !scrolled ? "text-white hover:bg-white/10" : "text-dark-700 hover:bg-gray-100"
                }`}
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
            className="fixed inset-0 z-40 md:hidden"
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
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-dark flex items-center justify-center">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-dark-900 tracking-[0.15em] uppercase">LV</span>
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
                            ? "bg-orange-50 text-primary font-semibold"
                            : "text-dark-600 hover:bg-gray-50"
                        }`}
                       
                      >
                        <span className="text-sm">{link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-dark-300 group-hover:text-primary transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="/sell"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Sell Your Car
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
