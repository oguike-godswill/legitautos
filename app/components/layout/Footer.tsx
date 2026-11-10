"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  CarFront,
} from "lucide-react";
import {
  dealership,
  dealershipShortLabel,
  dealershipWhatsApp,
  dealershipCall,
} from "@/app/config/dealership";

const INVENTORY_SILOS = [
  { href: "/cars?condition=foreign-used", label: "Foreign Used (Tokunbo)" },
  { href: "/cars?condition=nigerian-used", label: "Nigerian Used Cars" },
  { href: "/cars?condition=new", label: "Brand New Vehicles" },
  { href: "/cars?bodyType=suv", label: "Luxury SUVs & 4x4s" },
  { href: "/cars?bodyType=sedan", label: "Executive Sedans" },
  { href: "/cars?maxPrice=15000000", label: "Vehicles Under ₦15M" },
];

const QUICK_LINKS = [
  { href: "/cars", label: "Showroom Inventory" },
  { href: "/inspections", label: "150-Point Inspections" },
  { href: "/sell", label: "Sell or Swap Your Car" },
  { href: "/request", label: "Bespoke Car Sourcing" },
  { href: "/compare", label: "Compare Vehicles" },
  { href: "/about", label: "The Atelier Story" },
  { href: "/contact", label: "Showroom Directions" },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#0C0C0E] text-white border-t border-white/10">
      {/* Top Pre-Footer Concierge Banner */}
      <div className="border-b border-white/10 bg-[#141417]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 t-mono text-xs text-[#D9381E]">
              <ShieldCheck className="w-4 h-4" />
              Lagos Automotive Atelier
            </span>
            <h3 className="mt-1.5 font-display text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Ready to inspect a vehicle or trade in your current keys?
            </h3>
            <p className="mt-1.5 text-sm text-white/60">
              Speak directly with our Lagos showroom desk — zero brokers, full customs transparency.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={dealershipWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#D9381E] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B82B14] transition-colors shadow-lg shadow-[#D9381E]/20"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Concierge
            </a>
            <Link
              href="/request"
              className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/15 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[#0C0C0E] transition-colors"
            >
              <CarFront className="w-4 h-4" />
              Custom Sourcing Brief
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt={`${dealership.name} logo`}
                width={279}
                height={156}
                className="h-11 w-auto object-contain"
              />
              <div>
                <span className="font-display text-base font-extrabold text-white tracking-tight block leading-none">
                  {dealership.name}
                </span>
                <span className="t-mono text-[0.6rem] text-[#C89D54] tracking-[0.2em] mt-1 block">
                  {dealershipShortLabel}
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
              {dealership.description}
            </p>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 t-mono text-[0.65rem] text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Showroom Open: {dealership.openingHours}
            </div>
          </div>

          {/* Column 2: Popular Inventory Silos (SEO Internal Links) */}
          <div className="lg:col-span-3">
            <h4 className="t-mono text-xs text-[#C89D54] mb-4">
              Showroom Collections
            </h4>
            <ul className="space-y-2.5">
              {INVENTORY_SILOS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 hover:text-[#D9381E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Dealership Navigation */}
          <div className="lg:col-span-2">
            <h4 className="t-mono text-xs text-[#C89D54] mb-4">
              The Dealership
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 hover:text-[#D9381E] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Showroom Contact */}
          <div className="lg:col-span-3">
            <h4 className="t-mono text-xs text-[#C89D54] mb-4">
              Lagos Showroom Desk
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D9381E] mt-0.5 shrink-0" />
                <span className="text-white/80">{dealership.address.display}</span>
              </li>
              <li>
                <a
                  href={dealershipCall()}
                  className="flex items-center gap-3 text-white/80 hover:text-[#D9381E] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D9381E] shrink-0" />
                  <span className="t-mono">{dealership.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${dealership.email}`}
                  className="flex items-center gap-3 text-white/80 hover:text-[#D9381E] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#D9381E] shrink-0" />
                  <span className="truncate">{dealership.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C89D54] shrink-0" />
                <span className="text-white/65">{dealership.openingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <span>
            &copy; {new Date().getFullYear()} {dealership.legalName} (
            {dealership.name}). All Rights Reserved.
          </span>
          <span className="t-mono text-[0.65rem]">
            Certified Automotive Marketplace &middot; {dealership.address.display}
          </span>
        </div>
      </div>
    </footer>
  );
}
