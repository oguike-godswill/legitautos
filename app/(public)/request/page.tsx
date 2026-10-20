import { Metadata } from "next";
import { RequestForm } from "@/app/components/requests/RequestForm";
import { Search, Clock, MessageCircle, Car } from "lucide-react";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";

export const metadata: Metadata = {
  title: "Request a Car",
  description:
    "Can't find the car you want in our inventory? Tell us what you're looking for and the LegitAutos team will follow up.",
  openGraph: {
    title: "Request a Car | LegitAutos",
    description:
      "Tell us what you're looking for and the LegitAutos team will follow up.",
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
    title: "Tell Us What You Want",
    description:
      "Fill out the form with your preferred brand, model, budget, and other requirements.",
  },
  {
    icon: Clock,
    title: "We Review Your Request",
    description:
      "Our team reviews your request against our current and incoming stock.",
  },
  {
    icon: MessageCircle,
    title: "We Follow Up",
    description:
      "If we have a match or an update, we contact you with details and pricing.",
  },
  {
    icon: Car,
    title: "View and Decide",
    description:
      "Arrange a viewing, inspect the car in person, and decide with no pressure.",
  },
];

export default function RequestCarPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative pt-32 pb-16 px-1.5 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em] block mb-4">Request a Car</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 leading-[0.95] tracking-tight">
              Can&apos;t Find Your
              <br />
              <span className="italic text-dark-400">Dream Car?</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-dark-500 leading-relaxed max-w-xl">
              Tell us exactly what you&apos;re looking for — brand, model, budget,
              year — and the {dealership.name} team will follow up when we have a
              match in our stock or upcoming inventory.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-1.5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
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
                What Happens Next?
              </h3>
              <ul className="space-y-2">
                {[
                  "Our team reviews every request personally.",
                  "You hear from us only when we have something relevant.",
                  "No obligation — a request is not a commitment to buy.",
                  "Prefer to talk? Message us on WhatsApp instead.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-dark-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={dealershipWhatsApp(
                  `Hello, I'm looking for a car and would like to request it from ${dealership.name}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#128C7E] text-white text-sm font-semibold hover:bg-[#0e7a6e] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Request on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

