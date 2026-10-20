import { Metadata } from "next";
import { SellForm } from "@/app/components/sell/SellForm";
import { MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: "Sell or Trade In Your Car",
  description:
    "Sell your car or start a trade-in with the LegitAutos dealership. Share your car's details and our team will get back to you.",
  openGraph: {
    title: "Sell or Trade In Your Car | LegitAutos",
    description:
      "Sell your car or start a trade-in with the LegitAutos dealership.",
    url: `${dealership.siteUrl}/sell`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/sell`,
  },
};

const steps = [
  {
    title: "Share your car's details",
    description:
      "Tell us the make, model, year, condition, and your price expectation through the form.",
  },
  {
    title: "We review your enquiry",
    description:
      "Our team looks at the details and replies to you from our inbox and WhatsApp.",
  },
  {
    title: "We discuss the next step",
    description:
      "If it's a fit, we arrange a viewing and agree on a fair price, or value your car against our inventory for a trade-in.",
  },
];

export default function SellPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="pt-32 pb-12 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <span className="t-mono text-[0.5rem] text-dark-400 block mb-4">
            Sell or Trade In
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 leading-[0.95] tracking-tight">
            Sell or Trade In
            <br />
            <span className="text-dark-400">Your Car.</span>
          </h1>
          <p className="mt-5 text-xs sm:text-sm text-dark-500 leading-relaxed max-w-xl">
            Have a car to sell, or want to put it towards a car from our
            inventory? Share the details below and the {dealership.name} team
            will get back to you to discuss your options.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl bg-white border border-gray-200/80 p-6 sm:p-8">
              <SellForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* How it works */}
            <div>
              <h2 className="t-mono text-[0.55rem] text-dark-400 mb-5">
                How It Works
              </h2>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-xl bg-gray-50 border border-gray-200/80 p-4"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-teal">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark-800">
                        {step.title}
                      </h3>
                      <p className="text-sm text-dark-500 mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to expect */}
            <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-5">
              <h3 className="text-sm font-semibold text-dark-800 mb-3">
                What to expect
              </h3>
              <ul className="space-y-2">
                {[
                  "No obligation — an enquiry is just a conversation.",
                  "If we ask for your documents, share ownership and service history.",
                  "Photos of the car can be shared on WhatsApp after we contact you.",
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-dark-500 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp alternative */}
            <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-5">
              <h3 className="text-sm font-semibold text-dark-800 mb-2">
                Prefer to talk?
              </h3>
              <p className="text-sm text-dark-500 mb-4 leading-relaxed">
                Message the team directly on WhatsApp — available{" "}
                {dealership.openingHours}.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={dealershipWhatsApp(
                    `Hello, I'd like to sell or trade in my car with ${dealership.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#128C7E] text-white text-sm font-semibold hover:bg-[#0e7a6e] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <Link
                  href="/request"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-dark-600 hover:text-dark-800 hover:border-gray-300 transition-colors"
                >
                  Looking to buy instead? Request a Car
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
