"use client";

import Link from "next/link";
import { Car, MapPin, Phone, Mail, Clock } from "lucide-react";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Browse Cars" },
  { href: "/sell", label: "Sell Your Car" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const SERVICES = [
  "Car Sales",
  "Trade-In",
  "Vehicle Inspection",
  "Nationwide Delivery",
  "Import Assistance",
];

const CONTACT_INFO = [
  { icon: MapPin, text: "Lagos, Nigeria" },
  { icon: Phone, text: "+234 800 LegitAutos" },
  { icon: Mail, text: "info@LegitAutoss.com" },
  { icon: Clock, text: "Mon - Sat: 8AM - 6PM WAT" },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-8 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-bold text-white tracking-wide block leading-tight">
                    LegitAutos
                  </span>
                  <span className="text-[0.55rem] text-white uppercase tracking-widest">Auto Marketplace</span>
                </div>
              </Link>
              <p className="text-sm text-white leading-relaxed max-w-sm mb-6">
                Nigeria&apos;s trusted car marketplace. Buy, sell, and find your perfect vehicle with confidence.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Instagram" className="w-9 h-9 bg-white/5 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" aria-label="Facebook" className="w-9 h-9 bg-white/5 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="w-9 h-9 bg-white/5 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Our Services</h4>
              <ul className="space-y-3">
                {SERVICES.map((service) => (
                  <li key={service}>
                    <span className="text-sm text-white">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Contact Us</h4>
              <ul className="space-y-3">
                {CONTACT_INFO.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-white">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white">
            &copy; {new Date().getFullYear()} LegitAutos Autos. All Rights Reserved.
          </span>
          <div className="flex items-center gap-6 text-xs text-white">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

