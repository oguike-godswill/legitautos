import { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ArrowRight,
  Send,
  Headphones,
  ShieldCheck,
  Car,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/app/components/sections/ContactForm";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";
import { faqs } from "@/app/config/faq";

export const metadata: Metadata = {
  title: "Contact Our Lagos Showroom",
  description:
    "Get in touch with LegitAutos in Lagos, Nigeria. Schedule a vehicle inspection, request a live WhatsApp video walkaround, or inquire about trade-ins.",
  openGraph: {
    title: "Contact Us | LegitAutos",
    description: "Get in touch with LegitAutos in Lagos, Nigeria.",
    url: `${dealership.siteUrl}/contact`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/contact`,
  },
};

const CONTACT_METHODS = [
  {
    icon: Phone,
    label: "Direct Showroom Line",
    value: dealership.phone,
    description: dealership.openingHours,
    action: `tel:${dealership.phone.replace(/\D/g, "")}`,
    badge: "Voice Desk",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Concierge",
    value: "Instant Chat & Video Calls",
    description: "Fastest response during business hours",
    action: dealershipWhatsApp(),
    badge: "Online Now",
  },
  {
    icon: Mail,
    label: "Email Desk",
    value: dealership.email,
    description: "Corporate & documentation inquiries",
    action: `mailto:${dealership.email}`,
    badge: "24h Reply",
  },
  {
    icon: MapPin,
    label: "Lagos Showroom",
    value: dealership.address.city,
    description: `${dealership.address.city}, ${dealership.address.country}`,
    action: "#locations",
    badge: "HQ",
  },
];

const QUICK_LINKS = [
  { icon: Car, label: "Browse Live Inventory", href: "/cars", description: "Filter verified Foreign Used & Brand New vehicles" },
  { icon: Send, label: "Bespoke Car Sourcing", href: "/request", description: "Tell us your exact spec and budget—we'll source it" },
  { icon: Headphones, label: "Sell or Swap Your Car", href: "/sell", description: "Get a 24-hour cash offer or upgrade credit" },
  { icon: ShieldCheck, label: "5-Pillar Inspection Standard", href: "/inspections", description: "See how we verify every vehicle and customs paper" },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-[#F6F4EF]">
        {/* Dark Architectural Hero */}
        <section className="bg-[#0C0C0E] text-white pt-10 pb-20 border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-[#D9381E]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[#C89D54] text-xs font-bold tracking-wider uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#D9381E]" />
              Showroom Concierge &amp; Support
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight max-w-3xl leading-[1.08]">
              Speak Directly With Our{" "}
              <span className="t-editorial text-[#D9381E]">
                Lagos Showroom Desk.
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-white/65 max-w-2xl leading-relaxed">
              Whether you want to book a physical showroom inspection, request a live WhatsApp video walkaround, or trade in your current vehicle, our team is ready to assist.
            </p>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_METHODS.map((method) => (
              <a
                key={method.label}
                href={method.action}
                target={method.action.startsWith("http") ? "_blank" : undefined}
                rel={method.action.startsWith("http") ? "noopener noreferrer" : undefined}
                className="rounded-2xl bg-white border border-gray-200/90 p-6 shadow-sm hover:shadow-xl hover:border-[#D9381E]/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#D9381E]/10 text-[#D9381E] rounded-xl flex items-center justify-center group-hover:bg-[#D9381E] group-hover:text-white transition-colors">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-dark-600">
                    {method.badge}
                  </span>
                </div>
                <h2 className="text-sm font-extrabold text-dark-900 mb-1">{method.label}</h2>
                <p className="text-sm font-bold text-[#D9381E] mb-1 truncate">{method.value}</p>
                <p className="text-xs text-dark-500">{method.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Contact Form + Showroom Card */}
        <section id="locations" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Message Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9381E] block mb-1.5">
                  Direct Enquiry
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-sm text-dark-500 mt-1">
                  Fill out the form below and our showroom coordinator will respond promptly.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Right: Showroom HQ + WhatsApp Priority Card */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-3xl bg-[#0C0C0E] text-white p-7 sm:p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#D9381E]/10 rounded-full blur-[90px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9381E]/15 text-[#D9381E] text-xs font-bold uppercase tracking-wider mb-4">
                    Showroom HQ
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-2">
                    {dealership.address.city}, {dealership.address.country}
                  </h3>
                  <p className="text-sm text-white/60 mb-6 leading-relaxed">
                    Inspect vehicles in person at our Lagos facility. Independent mechanics and diagnostic scanners are always welcome.
                  </p>

                  <div className="space-y-3.5 pt-4 border-t border-white/10 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#D9381E] mt-1 shrink-0" />
                      <span className="text-white/80 font-medium">{dealership.address.display}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#D9381E] shrink-0" />
                      <a href={`tel:${dealership.phone.replace(/\D/g, "")}`} className="text-white/80 hover:text-white font-medium">
                        {dealership.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#D9381E] shrink-0" />
                      <span className="text-white/70">{dealership.openingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-[#D9381E] text-white p-7 sm:p-8 shadow-lg">
                <MessageCircle className="w-7 h-7 text-white mb-3" />
                <h3 className="text-lg font-extrabold mb-2">Prefer Instant WhatsApp Chat?</h3>
                <p className="text-sm text-white/85 leading-relaxed mb-6">
                  Request cold-start engine videos, customs duty verification, or negotiate directly with our sales desk on WhatsApp.
                </p>
                <a
                  href={dealershipWhatsApp(
                    `Hello, I'm reaching out from the ${dealership.name} Contact page.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-[#0C0C0E] text-white font-extrabold rounded-xl hover:bg-[#242322] transition-colors text-xs uppercase tracking-wider shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  Start WhatsApp Conversation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-8">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9381E] block mb-1.5">
              Self-Service Desks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark-900 tracking-tight">
              Explore More Ways We Help
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-2xl bg-white border border-gray-200/80 p-6 hover:shadow-md hover:border-[#D9381E]/40 transition-all group flex items-center gap-5"
              >
                <div className="w-12 h-12 bg-[#D9381E]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#D9381E] group-hover:text-white text-[#D9381E] transition-colors">
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-extrabold text-dark-900 group-hover:text-[#D9381E] transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-xs text-dark-500 mt-0.5">{link.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-300 group-hover:text-[#D9381E] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#D9381E] block mb-1.5">
                Buyer FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-dark-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl bg-white border border-gray-200/80 overflow-hidden shadow-xs"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                    <div className="flex items-center gap-3 pr-4">
                      <HelpCircle className="w-5 h-5 text-[#D9381E] shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-dark-900">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-dark-400 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 pl-13">
                    <p className="text-sm text-dark-600 leading-relaxed">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
