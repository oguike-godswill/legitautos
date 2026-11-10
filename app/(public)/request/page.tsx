import { Metadata } from "next";
import { RequestForm } from "@/app/components/requests/RequestForm";
import {
  Search,
  Clock,
  MessageCircle,
  Car,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: "Custom Car Sourcing — Request Any Vehicle",
  description:
    "Can't find your exact car specification in our inventory? Tell LegitAutos what you want and our Lagos sourcing team will locate and inspect it for you.",
  openGraph: {
    title: "Request a Car | LegitAutos",
    description:
      "Bespoke vehicle sourcing from the LegitAutos dealership in Lagos, Nigeria.",
    url: `${dealership.siteUrl}/request`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/request`,
  },
};

const howItWorks = [
  {
    icon: Search,
    title: "Share Your Exact Spec",
    description:
      "Select your preferred manufacturer, model, year bracket, condition, and target budget.",
  },
  {
    icon: Clock,
    title: "We Check Incoming & Partner Stock",
    description:
      "Our sourcing team checks our port arrivals and vetted dealership network across Lagos.",
  },
  {
    icon: MessageCircle,
    title: "Receive Verified Options",
    description:
      "We send you real photos, walkaround videos, and landed pricing on WhatsApp.",
  },
  {
    icon: Car,
    title: "Inspect at Our Showroom",
    description:
      "Inspect the vehicle physically at our Lagos lot before making any commitment.",
  },
];

export default function RequestCarPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Dark Architectural Hero */}
      <div className="bg-[#0C0C0E] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9381E]/40 bg-[#D9381E]/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D9381E] mb-4">
              <Compass className="w-3.5 h-3.5" />
              Bespoke Vehicle Sourcing
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-[1.1] tracking-tight">
              Tell Us What You Want.{" "}
              <span className="t-editorial text-[#D9381E]">We&apos;ll Source &amp; Vet It.</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
              Looking for a specific trim, exterior color, or clean Foreign Used import not yet on the showroom floor? Submit your brief below and our Lagos sourcing desk will locate it for you.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto py-12 pb-24">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-dark-900/[0.08] p-6 sm:p-8 shadow-xs">
              <RequestForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white border border-dark-900/[0.08] p-6 sm:p-7 shadow-xs">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#D9381E] mb-5">
                How Custom Sourcing Works
              </h2>
              <div className="space-y-4">
                {howItWorks.map((step) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl bg-[#F6F4EF] border border-dark-100 p-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#D9381E]/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-[#D9381E]" />
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

            <div className="rounded-3xl bg-[#0C0C0E] text-white p-6 sm:p-7 border border-white/10">
              <h3 className="text-base font-extrabold text-white mb-3">
                Zero-Obligation Sourcing Guarantee
              </h3>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Every request is reviewed personally by our acquisition team.",
                  "Every sourced car undergoes our 5-pillar mechanical check.",
                  "Submitting a sourcing brief requires zero upfront deposit.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C89D54] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={dealershipWhatsApp(
                  `Hello ${dealership.name}, I'm looking to source a specific car.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#D9381E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B82B14] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Request Directly on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
