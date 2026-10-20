import { Metadata } from "next";
import {
  Shield,
  Heart,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Car,
  Search,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { dealership } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${dealership.name} — a car dealership offering quality used and new vehicles.`,
  openGraph: {
    title: "About Us | LegitAutos",
    description: `Learn about ${dealership.name} — a car dealership.`,
    url: `${dealership.siteUrl}/about`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/about`,
  },
};

const VALUES = [
  {
    icon: Shield,
    title: "Honest Descriptions",
    description:
      "Every car page shows real photos of the actual vehicle, a clear description, and its live availability — so what you see is what you're coming to view.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "We exist to serve you. From the moment you browse to the day you drive away, every decision we make is driven by what's best for you.",
  },
  {
    icon: Target,
    title: "Quality Over Quantity",
    description:
      "We don't list everything — we list what we can stand behind. If a car is on our site, it's a car we're ready to talk you through in detail.",
  },
  {
    icon: TrendingUp,
    title: "Straightforward Deals",
    description:
      "Clear pricing, direct answers, and no pressure. You deal with one team from first message to handover.",
  },
];

/* Real team members. Photos intentionally omitted — add real photos when available. */
const TEAM_MEMBERS = [
  {
    name: "Abiodun Emmanuel",
    role: "CEO & MD",
    description:
      "Leads the vision and strategy behind LegitAutos.",
  },
  {
    name: "Uwaje Wisdom",
    role: "Chief Operating Officer",
    description:
      "Oversees daily operations and strategy execution.",
  },
  {
    name: "Bello Halimat Omopelumi",
    role: "Secretary / Social Media Manager",
    description:
      "Manages communications and social media presence.",
  },
  {
    name: "Bolanle Precious",
    role: "Human Resources Manager",
    description:
      "Oversees talent acquisition and team development.",
  },
  {
    name: "Anthony Somto Blessing",
    role: "Logistics Manager",
    description:
      "Coordinates vehicle logistics and delivery operations.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Browse",
    description: "Explore our current inventory of quality used and new cars.",
  },
  {
    icon: MessageCircle,
    step: "02",
    title: "Connect",
    description: "Message our sales team via WhatsApp or phone. Ask questions, request more photos.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Inspect",
    description: "View the car in person, inspect its condition, and verify its documents.",
  },
  {
    icon: Car,
    step: "04",
    title: "Drive",
    description: "Agree on a price on your terms and complete the purchase.",
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-2 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em] block mb-4">
              About Us
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 leading-[0.95] tracking-tight">
              One Dealership.
              <br />
              <span className="italic text-dark-400">Straight Answers.</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-dark-500 leading-relaxed max-w-xl">
              {dealership.name} is a car dealership based in{" "}
              {dealership.address.display}. We sell quality used and new vehicles
              and believe buying a car should be clear, honest, and free of
              runaround.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pt-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-20">
          <div>
            <span className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em] block mb-2">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 leading-[0.95] tracking-tight mb-3">
              Built on a simple belief:
              <br />
              <span className="italic text-dark-400">buyers deserve clarity.</span>
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-dark-600 leading-relaxed">
              Buying a car in Nigeria too often means guesswork — vague
              descriptions, photos that don&apos;t match the car, and status
              you can&apos;t trust. {dealership.name} was built to do the
              opposite: every vehicle we list has real photos, a clear
              description, a visible price, and a live status of available,
              reserved, or sold.
            </p>
            <p className="text-sm text-dark-600 leading-relaxed">
              When you contact us, you&apos;re talking to our own sales team —
              not a third-party seller. We answer questions, arrange viewings,
              and help you compare cars before you decide. If we don&apos;t have
              what you&apos;re looking for, you can{" "}
              <Link href="/request" className="text-teal font-semibold hover:underline">
                send us a request
              </Link>{" "}
              and we&apos;ll follow up when we can help.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em]">The Team</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            People Behind {dealership.name}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400"
            >
              <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mb-4">
                <span className="text-base font-bold text-teal">{initials(member.name)}</span>
              </div>
              <h3 className="text-sm font-bold text-dark-900">{member.name}</h3>
              <p className="text-[0.6rem] text-teal font-medium mt-0.5">{member.role}</p>
              <p className="text-xs text-dark-500 leading-relaxed mt-3">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em]">What We Stand For</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            Our Values
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-4">
                <value.icon className="w-5 h-5 text-teal" />
              </div>
              <h3 className="text-sm font-bold text-dark-900 mb-2">{value.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-teal uppercase tracking-[0.2em]">How It Works</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            Four Steps to Your Next Car
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-teal" />
              </div>
              <span className="text-[0.5rem] font-bold text-teal tracking-[0.2em]">STEP {step.step}</span>
              <h3 className="text-sm font-bold text-dark-900 mt-1 mb-2">{step.title}</h3>
              <p className="text-xs text-dark-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="rounded-2xl bg-ink p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-[0.95] tracking-tight mb-4">
              Ready to Find Your Car?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto mb-8">
              Browse our current inventory, or tell us what you&apos;re looking
              for and we&apos;ll follow up.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/cars" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-ink font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                Browse Cars
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/request" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-sm">
                Request a Car
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
