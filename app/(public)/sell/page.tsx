import { Metadata } from "next";
import { Suspense } from "react";
import { SellForm } from "@/app/components/sell/SellForm";
import {
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Repeat,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: "Sell or Trade In Your Car in Lagos",
  description:
    "Sell your car outright or trade it in toward a verified vehicle at the LegitAutos Lagos showroom.",
  openGraph: {
    title: "Sell or Trade In Your Car | LegitAutos",
    description:
      "Get a straightforward valuation or swap your current car at LegitAutos Lagos.",
    url: `${dealership.siteUrl}/sell`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/sell`,
  },
};

const steps = [
  {
    title: "Submit Your Vehicle Profile",
    description:
      "Share your car's make, model, year, usage condition, and price expectation.",
  },
  {
    title: "Showroom Physical Inspection",
    description:
      "Bring the car to our Lagos lot for a transparent 30-minute mechanical and document check.",
  },
  {
    title: "Instant Swap or Outright Offer",
    description:
      "Apply your car's value directly toward a showroom vehicle or receive direct payment upon agreement.",
  },
];

export default function SellPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Dark Architectural Hero */}
      <div className="bg-[#0C0C0E] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9381E]/40 bg-[#D9381E]/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D9381E] mb-4">
              <Repeat className="w-3.5 h-3.5" />
              Acquisition &amp; Trade-In Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-[1.1] tracking-tight">
              Sell Outright or Swap Toward Your{" "}
              <span className="t-editorial text-[#D9381E]">Next Upgrade.</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
              Skip the stress of dealing with random brokers or unverified buyers. Trade in your current car toward any vehicle in our Lagos showroom or sell directly for immediate settlement.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto py-12 pb-24">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-dark-900/[0.08] p-6 sm:p-8 shadow-xs">
              <Suspense
                fallback={
                  <div className="py-12 text-center text-sm text-dark-500">
                    Loading valuation form...
                  </div>
                }
              >
                <SellForm />
              </Suspense>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white border border-dark-900/[0.08] p-6 sm:p-7 shadow-xs">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#D9381E] mb-5">
                How Our Valuation Works
              </h2>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl bg-[#F6F4EF] border border-dark-100 p-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#0C0C0E] text-white flex items-center justify-center shrink-0 text-xs font-extrabold">
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-dark-900">
                        {step.title}
                      </h3>
                      <p className="text-xs text-dark-600 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-dark-900/[0.08] p-6 shadow-xs">
              <h3 className="text-sm font-extrabold text-dark-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D9381E]" />
                What We Require for Purchase / Swap
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Original Customs Duty papers & valid registration documents.",
                  "Accident-free structural frame and verifiable ownership.",
                  "Physical inspection at our Lagos showroom.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-xs sm:text-sm text-dark-600 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-[#0C0C0E] text-white p-6 sm:p-7 border border-white/10">
              <Banknote className="w-7 h-7 text-[#C89D54] mb-3" />
              <h3 className="text-lg font-extrabold text-white">
                Prefer to Send Photos on WhatsApp?
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-white/75 leading-relaxed mb-5">
                Send exterior/interior photos and your car&apos;s details
                directly to our acquisition desk on WhatsApp ({dealership.openingHours}).
              </p>
              <div className="space-y-2.5">
                <a
                  href={dealershipWhatsApp(
                    `Hello ${dealership.name}, I'd like to sell or trade in my car.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D9381E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B82B14] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with Acquisition Desk
                </a>
                <Link
                  href="/request"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                >
                  Looking to buy instead? Custom Car Sourcing
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
