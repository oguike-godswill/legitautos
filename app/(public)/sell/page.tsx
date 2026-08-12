import { Metadata } from "next";
import { SellForm } from "@/app/components/sell/SellForm";
import { Camera, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sell Your Car — LegitAutos Autos",
  description:
    "List your car on Nigeria's trusted marketplace. Reach thousands of verified buyers. Free listing, no hidden fees.",
};

const benefits = [
  {
    icon: Camera,
    title: "Free Listing",
    description: "List your car at zero cost. No hidden fees, no commissions.",
  },
  {
    icon: Shield,
    title: "Verified Buyers",
    description: "Your listing reaches serious, verified buyers across Nigeria.",
  },
  {
    icon: Clock,
    title: "Quick Sale",
    description: "Most cars sell within 7 days of listing on our platform.",
  },
  {
    icon: CheckCircle,
    title: "We Handle Paperwork",
    description: "Our team assists with documentation and transfer of ownership.",
  },
];

export default function SellPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="pt-32 pb-12 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <span className="t-mono text-[0.5rem] text-dark-400 block mb-4">Sell Your Car</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 leading-[0.95] tracking-tight">
            Sell Your Car
            <br />
            <span className="text-dark-400">The Smart Way.</span>
          </h1>
          <p className="mt-5 text-xs sm:text-sm text-dark-500 leading-relaxed max-w-xl">
            List your car on Nigeria&apos;s most trusted marketplace. Reach thousands of
            verified buyers. Free listing, no hidden fees.
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
            {/* Benefits */}
            <div>
              <h2 className="t-mono text-[0.55rem] text-dark-400 mb-5">Why Sell With Us</h2>
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4 rounded-xl bg-gray-50 border border-gray-200/80 p-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-dark-800">{benefit.title}</h3>
                      <p className="text-sm text-dark-500 mt-0.5 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "2,500+", label: "Cars Sold" },
                { value: "7 days", label: "Avg. Time" },
                { value: "0", label: "Listing Fee" },
                { value: "36", label: "States" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-gray-50 border border-gray-200/80 p-4 text-center">
                  <div className="text-xl font-bold text-dark-900">{stat.value}</div>
                  <div className="t-mono text-[0.45rem] text-dark-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Alternative */}
            <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-5">
              <h3 className="text-sm font-semibold text-dark-800 mb-2">Not Ready to Sell?</h3>
              <p className="text-sm text-dark-500 mb-4 leading-relaxed">
                Get a free valuation or request a car sourcing instead.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/request" className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-dark-600 hover:text-dark-800 hover:border-gray-300 transition-colors">
                  Request a Car
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

