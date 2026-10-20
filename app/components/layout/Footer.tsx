"use client";

import Link from "next/link";
import { Car, MapPin, Phone, Mail, Clock } from "lucide-react";
import { dealership, dealershipShortLabel } from "@/app/config/dealership";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Browse Cars" },
  { href: "/compare", label: "Compare Cars" },
  { href: "/sell", label: "Sell or Trade In" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

/* Only services LegitAutos actually offers. No unverified claims. */
const SERVICES = ["Car Sales", "Trade-In", "Car Sourcing"];

export function Footer() {
  const CONTACT_INFO = [
    { icon: MapPin, text: dealership.address.display },
    { icon: Phone, text: dealership.phone },
    { icon: Mail, text: dealership.email },
    { icon: Clock, text: dealership.openingHours },
  ];

  return (
    <footer className="bg-ink">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-8 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-bold text-white tracking-wide block leading-tight">
                    {dealership.name}
                  </span>
                  <span className="text-[0.55rem] text-white/60 uppercase tracking-widest">
                    {dealershipShortLabel}
                  </span>
                </div>
              </Link>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm mb-6">
                {dealership.tagline}. Browse available cars, compare options, and
                talk to our team about any vehicle.
              </p>
              {dealership.socials.length > 0 && (
                <div className="flex items-center gap-3">
                  {dealership.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 bg-white/5 hover:bg-teal rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                      <span className="text-xs font-bold text-white">
                        {social.label.charAt(0)}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">
                Our Services
              </h4>
              <ul className="space-y-3">
                {SERVICES.map((service) => (
                  <li key={service}>
                    <span className="text-sm text-white/70">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">
                Contact Us
              </h4>
              <ul className="space-y-3">
                {CONTACT_INFO.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-teal mt-0.5 shrink-0" />
                    <span className="text-sm text-white/80">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} {dealership.legalName} ({dealership.name}). All
            Rights Reserved.
          </span>
          <span className="text-xs text-white/60">
            {dealership.address.display}
          </span>
        </div>
      </div>
    </footer>
  );
}
