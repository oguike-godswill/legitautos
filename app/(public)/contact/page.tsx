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
  Shield,
  Car,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/app/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with LegitAutos. We're here to help with buying, selling, or any questions about our car marketplace.",
  openGraph: {
    title: "Contact Us | LegitAutos",
    description: "Get in touch with LegitAutos.",
    url: "https://legitautomobile.com/contact",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://legitautomobile.com/contact",
  },
};

const CONTACT_METHODS = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+234 817 101 7509",
    description: "Mon - Sat, 8am - 6pm WAT",
    action: "tel:+2348171017509",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    description: "Quick responses, usually within minutes",
    action: "https://wa.me/2348171017509",
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: Mail,
    label: "Email",
    value: "legitventure04@gmail.com",
    description: "We reply within 24 hours",
    action: "mailto:legitventure04@gmail.com",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Lagos, Nigeria",
    description: "By appointment only",
    action: "#locations",
    color: "bg-purple-50 text-purple-500",
  },
];

const QUICK_LINKS = [
  { icon: Car, label: "Browse Cars", href: "/cars", description: "Explore our inventory of verified vehicles" },
  { icon: Send, label: "Request a Car", href: "/request", description: "Can't find what you want? We'll find it" },
  { icon: Headphones, label: "Sell Your Car", href: "/sell", description: "List your car for free today" },
  { icon: Shield, label: "About Us", href: "/about", description: "Learn about our mission and team" },
];

const FAQ = [
  {
    question: "How do I buy a car on LegitAutos?",
    answer: "Browse our inventory, find a car you like, and contact the seller directly through WhatsApp or phone. We verify all cars before listing.",
  },
  {
    question: "Can I sell my car on LegitAutos?",
    answer: "Yes! Listing your car is free. Just visit our Sell page, fill in the details, and your car will be visible to thousands of buyers.",
  },
  {
    question: "Are all cars on LegitAutos verified?",
    answer: "We verify every car listed on our platform to ensure authenticity and quality. Our team inspects vehicles for accuracy of information.",
  },
  {
    question: "What areas do you deliver to?",
    answer: "We offer nationwide delivery across Nigeria. Delivery fees vary based on distance and are discussed upfront with no hidden charges.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
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
      <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-2 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em] block mb-4">Support</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 leading-[0.95] tracking-tight">
              How can we <span className="italic text-dark-400">help?</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-dark-500 leading-relaxed max-w-xl">
              Have a question, need help finding a car, or want to list your vehicle?
              We&apos;re here for you. Reach out through any of the channels below.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20 mt-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_METHODS.map((method) => (
            <a
              key={method.label}
              href={method.action}
              target={method.action.startsWith("http") ? "_blank" : undefined}
              rel={method.action.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400 group"
            >
              <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-dark-900 mb-1">{method.label}</h3>
              <p className="text-sm text-dark-600 mb-1">{method.value}</p>
              <p className="text-[0.65rem] text-dark-400">{method.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">Quick Links</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            How Can We Help?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400 group flex items-center gap-5"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <link.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-dark-900 group-hover:text-primary transition-colors">
                  {link.label}
                </h3>
                <p className="text-xs text-dark-500 mt-0.5">{link.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-dark-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">Get in Touch</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            Send Us a Message
          </h2>
        </div>
        <div className="max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>

      {/* FAQ */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">FAQ</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            Common Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ.map((item, i) => (
            <details key={i} className="group rounded-2xl bg-white border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-dark-900">{item.question}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-dark-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 pl-13">
                <p className="text-sm text-dark-500 leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Find Us + WhatsApp */}
      <div id="locations" className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Find Us */}
          <div className="rounded-2xl bg-[#0a0a0a] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">Locations</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-2 uppercase tracking-[-0.01em] mb-8">
                Find Us
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-white">Lagos</h3>
                <span className="text-[0.5rem] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full uppercase">HQ</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-white/60">Victoria Island, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-white/60">+234 817 101 7509</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs text-white/40">Mon - Sat: 8am - 6pm WAT</span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[#128C7E] to-[#075E54] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center">
              <MessageCircle className="w-8 h-8 text-white/80 mb-4" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-[0.95] tracking-tight uppercase mb-4">
                Prefer to Message Us?
              </h2>
              <p className="text-sm text-white/70 leading-relaxed max-w-md mb-8">
                Send us a message on WhatsApp and we&apos;ll get back to you within minutes.
                Available Mon - Sat, 8am - 6pm WAT.
              </p>
              <div>
                <a
                  href="https://wa.me/2348171017509?text=Hello%2C%20I%27m%20interested%20in%20your%20car%20marketplace."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#075E54] font-bold rounded-xl hover:bg-white/90 transition-colors text-sm shadow-lg shadow-black/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

