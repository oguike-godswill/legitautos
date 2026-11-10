"use client";

import { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Play,
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
  SlidersHorizontal,
  Repeat,
  FileCheck2,
  Gauge,
  Compass,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Car as CarIcon,
  Banknote,
  X,
  Clock,
  Award,
  Flame,
  Eye,
  Calendar,
  Settings2,
  Heart,
  TrendingDown,
  Sparkle,
} from "lucide-react";
import { Car, Brand, Inspection } from "@/app/types";
import { CarCard } from "@/app/components/cars/CarCard";
import {
  dealership,
  dealershipWhatsApp,
  dealershipCall,
} from "@/app/config/dealership";
import { useInspections } from "@/app/hooks/useInspections";
import { faqs } from "@/app/config/faq";
import {
  formatPrice,
  formatCompactPrice,
  formatMileage,
  formatConditionLabel,
} from "@/app/utils/format";
import { useRecentlyViewed, useFavorites } from "@/app/stores/favoriteStore";

interface SearchFirstLandingProps {
  initialFeaturedCars: Car[];
  initialLatestCars: Car[];
  initialBrands: Brand[];
  initialTotalCars?: number;
  totalAvailableCount?: number;
}

const ORIGIN_TABS = [
  { id: "", label: "All Origins" },
  { id: "foreign-used", label: "Foreign Used (Tokunbo)" },
  { id: "new", label: "Brand New" },
  { id: "nigerian-used", label: "Nigerian Used" },
] as const;

