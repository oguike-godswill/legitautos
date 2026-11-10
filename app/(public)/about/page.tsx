import { Metadata } from "next";
import {
  ShieldCheck,
  Heart,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Car,
  Search,
  MessageCircle,
  MapPin,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import Link from "next/link";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: "About Our Dealership | Lagos Showroom",
  description: `Learn about ${dealership.name} — Lagos's trusted automotive dealership for verified Foreign Used (Tokunbo), Brand New, and Nigerian Used vehicles in Lagos.`,
  openGraph: {
    title: "About Us | LegitAutos",
    description: `Learn about ${dealership.name} — verified cars and transparent documentation in Lagos.`,
    url: `${dealership.siteUrl}/about`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/about`,
  },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Real Photos, Real Stock",
    description:
      "Every vehicle page shows high-resolution studio & showroom photography of the exact car on our lot, along with live status updates.",
  },
  {
    icon: FileCheck2,
    title: "Verified Customs & Title",
    description:
      "We verify original Nigerian Customs Service duty papers, VIN history, and ownership transfer logs before any car enters our showroom.",
  },
  {
    icon: Target,
    title: "Quality Over Volume",
    description:
      "We don't list unvetted broker cars. Every car on LegitAutos has passed our 5-pillar mechanical, OBD-II, and chassis audit.",
  },
  {
    icon: TrendingUp,
    title: "Direct Dealership Desk",
    description:
      "Clear Naira pricing, direct answers, and zero middleman runaround. You deal with one dedicated showroom team from inspection to handover.",
  },
];

/* Real team members. Photos intentionally omitted — add real photos when available. */
const TEAM_MEMBERS = [
  {
    name: "Abiodun Emmanuel",
    role: "CEO & Managing Director",
    description:
      "Leads the executive vision, dealership standards, and strategic sourcing network behind LegitAutos.",
  },
  {
    name: "Uwaje Wisdom",
    role: "Chief Operating Officer",
    description:
      "Oversees daily showroom operations, inspection compliance, and customer handover execution.",
  },
  {
    name: "Bello Halimat Omopelumi",
    role: "Secretary / Social Media Manager",
    description:
      "Manages client communications, digital walkarounds, and brand presence across channels.",
  },
  {
    name: "Bolanle Precious",
    role: "Human Resources Manager",
    description:
      "Oversees talent acquisition, concierge training, and organizational culture.",
  },
  {
    name: "Anthony Somto Blessing",
    role: "Logistics Manager",
    description:
      "Coordinates port clearance, vehicle prep, and nationwide insured delivery operations.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Filter & Compare",
    description: "Browse our live inventory by budget, condition (Tokunbo or Nigerian Used), and body type.",
  },
  {
    icon: MessageCircle,
    step: "02",
    title: "Connect or Video Inspect",
    description: "Chat with our showroom desk on WhatsApp for cold-start videos, customs verification, or questions.",
  },
  {
    icon: CheckCircle2,
    step: "03",
    title: "Inspect in Lagos",
    description: "Visit our Lagos showroom with your independent mechanic for a physical test drive.",
  },
  {
    icon: Car,
    step: "04",
    title: "Complete & Drive",
    description: "Finalize payment or trade-in paperwork and drive out or schedule insured delivery.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Dark Architectural Hero */}
      <section className="bg-[#0C0C0E] text-white pt-10 pb-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D9381E]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[#C89D54] text-xs font-bold tracking-wider uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#D9381E]" />
            Lagos Showroom • Nigeria
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight max-w-3xl leading-[1.08]">
            One Dealership.{" "}
            <span className="t-editorial text-[#D9381E]">
              Zero Guesswork.
            </span>
          </h1>
          <p className="mt-5 text-sm sm:text-base text-white/65 max-w-2xl leading-relaxed">
            {dealership.name} is an automotive dealership based at{" "}
            <span className="text-white font-semibold">{dealership.address.display}</span>.
            We curate verified Foreign Used (Tokunbo), Brand New, and clean Nigerian Used vehicles—built on transparent pricing and complete documentation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D9381E] hover:bg-[#B82B14] text-white font-bold text-sm transition-all shadow-lg shadow-[#D9381E]/20"
            >
              Explore Showroom Stock
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/inspections"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#C89D54]" />
              Our 5-Pillar Inspection Standard
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 lg:p-16 shadow-sm grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9381E] block mb-2">
              Our Dealership Ethos
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight leading-tight">
              Built on a simple belief: buyers deserve clarity.
            </h2>
            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-[#F6F4EF] border border-gray-200/80">
              <MapPin className="w-5 h-5 text-[#D9381E] shrink-0" />
              <div>
                <p className="text-xs font-bold text-dark-900">{dealership.address.display}</p>
                <p className="text-xs text-dark-500">{dealership.address.country} • {dealership.openingHours}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-dark-600 leading-relaxed">
            <p>
              Buying a car in Nigeria too often means navigating unverified street listings, mismatched photos, hidden accident histories, and customs duty surprises.{" "}
              <strong className="text-dark-900">{dealership.name}</strong> was founded to set a higher institutional standard: every vehicle we list features authentic photography, verified mileage, transparent Naira pricing, and live availability status.
            </p>
            <p>
              When you message or call us, you speak directly with our in-house Lagos team—never an unaccountable third-party middleman. We arrange physical showroom inspections, live WhatsApp video walkarounds for out-of-state buyers, and seamless trade-in valuations. If your exact specification isn&apos;t currently on our floor,{" "}
              <Link href="/request" className="text-[#D9381E] font-bold hover:underline">
                submit a sourcing brief
              </Link>{" "}
              and our acquisition desk will locate and vet it for you.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-16 sm:pb-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9381E] block mb-2">
            What We Stand For
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">
            The LegitAutos Standard
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white border border-gray-200/80 p-6 shadow-sm hover:shadow-md hover:border-[#D9381E]/30 transition-all"
            >
              <div className="w-12 h-12 bg-[#D9381E]/10 rounded-xl flex items-center justify-center mb-5">
                <value.icon className="w-6 h-6 text-[#D9381E]" />
              </div>
              <h3 className="text-base font-extrabold text-dark-900 mb-2">{value.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Team */}
      <section className="pb-16 sm:pb-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9381E] block mb-2">
            Leadership &amp; Operations
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">
            People Behind {dealership.name}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-white border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-[#0C0C0E] text-[#C89D54] flex items-center justify-center shrink-0 font-black text-base shadow-sm">
                    {initials(member.name)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-dark-900">{member.name}</h3>
                    <p className="text-xs text-[#D9381E] font-bold mt-0.5">{member.role}</p>
                  </div>
                </div>
                <p className="text-sm text-dark-500 leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-16 sm:pb-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9381E] block mb-2">
            Seamless Process
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">
            Four Steps to Your Next Vehicle
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl bg-white border border-gray-200/80 p-6 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 bg-[#D9381E]/10 rounded-xl flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-[#D9381E]" />
                </div>
                <span className="t-mono text-xs font-black text-dark-300 bg-gray-100 px-2.5 py-1 rounded-lg">
                  STEP {step.step}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-dark-900 mb-2">{step.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0C0C0E] p-8 sm:p-12 text-center relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9381E]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-4">
              Ready to Inspect Your Next Car?
            </h2>
            <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-8">
              Browse our verified Lagos showroom stock, chat with our sales desk on WhatsApp, or send us a custom sourcing brief.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/cars"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#D9381E] text-white font-bold rounded-xl hover:bg-[#B82B14] transition-colors text-sm"
              >
                Browse Showroom Inventory
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={dealershipWhatsApp("Hello LegitAutos, I'd like to speak with the Lagos showroom team.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/15 border border-white/10 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp Showroom Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
