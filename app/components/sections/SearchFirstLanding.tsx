"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Shield,
  Truck,
  CheckCircle,
  Star,
  MapPin,
  MessageCircle,
  TrendingDown,
  Calendar,
  Gauge,
  Fuel,
  Users,
  Car,
  Phone,
  ChevronRight,
  ShieldCheck,
  BadgeCheck,
  Handshake,
  Headphones,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  RotateCw,
  LayoutGrid,
  ChevronDown,
  Zap,
  Clock,
  Send,
} from "lucide-react";
import { useCars, useFeaturedCars, useBrands } from "@/app/hooks/useCars";
import { formatPrice, formatMileage } from "@/app/utils/format";

const VEHICLE_CATEGORIES = [
  { name: "SUVs", slug: "suv", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop", count: 124 },
  { name: "Sedans", slug: "sedan", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop", count: 89 },
  { name: "Coupes", slug: "coupe", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop", count: 45 },
  { name: "Trucks", slug: "truck", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=300&fit=crop", count: 37 },
  { name: "Luxury", slug: "luxury", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop", count: 62 },
];

const WHY_CHOOSE_US = [
  { icon: Shield, title: "Verified Listings", desc: "Every car is inspected and verified before listing. No scams, no surprises — just honest deals." },
  { icon: CircleDollarSign, title: "Transparent Pricing", desc: "See the full price upfront with no hidden fees. What you see is what you pay." },
  { icon: RotateCw, title: "Fast & Easy Process", desc: "Browse, connect, and drive. We make buying a car as quick and seamless as possible." },
  { icon: LayoutGrid, title: "Wide Selection", desc: "From sedans to SUVs, we have thousands of verified cars to match every budget and lifestyle." },
];

const TESTIMONIALS = [
  { name: "James R.", role: "Toyota Camry Buyer", rating: 5, text: "The team was professional, transparent, and made the car buying experience smooth and enjoyable.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Sarah M.", role: "Honda CR-V Buyer", rating: 5, text: "I found my dream car at the best price! Highly recommend to anyone looking for quality vehicles.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Michael T.", role: "Lexus RX Buyer", rating: 5, text: "Excellent service from start to finish. They truly care about their customers and it shows.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Amina B.", role: "Mercedes C-Class Buyer", rating: 5, text: "From the first call to the handover, everything was seamless. Best dealership experience I've ever had.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "David K.", role: "BMW X5 Buyer", rating: 5, text: "Transparent pricing, no hidden charges. The car was exactly as described. Will buy again.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="text-2xl sm:text-5xl font-bold text-white">
      {count}{suffix}
    </span>
  );
}

export function SearchFirstLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const { data: featuredData } = useFeaturedCars();
  const featuredCars = featuredData?.cars || [];
  const { data: latestData } = useCars({ limit: 4, sortBy: "newest" });
  const latestCars = latestData?.cars || [];
  const { data: brandsData } = useBrands();
  const brands = brandsData?.brands || [];

  return (
    <>
      {/* ═══════════════════════════════════════════ HERO ═══════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex flex-col overflow-hidden bg-[#0a0a0a] pb-8">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/herovid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent w-[55%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
        </div>

        {/* Content */}
        <div className="relative flex-1 flex flex-col justify-end px-2 sm:px-8 lg:px-12 pb-0">
          <div className="flex-1 flex flex-col justify-end max-w-[1400px] mx-auto w-full">
          <div className="max-w-2xl pt-32">
            {/* Location tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-2 mb-5"
            >
              <MapPin className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/40 font-medium tracking-wide">Lagos, Nigeria</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-[1.05] tracking-[-0.02em] mb-5"
            >
              Find Your<br />Dream Car Today
            </motion.h1>

          </div>

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full mt-8"
          >
            <div className={`bg-white rounded-2xl p-5 sm:p-6 transition-all duration-500 ${isFocused ? 'shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4),0_0_0_2px_rgba(234,88,12,0.3)]' : 'shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)]'}`}>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search field */}
                <div className="flex-1 min-w-0">
                  <label className="text-[0.6rem] font-bold text-dark-400 uppercase tracking-wider block mb-2">Search</label>
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-dark-300 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Toyota, Honda, Lexus..."
                      className="flex-1 bg-transparent text-dark-900 placeholder:text-dark-400 focus:outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200 my-1" />

                {/* Location */}
                <div className="lg:w-44 shrink-0">
                  <label className="text-[0.6rem] font-bold text-dark-400 uppercase tracking-wider block mb-2">Location</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-dark-300 shrink-0" />
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 bg-transparent text-dark-900 focus:outline-none text-sm font-medium cursor-pointer"
                    >
                      <option value="">All Locations</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                      <option value="Ibadan">Ibadan</option>
                      <option value="Kano">Kano</option>
                    </select>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-gray-200 my-1" />

                {/* Budget */}
                <div className="lg:w-40 shrink-0">
                  <label className="text-[0.6rem] font-bold text-dark-400 uppercase tracking-wider block mb-2">Budget</label>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-dark-300 shrink-0" />
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="flex-1 bg-transparent text-dark-900 focus:outline-none text-sm font-medium cursor-pointer"
                    >
                      <option value="">Any Price</option>
                      <option value="0-2000000">Under ₦2M</option>
                      <option value="2000000-5000000">₦2M - ₦5M</option>
                      <option value="5000000-10000000">₦5M - ₦10M</option>
                      <option value="10000000-20000000">₦10M - ₦20M</option>
                      <option value="20000000-999999999">₦20M+</option>
                    </select>
                  </div>
                </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Link
                  href={(() => {
                    const params = new URLSearchParams();
                    if (searchQuery) params.set("search", searchQuery);
                    if (location) params.set("location", location);
                    if (budget) {
                      const [min, max] = budget.split("-");
                      params.set("minPrice", min);
                      params.set("maxPrice", max);
                    }
                    return `/cars${params.toString() ? `?${params.toString()}` : ""}`;
                  })()}
                  className="w-full lg:w-auto px-8 py-3.5 bg-[#0a0a0a] text-white text-sm font-bold rounded-xl hover:bg-dark-800 transition-all duration-300 flex items-center justify-center gap-2 shrink-0"

                >
                  Search cars
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick filters row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <span className="text-[0.6rem] text-dark-400 font-medium uppercase tracking-wider">Popular:</span>
              {["Toyota", "Honda", "Under ₦5M", "SUV", "2020+"].map((term) => (
                <Link
                  key={term}
                  href={`/cars?search=${encodeURIComponent(term)}`}
                  className="text-xs text-dark-500 hover:text-primary font-medium transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
        </div>
        </div>
      </section>

      <div className="px-1.5">
      {/* ═══════════════════════════════════════════ SHOP BY CATEGORY ═══════════════════════════════════════════ */}
      <section className="py-16 px-2 sm:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]"
              >
                Browse
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
               
              >
                By Category
              </motion.h2>
            </div>
            <Link href="/cars" className="flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-primary transition-colors group">
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {VEHICLE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={`/cars?bodyType=${cat.slug}`}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-dark-900 text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-[0.65rem] text-dark-400 mt-0.5 font-medium">{cat.count}+ cars</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ FEATURED VEHICLES ═══════════════════════════════════════════ */}
      {featuredCars.length > 0 && (
        <section className="py-16 px-2 sm:px-8 lg:px-12 border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]"
                >
                  Handpicked
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
                >
                  Featured Cars
                </motion.h2>
              </div>
              <Link href="/cars?featured=true" className="flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-primary transition-colors group">
                View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCars.slice(0, 8).map((car, i) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/cars/${car._id}`}
                    className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <Image
                        src={car.images[0] || "/images/placeholder-car.jpg"}
                        alt={car.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-primary text-white text-[0.5rem] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          Featured
                        </span>
                        {car.condition === "new" && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-[0.5rem] font-bold rounded-md uppercase tracking-wider">New</span>
                        )}
                        {car.condition === "certified" && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-[0.5rem] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Certified
                          </span>
                        )}
                      </div>
                      {car.originalPrice && car.originalPrice > car.price && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-rose-500 text-white text-[0.5rem] font-bold rounded-md flex items-center gap-1">
                          <TrendingDown className="w-2.5 h-2.5" />
                          -{Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}%
                        </span>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-dark-900 group-hover:text-primary truncate transition-colors">{car.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-[0.6rem] text-dark-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{car.year}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-dark-300" />
                        <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{formatMileage(car.mileage)}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-dark-300" />
                        <span className="flex items-center gap-1 capitalize"><Fuel className="w-3 h-3" />{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[0.6rem] text-dark-400">
                        <MapPin className="w-3 h-3" />
                        {car.location}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-base font-bold text-dark-900">{formatPrice(car.price)}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════ HOW IT WORKS ═══════════════════════════════════════════ */}
      <section className="py-16 px-2 sm:px-8 lg:px-12 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]"
            >
              Process
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
            >
              How It Works
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {[
              { step: "01", title: "Search", desc: "Browse thousands of verified cars", icon: Search },
              { step: "02", title: "Connect", desc: "Chat with sellers on WhatsApp", icon: MessageCircle },
              { step: "03", title: "Inspect", desc: "Verify the car in person", icon: ShieldCheck },
              { step: "04", title: "Drive", desc: "Take your new car home", icon: Car },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center mb-3 relative z-10 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/15 group-hover:scale-110 transition-all duration-400">
                  <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[0.5rem] font-bold text-primary tracking-[0.2em] mb-1">STEP {item.step}</span>
                <h3 className="font-semibold text-dark-900 text-base">{item.title}</h3>
                <p className="text-xs text-dark-500 mt-0.5 max-w-[150px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ WHY CHOOSE US ═══════════════════════════════════════════ */}
      <section className="py-16 px-2 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/40 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/40 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-primary/40 to-transparent rounded-full blur-[120px]" />
        </div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-base sm:text-3xl font-bold text-dark-900"
            >
              why choose <span className="font-light">us?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base text-dark-500 mt-5 max-w-lg mx-auto leading-relaxed"
            >
              From verified listings to transparent pricing, we make car buying in Nigeria seamless and trustworthy.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="space-y-12">
              {WHY_CHOOSE_US.slice(0, 2).map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="text-center lg:text-right"
                >
                  <div className="w-12 h-12 mx-auto lg:ml-auto lg:mr-0 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-dark-500 leading-relaxed max-w-[280px] mx-auto lg:ml-auto lg:mr-0">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative mx-auto"
            >
              <div className="relative w-full max-w-[300px] h-[360px] mx-auto rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=700&fit=crop"
                  alt="Luxury car"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full bg-primary/10 rounded-2xl -z-10" />
            </motion.div>
            <div className="space-y-12">
              {WHY_CHOOSE_US.slice(2, 4).map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="text-center lg:text-left"
                >
                  <div className="w-12 h-12 mx-auto lg:mr-auto lg:ml-0 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-dark-500 leading-relaxed max-w-[280px] mx-auto lg:mr-auto lg:ml-0">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ STATS ═══════════════════════════════════════════ */}
      <section className="py-16 px-2 sm:px-8 lg:px-12 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: "+", label: "Cars Sold" },
              { value: 1200, suffix: "+", label: "Happy Buyers" },
              { value: 50, suffix: "+", label: "Car Brands" },
              { value: 15, suffix: "+", label: "Years Experience" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
                <p className="text-xs text-white/40 mt-2 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ SHOP BY BRAND ═══════════════════════════════════════════ */}
      {brands.length > 0 && (
        <section className="py-16 px-2 sm:px-8 lg:px-12 bg-[#f5f5f5]">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]"
                >
                  Manufacturers
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
                >
                  Shop by Brand
                </motion.h2>
              </div>
              <Link href="/brands" className="flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-primary transition-colors group">
                All Brands <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {brands.slice(0, 12).map((brand, i) => (
                <motion.div
                  key={brand._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                >
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-gray-200/80 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/80 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-300 overflow-hidden">
                      {brand.logo ? (
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-dark-300 group-hover:text-primary transition-colors">
                          {brand.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xs font-semibold text-dark-800 group-hover:text-primary transition-colors truncate w-full">{brand.name}</h3>
                      <p className="text-[0.55rem] text-dark-400 mt-0.5">{brand.carCount}+ cars</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════ LATEST ARRIVALS ═══════════════════════════════════════════ */}
      {latestCars.length > 0 && (
        <section className="py-16 px-2 sm:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]"
                >
                  Fresh Stock
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
                >
                  Latest Arrivals
                </motion.h2>
              </div>
              <Link href="/cars?sortBy=newest" className="flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-primary transition-colors group">
                View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestCars.map((car, i) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/cars/${car._id}`}
                    className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-400"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <Image
                        src={car.images[0] || "/images/placeholder-car.jpg"}
                        alt={car.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-[#0a0a0a] text-white text-[0.5rem] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          New
                        </span>
                        {car.condition === "new" && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-[0.5rem] font-bold rounded-md uppercase tracking-wider">Brand New</span>
                        )}
                        {car.condition === "certified" && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-[0.5rem] font-bold rounded-md uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Certified
                          </span>
                        )}
                      </div>
                      {car.originalPrice && car.originalPrice > car.price && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-rose-500 text-white text-[0.5rem] font-bold rounded-md flex items-center gap-1">
                          <TrendingDown className="w-2.5 h-2.5" />
                          -{Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-dark-900 group-hover:text-primary truncate transition-colors">{car.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-[0.6rem] text-dark-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{car.year}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-dark-300" />
                        <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{formatMileage(car.mileage)}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-dark-300" />
                        <span className="flex items-center gap-1 capitalize"><Fuel className="w-3 h-3" />{car.fuelType}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-base font-bold text-dark-900">{formatPrice(car.price)}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════ TESTIMONIALS ═══════════════════════════════════════════ */}
      <section className="py-16 px-2 sm:px-8 lg:px-12 bg-[#f5f5f5]">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em]"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-3xl font-bold text-dark-900 mt-2 uppercase tracking-[-0.01em]"
            >
              What Clients Say
            </motion.h2>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Featured dark card - tall */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#0a0a0a] rounded-2xl p-7 flex flex-col justify-between row-span-2 min-h-[420px]"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img src={TESTIMONIALS[0].avatar} alt={TESTIMONIALS[0].name} className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">4.9</span>
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-xs text-white/40">Rating</span>
                  </div>
                </div>
                <p className="text-white text-lg leading-relaxed font-medium">
                  &ldquo;{TESTIMONIALS[0].text}&rdquo;
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm font-semibold text-white">{TESTIMONIALS[0].name}</p>
                <p className="text-xs text-white/40 mt-0.5">{TESTIMONIALS[0].role}</p>
              </div>
            </motion.div>

            {/* Light cards */}
            {TESTIMONIALS.slice(1, 3).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl p-7 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-dark-900">4.9</span>
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="text-xs text-dark-400">Rating</span>
                    </div>
                  </div>
                  <p className="text-dark-700 text-sm leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-dark-900">{t.name}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}

            {/* Bottom row - 2 cards */}
            {TESTIMONIALS.slice(3, 5).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 + i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl p-7 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-dark-900">4.9</span>
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="text-xs text-dark-400">Rating</span>
                    </div>
                  </div>
                  <p className="text-dark-700 text-sm leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-dark-900">{t.name}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ SELL + WHATSAPP ═══════════════════════════════════════════ */}
      <section className="py-16 px-2 sm:px-8 lg:px-12 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-5">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 sm:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/25 transition-colors duration-700" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-3xl font-bold text-white mb-3 uppercase">Sell Your Car</h3>
              <p className="text-white/35 mb-8 max-w-sm leading-relaxed text-sm">List on Nigeria&apos;s largest marketplace. Reach thousands of buyers instantly.</p>
              <Link href="/sell" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark-900 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                List Your Car <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#128C7E]/8 to-[#25D366]/5 border border-[#128C7E]/15 rounded-2xl p-6 sm:p-10 group">
            <div className="w-12 h-12 bg-[#128C7E]/15 rounded-xl flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-base sm:text-3xl font-bold text-dark-900 mb-3 uppercase">Need Help?</h3>
            <p className="text-dark-500 mb-8 max-w-sm leading-relaxed text-sm">Chat with our team on WhatsApp. We&apos;ll help you find the perfect car.</p>
            <a
              href="https://wa.me/2348171017509?text=Hello%2C%20I%27m%20looking%20for%20a%20car"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#128C7E] text-white text-sm font-bold rounded-lg hover:bg-[#0e7a6e] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
