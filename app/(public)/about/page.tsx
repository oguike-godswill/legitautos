import { Metadata } from "next";
import Image from "next/image";
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
  Quote,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — LegitAutos Autos",
  description:
    "Learn about LegitAutos Autos — Nigeria's trusted car marketplace connecting buyers and sellers since 2018.",
};

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Every car listed on our platform goes through a verification process. We believe in honest pricing, real photos, and full disclosures — no hidden surprises.",
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
      "We don't list everything — we list what matters. Every car on LegitAutos meets our standards for quality, documentation, and value.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Innovation",
    description:
      "We're constantly improving our platform, tools, and services to make car buying and selling in Nigeria as seamless as possible.",
  },
];

const TIMELINE = [
  {
    year: "2018",
    title: "Founded in Lagos",
    description:
      "Started as a small team of car enthusiasts helping friends find their next ride. What began as word-of-mouth quickly grew into something bigger.",
  },
  {
    year: "2020",
    title: "Going Digital",
    description:
      "Launched our online marketplace to connect buyers and sellers across Nigeria. Introduced vehicle verification and transparent pricing.",
  },
  {
    year: "2022",
    title: "Nationwide Expansion",
    description:
      "Expanded operations to all 36 states. Partnered with over 500 dealers and introduced financing options and nationwide delivery.",
  },
  {
    year: "2024",
    title: "2,500+ Cars",
    description:
      "Surpassed 2,500 verified cars on the platform. Introduced AI-powered search, virtual inspections, and enhanced seller tools.",
  },
  {
    year: "Today",
    title: "Nigeria's Trusted Marketplace",
    description:
      "Serving thousands of buyers and sellers monthly with a 98% satisfaction rate. Continuing to innovate and grow.",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Adebayo Johnson",
    role: "Founder & CEO",
    description: "15+ years in the Nigerian automotive industry. Passionate about making car ownership accessible to every Nigerian.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Chioma Okafor",
    role: "Head of Operations",
    description: "Former logistics director at a leading Nigerian firm. Manages our nationwide network of dealers and delivery partners.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Emeka Nwosu",
    role: "Head of Technology",
    description: "Full-stack engineer building the tools that power Nigeria's car marketplace. Focused on speed, reliability, and user experience.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Fatima Abdullahi",
    role: "Head of Customer Experience",
    description: "Dedicated to making every interaction with LegitAutos exceptional. Leads our 24/7 support and verification teams.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Browse",
    description: "Explore thousands of verified cars from trusted sellers across Nigeria.",
  },
  {
    icon: MessageCircle,
    step: "02",
    title: "Connect",
    description: "Message sellers directly via WhatsApp or phone. Ask questions, request photos.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Verify",
    description: "Request a pre-purchase inspection. We'll help you verify the car's condition and documents.",
  },
  {
    icon: Car,
    step: "04",
    title: "Drive",
    description: "Close the deal on your terms. We handle delivery to any state in Nigeria.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-2 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em] block mb-4">About Us</span>
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-bold text-dark-900 leading-[1.05] tracking-[-0.02em]">
              Every Car, Every
              <br />
              <span className="italic text-dark-400">Dream.</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-dark-500 leading-relaxed max-w-xl">
              We&apos;re on a mission to make car buying and selling in Nigeria transparent,
              accessible, and trustworthy. Since 2018, we&apos;ve connected thousands of
              Nigerians with their dream cars.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pt-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-20">
          <div>
            <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em] block mb-2">Our Story</span>
            <h2 className="text-xl sm:text-4xl font-bold text-dark-900 leading-tight mb-3">
              Born from a simple belief:
              <br />
              <span className="italic text-dark-400">Nigerians deserve better.</span>
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-dark-600 leading-relaxed">
              In 2018, buying a car in Nigeria was a gamble. Hidden defects, inflated prices,
              missing documents — the process was broken. We started LegitAutos Autos with a
              simple idea: what if every car listing was verified, every price was honest, and
              every seller was accountable?
            </p>
            <p className="text-sm text-dark-600 leading-relaxed">
              What began as a small operation in Lagos quickly grew into Nigeria&apos;s most
              trusted car marketplace. Today, we serve buyers and sellers in all 36 states,
              with over 2,500 verified cars and a 98% customer satisfaction rate.
            </p>
            <p className="text-sm text-dark-600 leading-relaxed">
              We&apos;re not just a platform — we&apos;re a bridge between dreams and reality.
              Whether it&apos;s your first car or your fifth, we make the journey seamless,
              transparent, and worth every naira.
            </p>
          </div>
        </div>
      </div>

      {/* CEO Feature */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="rounded-2xl bg-[#0a0a0a] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/5 rounded-full blur-[100px]" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em] block mb-4">Meet Our CEO</span>
              <h2 className="text-xl sm:text-4xl font-bold text-white leading-tight mb-4">
                Adebayo Johnson
              </h2>
              <p className="text-sm text-primary mb-4">Founder & Chief Executive Officer</p>
              <div className="flex items-start gap-3 mb-6">
                <Quote className="w-6 h-6 text-primary/40 shrink-0 mt-1" />
                <p className="text-sm text-white/60 leading-relaxed italic">
                  &ldquo;When we started LegitAutos in 2018, we had one goal: make buying a car in Nigeria stress-free. Every feature we build, every car we verify, every partnership we form — it all comes back to that single mission. We&apos;re not just building a platform; we&apos;re building trust.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-white/40">Experience</p>
                  <p className="text-sm font-bold text-white">15+ Years</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-xs text-white/40">Industry</p>
                  <p className="text-sm font-bold text-white">Automotive</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-xs text-white/40">Vision</p>
                  <p className="text-sm font-bold text-white">Nigeria #1</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center items-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-2xl overflow-hidden relative">
                  <Image
                    src={TEAM_MEMBERS[0].image}
                    alt="Adebayo Johnson - CEO"
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-primary rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-xs font-bold text-white">CEO & Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">The Team</span>
          <h2 className="text-xl sm:text-4xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            People Behind LegitAutos
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-white border border-gray-200 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400"
            >
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-dark-900">{member.name}</h3>
                <p className="text-[0.6rem] text-primary font-medium mt-0.5">{member.role}</p>
                <p className="text-xs text-dark-500 leading-relaxed mt-3">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">What We Stand For</span>
          <h2 className="text-xl sm:text-4xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            Our Values
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <value.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-dark-900 mb-2">{value.title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">Our Journey</span>
          <h2 className="text-xl sm:text-4xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            From Lagos to Nationwide
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-0">
          {TIMELINE.map((item) => (
            <div
              key={item.year}
              className="flex gap-6 sm:gap-10 pb-10 last:pb-0"
            >
              <div className="shrink-0 w-16">
                <span className="text-[0.6rem] font-bold text-primary">{item.year}</span>
              </div>
              <div className="relative pl-6 border-l border-gray-200">
                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-primary -translate-x-[3.5px]" />
                <h3 className="text-sm font-bold text-dark-900 mb-1">{item.title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="text-center mb-10">
          <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]">How It Works</span>
          <h2 className="text-xl sm:text-4xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]">
            Four Steps to Your Next Car
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[0.5rem] font-bold text-primary tracking-[0.2em]">STEP {step.step}</span>
              <h3 className="text-sm font-bold text-dark-900 mt-1 mb-2">{step.title}</h3>
              <p className="text-xs text-dark-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
        <div className="rounded-2xl bg-[#0a0a0a] p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-lg sm:text-3xl font-bold text-white leading-tight mb-4">
              Ready to Find Your Car?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto mb-8">
              Browse thousands of verified cars from trusted sellers across Nigeria.
              Your dream car is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/cars" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-900 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
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