const BODY_SILHOUETTES = [
  {
    id: "suv",
    code: "01",
    label: "Executive SUVs & 4x4s",
    subtitle: "High ground clearance built for Lagos & Abuja roads",
    tag: "Most Requested",
    href: "/cars?bodyType=suv",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "tokunbo",
    code: "02",
    label: "Foreign Used (Tokunbo)",
    subtitle: "Direct North American & European imports, full duty paid",
    tag: "Clean Title",
    href: "/cars?condition=foreign-used",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sedan",
    code: "03",
    label: "Executive Sedans",
    subtitle: "Refined fuel economy & chauffeur-ready comfort",
    tag: "Daily Luxury",
    href: "/cars?bodyType=sedan",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "new",
    code: "04",
    label: "Brand New & Prestige",
    subtitle: "Delivery-mileage flagship units for discerning collectors",
    tag: "Zero KM",
    href: "/cars?condition=new",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
];

const BUDGET_PRESETS = [
  { label: "Any Budget", maxPrice: "" },
  { label: "Under ₦10M", maxPrice: "10000000" },
  { label: "Under ₦15M", maxPrice: "15000000" },
  { label: "Under ₦25M", maxPrice: "25000000" },
  { label: "Under ₦45M", maxPrice: "45000000" },
  { label: "₦50M+ Flagship", maxPrice: "150000000" },
];

const SHOWROOM_TABS = [
  { id: "all", label: "All Showroom Stock" },
  { id: "featured", label: "Atelier Picks" },
  { id: "foreign-used", label: "Foreign Used" },
  { id: "new", label: "Brand New" },
  { id: "suv", label: "SUVs & 4x4" },
  { id: "under-15m", label: "Under ₦15M" },
] as const;

const AUDIT_PILLARS = [
  {
    num: "01",
    title: "150-Point OBD-II & Powertrain Telemetry",
    desc: "Compression, cold-start idle, transmission shift pressure, and zero hidden ECU trouble codes.",
    score: "9.9 / 10",
  },
  {
    num: "02",
    title: "Original Nigerian Customs Duty Verification",
    desc: "Every imported vehicle is verified against NCS portal records—zero border or road-block surprises.",
    score: "100% Verified",
  },
  {
    num: "03",
    title: "Laser Chassis, Paint & Flood Audit",
    desc: "Micron paint-depth gauge checks and undercarriage structural inspection to rule out salvage or flood damage.",
    score: "Zero Salvage",
  },
  {
    num: "04",
    title: "Suspension, Cooling & Tropical AC Stress Test",
    desc: "Road-tested for Nigerian highway conditions with full AC pressure and radiator thermal checks.",
    score: "Road Ready",
  },
];

export function SearchFirstLanding({
  initialFeaturedCars,
  initialLatestCars,
  initialBrands,
  initialTotalCars,
  totalAvailableCount,
}: SearchFirstLandingProps) {
  const router = useRouter();
  const totalCount = totalAvailableCount ?? initialTotalCars ?? 0;
  const { data: inspectionsData } = useInspections({ limit: 4 });
  const inspections = inspectionsData?.inspections || [];

  // Hero Command Deck Mode: "buy" | "swap" | "source"
  const [heroDeckMode, setHeroDeckMode] = useState<"buy" | "swap" | "source">("buy");

  // Hero Search State
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Hero Interactive Turntable State
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [isTurntablePaused, setIsTurntablePaused] = useState<boolean>(false);

  // Showroom Floor Active Tab
  const [activeShowroomTab, setActiveShowroomTab] =
    useState<(typeof SHOWROOM_TABS)[number]["id"]>("all");

  // Active Video Modal
  const [activeVideo, setActiveVideo] = useState<Inspection | null>(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Recently Viewed Cars & Favorites
  const { items: recentlyViewed } = useRecentlyViewed();
  const { favorites, toggleFavorite } = useFavorites();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Deduplicate all initial cars
  const allInitialCars = useMemo(() => {
    const map = new Map<string, Car>();
    [...initialFeaturedCars, ...initialLatestCars].forEach((c) => {
      if (c && c._id) map.set(c._id, c);
    });
    return Array.from(map.values());
  }, [initialFeaturedCars, initialLatestCars]);

  // Top 4 spotlight cars for the Hero Turntable
  const heroStageCars = useMemo(() => {
    const list = initialFeaturedCars.length > 0 ? initialFeaturedCars : allInitialCars;
    return list.slice(0, 4);
  }, [initialFeaturedCars, allInitialCars]);

  const activeHeroCar =
    heroStageCars[spotlightIndex] || heroStageCars[0] || allInitialCars[0] || null;

  // Auto-advance the Showroom Turntable every 5.5s unless paused by user interaction
  useEffect(() => {
    if (isTurntablePaused || heroStageCars.length <= 1) return;
    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % heroStageCars.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isTurntablePaused, heroStageCars.length]);

  // Filtered cars for the Showroom Floor section
  const showroomCars = useMemo(() => {
    switch (activeShowroomTab) {
      case "featured":
        return allInitialCars.filter((c) => c.featured).slice(0, 8);
      case "foreign-used":
        return allInitialCars
          .filter((c) => c.condition === "foreign-used" || c.condition === "used")
          .slice(0, 8);
      case "new":
        return allInitialCars.filter((c) => c.condition === "new").slice(0, 8);
      case "suv":
        return allInitialCars
          .filter(
            (c) =>
              c.bodyType === "suv" ||
              /suv|rx|gx|lx|gle|glc|g-class|prado|highlander|cr-v|rav4|cayenne/i.test(
                c.title
              )
          )
          .slice(0, 8);
      case "under-15m":
        return allInitialCars.filter((c) => c.price <= 15_000_000).slice(0, 8);
      default:
        return allInitialCars.slice(0, 8);
    }
  }, [allInitialCars, activeShowroomTab]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedOrigin) params.set("condition", selectedOrigin);
    if (selectedBodyType) params.set("bodyType", selectedBodyType);
    if (selectedMaxPrice) params.set("maxPrice", selectedMaxPrice);
    const qs = params.toString();
    router.push(qs ? `/cars?${qs}` : "/cars");
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#0C0C0E]">
      {/* =====================================================================
          1. THE LAGOS AUTOMOTIVE HORIZON (WORLD-CLASS HERO ATELIER)
          Warm Alabaster (#F6F4EF) + Carbon Obsidian (#0C0C0E) + Vermilion (#D9381E) + Champagne Gold (#C89D54)
      ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[#0C0C0E]/12 bg-[#F6F4EF] bg-atelier-grid pt-3 pb-10 sm:pb-12 lg:pt-5 lg:pb-16">
        {/* Ambient Stage Lighting: Gold & Vermilion Atmospheric Auras */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-1/4 h-[550px] w-[550px] rounded-full bg-[#D9381E]/10 blur-[150px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 -right-20 h-[450px] w-[450px] rounded-full bg-[#C89D54]/12 blur-[140px]"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
          {/* Top Marquee: The Lagos Market Pulse Strip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between gap-2 sm:gap-3 rounded-full bg-white/85 backdrop-blur-md border border-[#0C0C0E]/10 px-3 sm:px-4 py-2 text-xs shadow-2xs"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-500" />
              </span>
              <span className="t-mono text-[0.62rem] sm:text-[0.68rem] font-bold text-[#0C0C0E] tracking-wider truncate">
                <span className="sm:hidden">LAGOS SHOWROOM • {totalCount || allInitialCars.length}+ VERIFIED</span>
                <span className="hidden sm:inline">LAGOS SHOWROOM LIVE • {totalCount || allInitialCars.length}+ VERIFIED VEHICLES IN STOCK</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-5 t-mono text-[0.62rem] text-[#52504D] shrink-0">
              <span className="flex items-center gap-1.5 text-[#0C0C0E] font-semibold">
                <Flame className="w-3.5 h-3.5 text-[#D9381E]" />
                Daily Drops • Tokunbo &amp; Brand New
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Customs Duty Verified
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D9381E]" />
                Lagos, Nigeria
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <Link
                href="/cars"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#EFECE6] hover:bg-[#0C0C0E] hover:text-white px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-[0.68rem] font-bold text-[#0C0C0E] transition-all"
              >
                <Heart className="w-3 h-3 text-[#D9381E] fill-current" />
                <span>
                  {mounted && favorites.length > 0
                    ? `Garage (${favorites.length})`
                    : "Garage"}
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Editorial Headline & Value Guarantees */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 pt-1">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 t-mono text-[0.62rem] sm:text-xs text-[#D9381E] mb-1.5 sm:mb-2 font-bold tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9381E]" />
                LAGOS AUTOMOTIVE ATELIER // ZERO-GUESSWORK EXCHANGE
              </div>
              <h1 className="text-[1.85rem] xs:text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3rem] font-extrabold leading-[1.12] sm:leading-[1.08] tracking-tight text-[#0C0C0E]">
                Drive What’s{" "}
                <span className="t-editorial font-normal text-[#D9381E] relative inline-block pr-1">
                  Verified.
                  <span className="absolute -bottom-1 left-0 right-1 h-[2.5px] sm:h-[3px] bg-gradient-to-r from-[#D9381E] via-[#C89D54] to-transparent rounded-full" />
                </span>{" "}
                Zero Guesswork.
              </h1>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#52504D] leading-relaxed font-normal">
                Curated <strong className="font-semibold text-[#0C0C0E]">Foreign Used (Tokunbo)</strong>,{" "}
                <strong className="font-semibold text-[#0C0C0E]">Brand New</strong>, and{" "}
                <strong className="font-semibold text-[#0C0C0E]">Nigerian Used</strong> vehicles at our Lagos showroom. Backed by a 150-point mechanical audit, verified customs duty papers, and real walkaround video.
              </p>
            </motion.div>

            {/* 4 Trust Guarantee Badges (Responsive 2-col on mobile, flex wrap on tablet/desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 text-[0.7rem] sm:text-xs w-full lg:w-auto"
            >
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 rounded-full bg-white border border-[#0C0C0E]/10 px-2.5 sm:px-3 py-1.5 font-semibold text-[#0C0C0E] shadow-2xs truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D9381E] shrink-0" />
                <span className="truncate">150-Pt OBD-II Audit</span>
              </span>
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 rounded-full bg-white border border-[#0C0C0E]/10 px-2.5 sm:px-3 py-1.5 font-semibold text-[#0C0C0E] shadow-2xs truncate">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">100% Customs Duty</span>
              </span>
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 rounded-full bg-white border border-[#0C0C0E]/10 px-2.5 sm:px-3 py-1.5 font-semibold text-[#0C0C0E] shadow-2xs truncate">
                <Repeat className="w-3.5 h-3.5 text-[#C89D54] shrink-0" />
                <span className="truncate">24h Cash Buyout</span>
              </span>
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 rounded-full bg-white border border-[#0C0C0E]/10 px-2.5 sm:px-3 py-1.5 font-semibold text-[#0C0C0E] shadow-2xs truncate">
                <MapPin className="w-3.5 h-3.5 text-[#D9381E] shrink-0" />
                <span className="truncate">Lagos Test-Drive Bay</span>
              </span>
            </motion.div>
          </div>

          {/* ===================================================================
              CENTERPIECE: THE CINEMATIC SHOWROOM HORIZON (THE SHOWPIECE STAGE)
          =================================================================== */}
          {activeHeroCar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setIsTurntablePaused(true)}
              onMouseLeave={() => setIsTurntablePaused(false)}
              className="relative rounded-[1.5rem] sm:rounded-[2rem] bg-[#0C0C0E] border border-white/12 text-white shadow-[0_36px_80px_-24px_rgba(12,12,14,0.5)] ring-1 ring-white/10 overflow-hidden p-3.5 sm:p-6 lg:p-7"
            >
              {/* Internal Ambient Radial Shimmers */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#C89D54]/15 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#D9381E]/15 blur-3xl"
              />

              {/* Stage Top Controls & Turntable Steer Bar */}
              <div className="relative z-10 flex items-center justify-between gap-2 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="t-mono text-[0.58rem] sm:text-[0.62rem] font-bold text-white/90 tracking-wider truncate">
                    SHOWROOM TURNTABLE // 0{spotlightIndex + 1} OF 0{heroStageCars.length}
                  </span>
                  <span className="hidden sm:inline-block text-white/30">•</span>
                  <span className="hidden sm:inline-block t-mono text-[0.6rem] text-white/50 truncate">
                    {isTurntablePaused ? "PAUSED" : "AUTO-ROTATING • HOVER TO FREEZE"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Heart / Favorite Direct Action */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(activeHeroCar._id)}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      mounted && favorites.includes(activeHeroCar._id)
                        ? "bg-[#D9381E] text-white shadow-xs"
                        : "bg-white/10 text-white/70 hover:text-white hover:bg-white/15"
                    }`}
                    aria-label="Save this car to garage"
                  >
                    <Heart
                      className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${
                        mounted && favorites.includes(activeHeroCar._id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    <span className="text-[0.6rem] sm:text-[0.65rem]">
                      {mounted && favorites.includes(activeHeroCar._id)
                        ? "Saved"
                        : "Save"}
                    </span>
                  </button>

                  {/* Turntable Arrow Steer */}
                  {heroStageCars.length > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setSpotlightIndex(
                            (prev) => (prev - 1 + heroStageCars.length) % heroStageCars.length
                          )
                        }
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/8 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                        aria-label="Previous turntable car"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSpotlightIndex((prev) => (prev + 1) % heroStageCars.length)
                        }
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/8 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                        aria-label="Next turntable car"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stage Body: Vehicle Photo Frame + Telemetry Deck */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroCar._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center"
                >
                  {/* Left 7 Columns: Hero Photo Showcase */}
                  <div className="lg:col-span-7">
                    <Link
                      href={`/cars/${activeHeroCar.slug || activeHeroCar._id}`}
                      className="group block relative aspect-[16/10] max-h-[260px] sm:max-h-[350px] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#18181B] border border-white/10 shadow-2xl"
                    >
                      <Image
                        src={activeHeroCar.images?.[0] || "/images/placeholder-car.jpg"}
                        alt={activeHeroCar.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/20 to-transparent" />

                      {/* Top Floating Badges */}
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2 max-w-[calc(100%-1rem)]">
                        <span className="t-mono rounded-full bg-[#D9381E] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.55rem] sm:text-[0.62rem] font-bold uppercase tracking-wider text-white shadow-md">
                          {formatConditionLabel(activeHeroCar.condition)}
                        </span>
                        <span className="t-mono rounded-full bg-[#0C0C0E]/85 backdrop-blur-md border border-[#C89D54]/50 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.55rem] sm:text-[0.62rem] font-bold text-[#C89D54]">
                          100% DUTY PAID
                        </span>
                        <span className="hidden xs:inline-flex t-mono rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[0.55rem] sm:text-[0.6rem] font-bold text-emerald-400">
                          9.8/10 OBD-II CLEAR
                        </span>
                      </div>

                      {/* Bottom Image Stamp */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 flex items-end justify-between gap-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="t-mono text-[0.5rem] sm:text-[0.6rem] text-[#C89D54] tracking-wider uppercase font-bold truncate">
                            LAGOS SHOWROOM BAY • VERIFIED
                          </p>
                          <h2 className="font-display text-sm sm:text-xl font-extrabold text-white truncate mt-0.5">
                            {activeHeroCar.title}
                          </h2>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="t-mono text-[0.45rem] sm:text-[0.52rem] text-white/50 block">DUTY INCLUDED</span>
                          <span className="font-display text-base sm:text-2xl font-black text-white">
                            {formatCompactPrice(activeHeroCar.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Right 5 Columns: Vehicle Telemetry Matrix & Direct Concierge */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 sm:space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="t-mono text-[0.65rem] sm:text-xs font-bold text-[#C89D54]">
                          {activeHeroCar.brand} // {activeHeroCar.year} SPEC
                        </span>
                        <span className="t-mono text-[0.55rem] sm:text-[0.62rem] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                          OBD-II PASSED
                        </span>
                      </div>
                      <h3 className="font-display text-lg sm:text-2xl font-black text-white mt-1 line-clamp-1">
                        {activeHeroCar.title}
                      </h3>
                      <p className="text-xs text-white/65 mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
                        Full Nigerian Customs duty cleared at Lagos port. Zero structural accident history. Available for private physical inspection today.
                      </p>
                    </div>

                    {/* 4-Card Telemetry Matrix */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                      <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5 sm:p-3">
                        <span className="block t-mono text-[0.48rem] sm:text-[0.52rem] text-white/45">VERIFIED MILEAGE</span>
                        <span className="font-display text-xs sm:text-sm font-extrabold text-white mt-0.5 block truncate">
                          {formatMileage(activeHeroCar.mileage)}
                        </span>
                      </div>
                      <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5 sm:p-3">
                        <span className="block t-mono text-[0.48rem] sm:text-[0.52rem] text-white/45">TRANSMISSION</span>
                        <span className="font-display text-xs sm:text-sm font-extrabold text-white mt-0.5 block capitalize truncate">
                          {activeHeroCar.transmission}
                        </span>
                      </div>
                      <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5 sm:p-3">
                        <span className="block t-mono text-[0.48rem] sm:text-[0.52rem] text-white/45">DRIVETRAIN</span>
                        <span className="font-display text-xs sm:text-sm font-extrabold text-white mt-0.5 block capitalize truncate">
                          {activeHeroCar.fuelType || "Petrol"} • {activeHeroCar.bodyType || "Automatic"}
                        </span>
                      </div>
                      <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5 sm:p-3">
                        <span className="block t-mono text-[0.48rem] sm:text-[0.52rem] text-white/45">ASKING PRICE</span>
                        <span className="font-display text-xs sm:text-sm font-black text-white mt-0.5 block truncate">
                          {formatPrice(activeHeroCar.price)}
                        </span>
                      </div>
                    </div>

                    {/* Direct Actions */}
                    <div className="space-y-2 pt-0.5">
                      <Link
                        href={`/cars/${activeHeroCar.slug || activeHeroCar._id}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#0C0C0E] hover:bg-[#EFECE6] py-3 sm:py-3.5 px-4 text-xs font-extrabold uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md"
                      >
                        <Eye className="w-4 h-4 text-[#D9381E] shrink-0" />
                        <span className="truncate">
                          <span className="sm:hidden">Inspect Vehicle &amp; Video</span>
                          <span className="hidden sm:inline">Inspect Vehicle &amp; Walkaround Video</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 ml-auto shrink-0" />
                      </Link>
                      <a
                        href={dealershipWhatsApp(
                          `Hello LegitAutos, I'm interested in the ${activeHeroCar.year} ${activeHeroCar.title} (${formatPrice(activeHeroCar.price)}) featured on the homepage.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-white py-2.5 sm:py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">
                          <span className="sm:hidden">WhatsApp Showroom Desk</span>
                          <span className="hidden sm:inline">WhatsApp Showroom Desk (Direct Inquiry)</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Interactive 4-Slot Carousel Filmstrip (The Switching Tray) */}
              {heroStageCars.length > 1 && (
                <div className="relative z-10 mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3 text-xs">
                    <span className="t-mono text-[0.55rem] sm:text-[0.62rem] text-white/55 font-bold uppercase tracking-wider truncate">
                      SPOTLIGHT DROPS ({heroStageCars.length} LIVE STAGES)
                    </span>
                    <span className="t-mono text-[0.52rem] sm:text-[0.6rem] text-[#C89D54] shrink-0">
                      Tap to switch
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {heroStageCars.map((c, idx) => {
                      const isActive = spotlightIndex === idx;
                      return (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => setSpotlightIndex(idx)}
                          className={`relative text-left rounded-xl p-2 sm:p-2.5 transition-all cursor-pointer border ${
                            isActive
                              ? "bg-white/[0.08] border-[#D9381E] shadow-lg shadow-[#D9381E]/15"
                              : "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15"
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="relative h-9 w-12 sm:h-11 sm:w-14 rounded-lg overflow-hidden shrink-0 bg-[#18181B]">
                              <Image
                                src={c.images?.[0] || "/images/placeholder-car.jpg"}
                                alt={c.title}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="t-mono text-[0.5rem] sm:text-[0.55rem] font-bold text-[#C89D54] block truncate">
                                0{idx + 1} // {c.brand}
                              </span>
                              <p className="text-[0.7rem] sm:text-xs font-bold text-white truncate">
                                {c.title}
                              </p>
                              <p className="t-mono text-[0.6rem] sm:text-[0.65rem] font-extrabold text-white/85 truncate">
                                {formatCompactPrice(c.price)}
                              </p>
                            </div>
                          </div>

                          {/* Active Progress Line */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTurntableBar"
                              className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#D9381E] rounded-full"
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===================================================================
              SMART DISCOVERY COCKPIT COMMAND DECK (BUY / SWAP / BESPOKE SOURCING)
          =================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-[#0C0C0E] p-3.5 sm:p-6 text-white shadow-[0_30px_70px_-20px_rgba(12,12,14,0.4)] border border-white/10 relative overflow-hidden"
          >
            {/* Top Mode Switcher with Fluid Spring Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-white/10">
              <div className="flex items-center gap-1 rounded-full bg-white/[0.06] p-1 border border-white/8 overflow-x-auto scrollbar-hide max-w-full">
                {[
                  { id: "buy" as const, labelShort: "Search", labelMed: "Search Inventory", labelFull: "Search Showroom", icon: CarIcon },
                  { id: "swap" as const, labelShort: "Trade-In", labelMed: "Sell / Swap", labelFull: "Sell / Swap Car", icon: Repeat },
                  { id: "source" as const, labelShort: "Sourcing", labelMed: "Custom Source", labelFull: "Custom Sourcing", icon: Compass },
                ].map((mode) => {
                  const active = heroDeckMode === mode.id;
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setHeroDeckMode(mode.id)}
                      className={`relative px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        active ? "text-white" : "text-white/60 hover:text-white"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="heroCockpitPill"
                          className="absolute inset-0 rounded-full bg-[#D9381E] shadow-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="xs:hidden">{mode.labelShort}</span>
                        <span className="hidden xs:inline sm:hidden">{mode.labelMed}</span>
                        <span className="hidden sm:inline">{mode.labelFull}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Count Indicator */}
              <div className="inline-flex items-center gap-1.5 t-mono text-[0.58rem] sm:text-[0.62rem] text-[#C89D54] shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C89D54] animate-ping" />
                <span>{totalCount || allInitialCars.length} VERIFIED VEHICLES</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* MODE 1: SEARCH SHOWROOM INVENTORY */}
              {heroDeckMode === "buy" && (
                <motion.form
                  key="deck-buy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleHeroSearch}
                  className="space-y-3.5 sm:space-y-4"
                >
                  {/* Quick Brand Pills for 1-Tap Discovery */}
                  {initialBrands.length > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
                      <span className="t-mono text-[0.55rem] sm:text-[0.58rem] text-white/40 shrink-0 uppercase">POPULAR:</span>
                      {initialBrands.slice(0, 8).map((b) => {
                        const isSelected = selectedBrand === b.name;
                        return (
                          <button
                            key={b._id}
                            type="button"
                            onClick={() => setSelectedBrand(isSelected ? "" : b.name)}
                            className={`shrink-0 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-white text-[#0C0C0E] shadow-sm"
                                : "bg-white/[0.06] text-white/70 hover:bg-white/12 hover:text-white border border-white/10"
                            }`}
                          >
                            <span>{b.name}</span>
                            {typeof b.carCount === "number" && b.carCount > 0 && (
                              <span className={`t-mono text-[0.52rem] sm:text-[0.55rem] px-1.5 py-0.5 rounded-full ${
                                isSelected ? "bg-[#0C0C0E] text-white" : "bg-white/10 text-white/60"
                              }`}>
                                {b.carCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 4 Cockpit Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 sm:gap-2.5">
                    {/* Make Selector */}
                    <div className="lg:col-span-3 rounded-2xl bg-white/[0.06] border border-white/10 px-3.5 py-2 sm:py-2.5 focus-within:border-[#D9381E] transition-colors relative">
                      <label
                        htmlFor="hero-brand-cockpit"
                        className="flex items-center gap-1.5 t-mono text-[0.55rem] text-white/50"
                      >
                        <CarIcon className="w-3 h-3 text-[#C89D54]" />
                        <span>Make / Brand</span>
                      </label>
                      <select
                        id="hero-brand-cockpit"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="mt-0.5 w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none pr-5 truncate"
                      >
                        <option value="" className="bg-[#0C0C0E] text-white">
                          All Makes ({totalCount || allInitialCars.length})
                        </option>
                        {initialBrands.map((b) => (
                          <option key={b._id} value={b.name} className="bg-[#0C0C0E] text-white">
                            {b.name} {b.carCount ? `(${b.carCount})` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 bottom-2.5 sm:bottom-3 w-3.5 h-3.5 text-white/40" />
                    </div>

                    {/* Condition Selector */}
                    <div className="lg:col-span-3 rounded-2xl bg-white/[0.06] border border-white/10 px-3.5 py-2 sm:py-2.5 focus-within:border-[#D9381E] transition-colors relative">
                      <label
                        htmlFor="hero-origin-cockpit"
                        className="flex items-center gap-1.5 t-mono text-[0.55rem] text-white/50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C89D54]" />
                        <span>Condition / Origin</span>
                      </label>
                      <select
                        id="hero-origin-cockpit"
                        value={selectedOrigin}
                        onChange={(e) => setSelectedOrigin(e.target.value)}
                        className="mt-0.5 w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none pr-5 truncate"
                      >
                        <option value="" className="bg-[#0C0C0E] text-white">
                          All Conditions
                        </option>
                        <option value="foreign-used" className="bg-[#0C0C0E] text-white">
                          Foreign Used (Tokunbo)
                        </option>
                        <option value="new" className="bg-[#0C0C0E] text-white">
                          Brand New
                        </option>
                        <option value="used" className="bg-[#0C0C0E] text-white">
                          Nigerian Used (Verified)
                        </option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 bottom-2.5 sm:bottom-3 w-3.5 h-3.5 text-white/40" />
                    </div>

                    {/* Budget Ceiling */}
                    <div className="lg:col-span-3 rounded-2xl bg-white/[0.06] border border-white/10 px-3.5 py-2 sm:py-2.5 focus-within:border-[#D9381E] transition-colors relative">
                      <label
                        htmlFor="hero-budget-cockpit"
                        className="flex items-center gap-1.5 t-mono text-[0.55rem] text-white/50"
                      >
                        <Banknote className="w-3.5 h-3.5 text-[#C89D54]" />
                        <span>Budget Ceiling</span>
                      </label>
                      <select
                        id="hero-budget-cockpit"
                        value={selectedMaxPrice}
                        onChange={(e) => setSelectedMaxPrice(e.target.value)}
                        className="mt-0.5 w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none pr-5 truncate"
                      >
                        {BUDGET_PRESETS.map((b) => (
                          <option key={b.label} value={b.maxPrice} className="bg-[#0C0C0E] text-white">
                            {b.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 bottom-2.5 sm:bottom-3 w-3.5 h-3.5 text-white/40" />
                    </div>

                    {/* Submit CTA */}
                    <div className="sm:col-span-2 lg:col-span-3 flex">
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-gradient-to-r from-[#D9381E] to-[#B82B14] hover:brightness-110 active:scale-[0.98] text-white font-display font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D9381E]/30 cursor-pointer"
                      >
                        <Search className="w-4 h-4 shrink-0" />
                        <span>Explore Showroom</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Keyword Input & Hot Tags */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-white/10">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search model, year, trim (e.g. RX 350, GLE 450)..."
                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-8 pr-3 py-2 sm:py-2.5 text-xs text-white placeholder:text-white/40 placeholder:text-[0.72rem] sm:placeholder:text-xs focus:outline-none focus:border-[#D9381E]"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-[0.65rem] sm:text-[0.68rem]">
                      <span className="t-mono text-[0.55rem] sm:text-[0.58rem] text-white/40 shrink-0">HOT IN LAGOS:</span>
                      {[
                        { label: "RX 350", href: "/cars?search=RX" },
                        { label: "GLE 450", href: "/cars?search=GLE" },
                        { label: "Camry 2022", href: "/cars?search=Camry" },
                        { label: "Land Cruiser", href: "/cars?search=Land+Cruiser" },
                        { label: "Prado TX-L", href: "/cars?search=Prado" },
                      ].map((tag) => (
                        <Link
                          key={tag.label}
                          href={tag.href}
                          className="shrink-0 rounded-full bg-white/[0.06] hover:bg-white/15 px-2.5 sm:px-3 py-1 font-semibold text-white/80 transition-colors"
                        >
                          {tag.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}

              {/* MODE 2: SELL OR SWAP YOUR CAR */}
              {heroDeckMode === "swap" && (
                <motion.div
                  key="deck-swap"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="py-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
                    <div>
                      <span className="t-mono text-[0.58rem] sm:text-[0.62rem] text-[#C89D54] block mb-1">
                        24-HOUR VALUATION &amp; INSTANT BANK SETTLEMENT
                      </span>
                      <h2 className="font-display text-base sm:text-xl font-extrabold text-white">
                        Swap your current vehicle or sell for outright cash in Lagos.
                      </h2>
                      <p className="text-xs text-white/65 mt-1 max-w-xl leading-relaxed">
                        Avoid risky classifieds. Submit vehicle details online, visit our Lagos inspection bay, and receive direct bank transfer or instant trade-in credit toward any car in inventory.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto">
                      <Link
                        href="/sell"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D9381E] hover:bg-[#B82B14] px-5 sm:px-6 py-3 sm:py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-md active:scale-95"
                      >
                        <Repeat className="w-4 h-4 shrink-0" />
                        <span>Start Valuation</span>
                        <ArrowUpRight className="w-4 h-4 shrink-0" />
                      </Link>
                      <a
                        href={dealershipWhatsApp("Hello LegitAutos, I'd like to get an instant trade-in valuation for my vehicle.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/12 px-4 sm:px-5 py-3 sm:py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>WhatsApp Valuation</span>
                      </a>
                    </div>
                  </div>

                  {/* 3 Steps Mini-Bar */}
                  <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <span className="t-mono text-[0.55rem] sm:text-[0.6rem] font-bold text-[#D9381E] bg-[#D9381E]/10 px-2 py-0.5 rounded-full border border-[#D9381E]/30 shrink-0">01</span>
                      <span className="text-[0.72rem] sm:text-xs">Submit vehicle specs &amp; photos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="t-mono text-[0.55rem] sm:text-[0.6rem] font-bold text-[#D9381E] bg-[#D9381E]/10 px-2 py-0.5 rounded-full border border-[#D9381E]/30 shrink-0">02</span>
                      <span className="text-[0.72rem] sm:text-xs">Physical audit at Lagos showroom bay</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="t-mono text-[0.55rem] sm:text-[0.6rem] font-bold text-[#D9381E] bg-[#D9381E]/10 px-2 py-0.5 rounded-full border border-[#D9381E]/30 shrink-0">03</span>
                      <span className="text-[0.72rem] sm:text-xs">Immediate bank payout or upgrade credit</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MODE 3: CUSTOM IMPORT SOURCING */}
              {heroDeckMode === "source" && (
                <motion.div
                  key="deck-source"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="py-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
                    <div>
                      <span className="t-mono text-[0.58rem] sm:text-[0.62rem] text-[#C89D54] block mb-1">
                        BESPOKE NORTH AMERICA &amp; EUROPE AUCTION NETWORK
                      </span>
                      <h2 className="font-display text-base sm:text-xl font-extrabold text-white">
                        Looking for an exact trim, interior leather, or rare year?
                      </h2>
                      <p className="text-xs text-white/65 mt-1 max-w-xl leading-relaxed">
                        Access Copart, Manheim, and franchised US/Canada dealer inventories. We inspect prior to bidding, handle international shipping, clear Nigerian customs duty, and deliver to your doorstep.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 shrink-0 w-full sm:w-auto">
                      <Link
                        href="/request"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D9381E] hover:bg-[#B82B14] px-5 sm:px-6 py-3 sm:py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-md active:scale-95"
                      >
                        <Compass className="w-4 h-4 shrink-0" />
                        <span>Submit Sourcing Brief</span>
                        <ArrowUpRight className="w-4 h-4 shrink-0" />
                      </Link>
                      <a
                        href={dealershipWhatsApp("Hello LegitAutos, I would like to commission a custom vehicle sourcing order.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/12 px-4 sm:px-5 py-3 sm:py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Sourcing Desk WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Guarantee Highlights */}
                  <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs text-white/70">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[0.72rem] sm:text-xs">Pre-bid OBD-II inspection report</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[0.72rem] sm:text-xs">Full Nigeria customs paper trail</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[0.72rem] sm:text-xs">Regular photo/video port updates</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          2. CARBON & VERMILION TELEMETRY RIBBON
      ===================================================================== */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="bg-[#0C0C0E] text-white border-b border-white/10 py-5 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              code: "01",
              title: "150-Point OBD-II Certified",
              sub: "Engine, gearbox & chassis verified",
            },
            {
              code: "02",
              title: "100% Customs Duty Paid",
              sub: "Original NCS clearance papers",
            },
            {
              code: "03",
              title: "Live Video Walkarounds",
              sub: "Cold-start & interior inspection reels",
            },
            {
              code: "04",
              title: "Instant Trade-In Equity",
              sub: "Swap your old keys in 24 hours",
            },
          ].map((item) => (
            <motion.div
              key={item.code}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex items-start gap-3"
            >
              <span className="t-mono text-xs font-bold text-[#D9381E] bg-[#D9381E]/15 border border-[#D9381E]/30 px-2 py-0.5 rounded">
                {item.code}
              </span>
              <div>
                <p className="font-display text-xs sm:text-sm font-extrabold text-white">
                  {item.title}
                </p>
                <p className="text-[11px] text-white/55 mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* =====================================================================
          3. CURATED SHOWROOM FLOOR (INTERACTIVE MAGAZINE GRID)
      ===================================================================== */}
      <section className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 t-mono text-xs text-[#D9381E] mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9381E]" />
              SECTION 01 // LIVE LAGOS INVENTORY
            </div>
            <h2 className="t-display text-[#0C0C0E]">
              The Showroom{" "}
              <span className="t-editorial font-normal text-[#D9381E]">
                Floor.
              </span>
            </h2>
          </div>

          {/* Interactive Category Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {SHOWROOM_TABS.map((tab) => {
              const active = activeShowroomTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveShowroomTab(tab.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#0C0C0E] text-white shadow-sm"
                      : "bg-[#EFECE6] text-[#2B2B30] hover:bg-[#DFDBD2]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Recently Viewed Bar (if user has viewed cars) */}
        {mounted && recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 rounded-2xl bg-[#EFECE6] border border-[#0C0C0E]/10 p-3.5 flex items-center gap-3 overflow-x-auto scrollbar-hide"
          >
            <span className="t-mono text-[0.62rem] font-bold text-[#0C0C0E] flex items-center gap-1.5 shrink-0 pl-1">
              <Clock className="w-3.5 h-3.5 text-[#D9381E]" />
              RECENTLY VIEWED:
            </span>
            {recentlyViewed.slice(0, 4).map((item) => (
              <Link
                key={item._id}
                href={`/cars/${item.slug || item._id}`}
                className="flex items-center gap-2.5 rounded-xl bg-white hover:border-[#D9381E] border border-[#0C0C0E]/10 px-3 py-1.5 shrink-0 transition-colors"
              >
                {item.image && (
                  <div className="relative w-8 h-6 rounded overflow-hidden bg-[#EFECE6] shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <span className="text-xs font-bold text-[#0C0C0E] truncate max-w-[140px]">
                  {item.title}
                </span>
                <span className="t-mono text-[0.65rem] font-bold text-[#D9381E]">
                  {formatCompactPrice(item.price)}
                </span>
              </Link>
            ))}
          </motion.div>
        )}

        {/* Vehicle Cards Grid */}
        {showroomCars.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {showroomCars.map((car, idx) => (
              <CarCard
                key={car._id}
                car={car}
                index={idx}
                priority={idx < 4}
              />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#0C0C0E]/10 p-12 text-center">
            <p className="font-display text-lg font-bold text-[#0C0C0E]">
              No vehicles currently match this filter tab.
            </p>
            <button
              type="button"
              onClick={() => setActiveShowroomTab("all")}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0C0C0E] text-white text-xs font-bold cursor-pointer"
            >
              Show All Inventory
            </button>
          </div>
        )}

        {/* Bottom Showroom Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[#EFECE6] border border-[#0C0C0E]/10 p-5">
          <p className="text-xs sm:text-sm font-semibold text-[#2B2B30]">
            Showing <strong className="text-[#0C0C0E]">{showroomCars.length}</strong> curated vehicles from our Lagos showroom floor.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 rounded-full bg-[#0C0C0E] hover:bg-[#D9381E] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            View Complete Inventory ({totalCount || allInitialCars.length})
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* =====================================================================
          4. ARCHITECTURAL COLLECTION SILOS & MANUFACTURER INDEX
      ===================================================================== */}
      <section className="py-16 sm:py-24 bg-[#EFECE6] border-y border-[#0C0C0E]/10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 t-mono text-xs text-[#D9381E] mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9381E]" />
                SECTION 02 // CURATED SILHOUETTES &amp; ORIGINS
              </div>
              <h2 className="t-display text-[#0C0C0E]">
                Shop by{" "}
                <span className="t-editorial font-normal text-[#D9381E]">
                  Architecture.
                </span>
              </h2>
            </div>
            <p className="text-sm text-[#52504D] max-w-md">
              Every buyer has a distinct mission—from high-clearance SUVs built for Nigerian highways to clean-title North American Tokunbo imports.
            </p>
          </motion.div>

          {/* 4-Card Architectural Grid with Staggered Scroll Entrance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BODY_SILHOUETTES.map((silo, idx) => (
              <motion.div
                key={silo.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="h-[340px]"
              >
                <Link
                  href={silo.href}
                  className="group relative h-full w-full rounded-[1.5rem] overflow-hidden border border-[#0C0C0E]/15 bg-[#0C0C0E] flex flex-col justify-between p-6 shadow-xs transition-shadow duration-300 hover:shadow-[0_20px_40px_-15px_rgba(12,12,14,0.3)] block"
                >
                  <Image
                    src={silo.image}
                    alt={silo.label}
                    fill
                    className="object-cover opacity-70 group-hover:scale-108 group-hover:opacity-85 transition-all duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/40 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="t-mono text-xs font-bold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
                      {silo.code}
                    </span>
                    <span className="t-mono text-[0.6rem] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#D9381E] text-white">
                      {silo.tag}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-display text-xl font-black text-white group-hover:text-[#C89D54] transition-colors">
                      {silo.label}
                    </h3>
                    <p className="text-xs text-white/75 mt-1.5 leading-relaxed">
                      {silo.subtitle}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 t-mono text-[0.65rem] font-bold text-white group-hover:text-[#D9381E] transition-colors">
                      <span>Explore Collection</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Live Manufacturer Index Bar */}
          {initialBrands.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 pt-8 border-t border-[#0C0C0E]/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="t-mono text-xs font-bold text-[#0C0C0E]">
                  BROWSE BY MANUFACTURER
                </span>
                <Link
                  href="/cars"
                  className="t-mono text-xs font-bold text-[#D9381E] hover:underline"
                >
                  All Makes →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {initialBrands.slice(0, 14).map((brand) => (
                  <Link
                    key={brand._id}
                    href={`/cars?brand=${encodeURIComponent(brand.name)}`}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-[#0C0C0E] border border-[#0C0C0E]/10 px-4 py-2.5 transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="text-xs font-bold text-[#0C0C0E] group-hover:text-white">
                      {brand.name}
                    </span>
                    {typeof brand.carCount === "number" && brand.carCount > 0 && (
                      <span className="t-mono text-[0.6rem] rounded-full bg-[#EFECE6] group-hover:bg-[#D9381E] text-[#52504D] group-hover:text-white px-2 py-0.5 transition-colors">
                        {brand.carCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* =====================================================================
          5. THE 150-POINT MECHANICAL & CUSTOMS AUDIT + WALKAROUND CINEMA
      ===================================================================== */}
      <section className="py-20 sm:py-28 bg-[#0C0C0E] bg-carbon-grid text-white relative overflow-hidden">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none absolute top-1/3 left-1/4 h-[450px] w-[450px] rounded-full bg-[#D9381E]/10 blur-[150px]"
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left 5 Columns: The Audit Manifesto */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-2 t-mono text-xs text-[#D9381E] mb-3">
                <ShieldCheck className="w-4 h-4" />
                SECTION 03 // ZERO-GUESSWORK PROTOCOL
              </div>
              <h2 className="t-display text-white">
                Every Vehicle{" "}
                <span className="t-editorial font-normal text-[#C89D54]">
                  Audited
                </span>{" "}
                Before It Hits Our Floor.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/65 leading-relaxed">
                We reject over 60% of vehicles we evaluate. Every car listed on LegitAutos undergoes our 4-stage mechanical, structural, and Nigerian Customs verification protocol—and you are always welcome to bring your independent mechanic.
              </p>

              <div className="mt-8 rounded-2xl bg-white/[0.04] border border-white/10 p-5 flex items-center justify-between">
                <div>
                  <span className="t-mono text-[0.6rem] text-[#C89D54] block">
                    AVERAGE FLEET CONDITION SCORE
                  </span>
                  <span className="font-display text-3xl font-black text-white mt-0.5 block">
                    9.8 <span className="text-base font-normal text-white/50">/ 10.0</span>
                  </span>
                </div>
                <Link
                  href="/inspections"
                  className="inline-flex items-center gap-2 rounded-full bg-[#D9381E] hover:bg-[#B82B14] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors"
                >
                  Full Audit Protocol
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right 7 Columns: 4 Audit Pillars */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {AUDIT_PILLARS.map((pillar, idx) => (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 hover:border-[#D9381E]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="t-mono text-xs font-bold text-[#D9381E]">
                        PILLAR {pillar.num}
                      </span>
                      <span className="t-mono text-[0.62rem] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        {pillar.score}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-extrabold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Walkaround Video Cinema Strip */}
          {inspections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16 pt-12 border-t border-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="t-mono text-xs text-[#C89D54] block mb-1">
                    RAW SHOWROOM FOOTAGE • UNEDITED AUDIO
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                    Watch Real Walkaround Inspections
                  </h3>
                </div>
                <Link
                  href="/inspections"
                  className="inline-flex items-center gap-1.5 t-mono text-xs font-bold text-[#D9381E] hover:underline"
                >
                  <span>View All Video Reels</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {inspections.slice(0, 4).map((vid, idx) => (
                  <motion.button
                    key={vid._id}
                    type="button"
                    onClick={() => setActiveVideo(vid)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative aspect-[9/12] rounded-2xl overflow-hidden bg-[#18181B] border border-white/10 text-left cursor-pointer"
                  >
                    {vid.type === "video" ? (
                      <video
                        src={vid.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                      />
                    ) : (
                      <Image
                        src={vid.url}
                        alt={vid.title}
                        fill
                        className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="t-mono rounded-full bg-[#0C0C0E]/80 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[0.58rem] font-bold text-white">
                        {vid.carTitle || "Showroom Audit"}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-[#D9381E] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5">
                      <p className="font-display text-sm font-extrabold text-white line-clamp-1">
                        {vid.title}
                      </p>
                      {vid.description && (
                        <p className="text-xs text-white/65 line-clamp-1 mt-0.5">
                          {vid.description}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* =====================================================================
          6. DUAL CONCIERGE EXCHANGE (SWAP YOUR CAR vs. CUSTOM SOURCING)
      ===================================================================== */}
      <section className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 t-mono text-xs text-[#D9381E] mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D9381E]" />
            SECTION 04 // BESPOKE DEALERSHIP DESKS
          </div>
          <h2 className="t-display text-[#0C0C0E]">
            Trade In or{" "}
            <span className="t-editorial font-normal text-[#D9381E]">
              Commission
            </span>{" "}
            a Build.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Card 1: Sell or Swap */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="rounded-[2rem] bg-white border border-[#0C0C0E]/12 p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:border-[#D9381E]/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="t-mono text-xs font-bold text-[#D9381E] bg-[#D9381E]/10 px-3 py-1 rounded-full">
                  DESK 01 // TRADE-IN &amp; OUTRIGHT SALE
                </span>
                <Repeat className="w-6 h-6 text-[#D9381E]" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-[#0C0C0E] tracking-tight">
                Swap Your Current Car or Sell for Instant Cash.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#52504D] leading-relaxed">
                Avoid the security risks and endless haggling of private classifieds. Bring your clean Nigerian-used or foreign-used vehicle to our Lagos showroom for a transparent 24-hour buyout or instant upgrade credit toward any car in stock.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs sm:text-sm font-semibold text-[#2B2B30]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9381E] shrink-0" />
                  Apply 100% of your car&apos;s equity toward a newer vehicle
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D9381E] shrink-0" />
                  Direct bank settlement upon physical verification
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#0C0C0E]/10 flex flex-wrap items-center gap-3">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0C0E] hover:bg-[#D9381E] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Start Trade-In / Sale Valuation
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Custom Car Sourcing */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="rounded-[2rem] bg-[#0C0C0E] text-white p-8 sm:p-10 flex flex-col justify-between border border-[#0C0C0E] hover:border-[#C89D54]/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="t-mono text-xs font-bold text-[#C89D54] bg-white/10 px-3 py-1 rounded-full">
                  DESK 02 // BESPOKE ACQUISITION
                </span>
                <Compass className="w-6 h-6 text-[#C89D54]" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
                Don’t See Your Exact Trim? We’ll Source It for You.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed">
                Looking for a specific exterior color, interior leather package, or low-mileage spec? Submit a 60-second sourcing brief and our acquisition team will locate, inspect, and clear the exact vehicle through our port &amp; dealer network.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs sm:text-sm font-semibold text-white/85">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C89D54] shrink-0" />
                  Matched options sent to your WhatsApp within 24–48 hours
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C89D54] shrink-0" />
                  Backed by the same 150-point mechanical &amp; customs guarantee
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
              <Link
                href="/request"
                className="inline-flex items-center gap-2 rounded-full bg-[#D9381E] hover:bg-[#B82B14] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Submit a Sourcing Brief
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          7. LAGOS SHOWROOM CONCIERGE & BUYER FAQ
      ===================================================================== */}
      <section className="pb-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 Columns: Lagos Showroom Pass */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-[2rem] bg-[#EFECE6] border border-[#0C0C0E]/12 p-8"
          >
            <span className="t-mono text-xs font-bold text-[#D9381E] block mb-2">
              LAGOS SHOWROOM HQ
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-black text-[#0C0C0E] tracking-tight">
              Inspect in Person or Book a Live Video Call.
            </h3>
            <p className="mt-2.5 text-sm text-[#52504D] leading-relaxed">
              Visit our showroom in Lagos for a physical inspection and test drive, or schedule a live WhatsApp video walkaround from anywhere in Nigeria.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-white p-5 border border-[#0C0C0E]/8 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D9381E] mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-[#0C0C0E]">{dealership.address.display}</p>
                  <p className="text-xs text-[#6E6C68]">Private inspection bay available</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#0C0C0E]/6">
                <Clock className="w-4 h-4 text-[#D9381E] shrink-0" />
                <span className="text-xs font-semibold text-[#2B2B30]">
                  {dealership.openingHours}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#0C0C0E]/6">
                <Phone className="w-4 h-4 text-[#D9381E] shrink-0" />
                <a
                  href={dealershipCall()}
                  className="t-mono text-xs font-bold text-[#0C0C0E] hover:text-[#D9381E]"
                >
                  {dealership.phone}
                </a>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={dealershipWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0C0C0E] hover:bg-[#D9381E] text-white py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                WhatsApp Desk
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#DFDBD2] border border-[#0C0C0E]/15 text-[#0C0C0E] py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>

          {/* Right 7 Columns: Interactive FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="mb-6">
              <span className="t-mono text-xs font-bold text-[#D9381E] block mb-1.5">
                TRANSPARENCY &amp; BUYER GUIDE
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-[#0C0C0E] tracking-tight">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#0C0C0E]/10 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                    >
                      <span className="font-display text-sm sm:text-base font-extrabold text-[#0C0C0E]">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#D9381E] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-sm text-[#52504D] leading-relaxed border-t border-[#0C0C0E]/6 pt-3">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          WALKAROUND VIDEO MODAL LIGHTBOX
      ===================================================================== */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0C0C0E]/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl overflow-hidden bg-[#0C0C0E] border border-white/15 shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div>
                  <span className="t-mono text-[0.58rem] text-[#C89D54] block">
                    {activeVideo.carTitle || "Showroom Inspection"}
                  </span>
                  <h4 className="font-display text-sm font-bold text-white">
                    {activeVideo.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  aria-label="Close video"
                  className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-[9/14] bg-black relative">
                {activeVideo.type === "video" ? (
                  <video
                    src={activeVideo.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={activeVideo.url}
                    alt={activeVideo.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <div className="p-4 flex items-center justify-between gap-3 bg-[#141417]">
                <p className="text-xs text-white/75 line-clamp-2">
                  {activeVideo.description || activeVideo.title}
                </p>
                <a
                  href={dealershipWhatsApp(
                    `Hello LegitAutos, I just watched the "${activeVideo.title}" inspection clip and would like more details.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#D9381E] px-4 py-2 text-xs font-bold text-white"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Enquire
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
