import { Metadata } from "next";
import { RequestForm } from "@/app/components/requests/RequestForm";
import { Search, Clock, MessageCircle, Car } from "lucide-react";

export const metadata: Metadata = {
  title: "Request a Car — LegitVenture Autos",
  description:
    "Can't find the car you want? Tell us what you're looking for and we'll find it for you. Free car sourcing service across Nigeria.",
  openGraph: {
    title: "Request a Car — LegitVenture Autos",
    description: "Can't find your dream car? We'll source it for you.",
  },
};

const howItWorks = [
  {
    icon: Search,
    title: "Tell Us What You Want",
    description: "Fill out the form with your preferred brand, model, budget, and other requirements.",
  },
  {
    icon: Clock,
    title: "We Search Our Network",
    description: "Our team searches through our dealer network and private sellers across Nigeria.",
  },
  {
    icon: MessageCircle,
    title: "Get Matches in 24 Hours",
    description: "We'll contact you with matching cars, photos, and pricing within 24 hours.",
  },
  {
    icon: Car,
    title: "Buy with Confidence",
    description: "Inspect the car, negotiate, and drive away. We handle the paperwork.",
  },
];

export default function RequestCarPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="pt-32 pb-16 px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <span className="t-mono text-[0.5rem] text-dark-400 block mb-4">Request a Car</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 leading-[0.95] tracking-tight">
            Can&apos;t Find Your
            <br />
            <span className="text-dark-400">Dream Car?</span>
          </h1>
          <p className="mt-6 text-xs sm:text-sm text-dark-500 leading-relaxed max-w-xl">
            Tell us exactly what you&apos;re looking for — brand, model, budget, year — and our team
            will search our nationwide network of dealers and private sellers to find it for you.
            <span className="text-dark-800 font-semibold"> Completely free.</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-xl bg-white border border-gray-200/80 p-6 sm:p-8">
              <RequestForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* How It Works */}
            <div>
              <h2 className="t-mono text-[0.55rem] text-dark-400 mb-5">
                How It Works
              </h2>
              <div className="space-y-4">
                {howItWorks.map((step) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-4 h-4 text-primary" />
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

            {/* Trust Badge */}
            <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-5">
              <h3 className="text-sm font-semibold text-dark-800 mb-3">
                Why Request Through Us?
              </h3>
              <ul className="space-y-2">
                {[
                  "Access to 500+ dealer partners",
                  "Negotiated wholesale pricing",
                  "Full vehicle inspection report",
                  "Secure payment escrow",
                  "Paperwork handled for you",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-dark-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "2,500+", label: "Cars Listed" },
                { value: "24h", label: "Avg. Response" },
                { value: "98%", label: "Success Rate" },
                { value: "0", label: "Service Fee" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-gray-50 border border-gray-200/80 p-4 text-center"
                >
                  <div className="text-xl font-bold text-dark-900">{stat.value}</div>
                  <div className="t-mono text-[0.45rem] text-dark-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
