"use client";

import { useState, useSyncExternalStore } from "react";
import { useSimilarCars } from "@/app/hooks/useCars";
import { useInspections } from "@/app/hooks/useInspections";
import { ImageGallery } from "@/app/components/cars/ImageGallery";
import { CarInspection } from "@/app/components/cars/CarInspection";
import { StickyContact } from "@/app/components/layout/StickyContact";
import { CarCard } from "@/app/components/cars/CarCard";
import {
  formatPrice,
  formatMileage,
  formatConditionLabel,
} from "@/app/utils/format";
import { Badge } from "@/app/components/ui/Badge";
import { useFavorites } from "@/app/stores/favoriteStore";
import { useCompare } from "@/app/stores/compareStore";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Palette,
  Phone,
  MessageCircle,
  Check,
  Share2,
  Heart,
  Eye,
  ArrowRight,
  Shield,
  Car,
  Scale,
  CheckCircle2,
  CalendarCheck,
  Video,
  Repeat,
  Calculator,
  X,
  FileCheck2,
  Wrench,
  Snowflake,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  dealership,
  dealershipWhatsApp,
  dealershipCall,
  dealershipEmail,
} from "@/app/config/dealership";
import type { Car as CarData } from "@/app/types";

interface CarDetailClientProps {
  car: CarData;
}

const INSPECTION_PILLARS = [
  {
    icon: Activity,
    title: "Engine & Powertrain",
    status: "Verified",
    detail: "Compression, cold-start, idle stability & zero fluid leaks checked.",
  },
  {
    icon: Settings,
    title: "Transmission & Gearbox",
    status: "Smooth Shift",
    detail: "Tested across all gears under load with no slip or delayed engagement.",
  },
  {
    icon: Snowflake,
    title: "AC & Electrical Systems",
    status: "Chilling",
    detail: "Compressor, cabin cooling output, sensors & dashboard electronics vetted.",
  },
  {
    icon: Wrench,
    title: "Suspension, Steering & Frame",
    status: "Inspected",
    detail: "Chassis integrity, control arms, shocks, and alignment road-tested.",
  },
  {
    icon: FileCheck2,
    title: "Customs Duty & Ownership Docs",
    status: "Complete",
    detail: "Original customs papers and registration history verified by LegitAutos.",
  },
];

export default function CarDetailClient({ car }: CarDetailClientProps) {
  const { data: similarData } = useSimilarCars(car._id);
  const { data: inspectionsData } = useInspections({ car: car._id, limit: 12 });
  const inspections = inspectionsData?.inspections || [];

  const { toggleFavorite, favorites } = useFavorites();
  const { addToCompare, removeFromCompare, compareList } = useCompare();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isLiked = mounted && favorites.includes(car._id);
  const isInCompare = mounted && compareList.includes(car._id);
  const similarCars = similarData?.cars || [];

  // Modals & Interactive Calculators
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"in-person" | "video">("in-person");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [showEstimator, setShowEstimator] = useState(false);
  const [depositPct, setDepositPct] = useState(40);
  const [months, setMonths] = useState(12);

  const discount =
    car.originalPrice && car.originalPrice > car.price
      ? Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)
      : null;

  const isSold = car.status === "sold";
  const isReserved = car.status === "reserved";
  const carUrl = `${dealership.siteUrl}/cars/${car.slug || car._id}`;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : carUrl;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${car.year} ${car.title}`, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Vehicle link copied to clipboard!");
    }
  };

  const handleToggleCompare = () => {
    if (isInCompare) {
      removeFromCompare(car._id);
      toast.success("Removed from comparison");
    } else {
      if (compareList.length >= 3) {
        toast.error("You can compare up to 3 cars at a time");
        return;
      }
      addToCompare(car._id, {
        _id: car._id,
        slug: car.slug,
        title: car.title,
        price: car.price,
        year: car.year,
        image: car.images?.[0],
      });
      toast.success("Added to comparison dock");
    }
  };

  const whatsappMessage = isSold
    ? `Hello, I saw the ${car.title} (${car.year}) on the ${dealership.name} website, but it shows as sold. Do you have similar cars available? ${carUrl}`
    : `Hello, I'm interested in the ${car.title} (${car.year}) listed for ${formatPrice(car.price)} on the ${dealership.name} website. Is it still available for inspection? ${carUrl}`;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const modeLabel =
      bookingType === "video"
        ? "Live WhatsApp Video Walkaround"
        : `Physical Showroom Inspection at ${dealership.address.display}`;
    const msg = `Hello ${dealership.name}, I would like to book a *${modeLabel}* for the *${car.year} ${car.title}* (${formatPrice(
      car.price
    )}).\n\nName: ${bookingName || "Prospective Buyer"}\nPreferred Date/Time: ${
      bookingDate || "As soon as possible"
    }\nListing: ${carUrl}`;
    window.open(dealershipWhatsApp(msg), "_blank", "noopener,noreferrer");
    setBookingModalOpen(false);
  };

  // Payment plan math
  const depositAmount = Math.round((car.price * depositPct) / 100);
  const principal = Math.max(0, car.price - depositAmount);
  // Illustrative monthly rate (2% flat monthly / 24% p.a. typical Nigerian auto financing estimate)
  const monthlyEstimate = Math.round(
    (principal * (1 + 0.02 * months)) / months
  );

  const specs = [
    { icon: Calendar, label: "Model Year", value: car.year.toString() },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage) },
    { icon: Settings, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuelType },
    { icon: Palette, label: "Exterior Color", value: car.color },
    {
      icon: Car,
      label: "Condition",
      value: formatConditionLabel(car.condition),
    },
    ...(car.bodyType
      ? [{ icon: Car, label: "Body Type", value: car.bodyType.toUpperCase() }]
      : []),
    ...(car.engineSize
      ? [{ icon: Activity, label: "Engine", value: car.engineSize }]
      : []),
    { icon: MapPin, label: "Showroom", value: car.location },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EF] pb-28 md:pb-16">
      {/* Breadcrumb Bar */}
      <div className="pt-6 pb-4 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-dark-500 min-w-0"
        >
          <Link href="/" className="hover:text-[#D9381E] transition-colors shrink-0">
            Home
          </Link>
          <span className="shrink-0 text-dark-300">/</span>
          <Link
            href="/cars"
            className="hover:text-[#D9381E] transition-colors shrink-0"
          >
            Inventory
          </Link>
          <span className="shrink-0 text-dark-300">/</span>
          <Link
            href={`/cars?brand=${encodeURIComponent(car.brand)}`}
            className="hover:text-[#D9381E] transition-colors shrink-0"
          >
            {car.brand}
          </Link>
          <span className="shrink-0 text-dark-300">/</span>
          <span className="text-dark-900 font-bold truncate min-w-0">
            {car.title}
          </span>
        </nav>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pb-12">
        {/* Status Banner for Sold or Reserved */}
        {(isSold || isReserved) && (
          <div
            className={`mb-6 flex items-center justify-between gap-3 rounded-2xl border p-4 ${
              isSold
                ? "bg-danger-soft border-danger/25 text-danger"
                : "bg-warning-soft border-warning/25 text-warning"
            }`}
            role="status"
          >
            <div className="flex items-center gap-3">
              {isSold ? (
                <Check className="w-5 h-5 shrink-0" />
              ) : (
                <Calendar className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm font-bold">
                {isSold
                  ? "This vehicle has been sold — explore similar available stock below or request an identical import."
                  : "This vehicle is currently reserved. Contact our sales team to join the backup list or inspect similar stock."}
              </p>
            </div>
            <Link
              href="/request"
              className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-dark-900 shadow-2xs hover:bg-dark-50"
            >
              Source Similar
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 8 Columns: Media, Specs, Inspection Report, Description */}
          <div className="min-w-0 space-y-6 lg:col-span-8">
            {/* Bento Gallery */}
            <ImageGallery images={car.images} title={car.title} />

            {/* Mobile-First Header Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white border border-dark-900/[0.08] p-5 sm:p-7 shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <Badge
                      variant={
                        car.condition === "new"
                          ? "success"
                          : car.condition === "certified" ||
                            car.condition === "foreign-used"
                          ? "primary"
                          : "default"
                      }
                    >
                      {formatConditionLabel(car.condition)}
                    </Badge>
                    {isSold && <Badge variant="danger">Sold</Badge>}
                    {isReserved && <Badge variant="warning">Reserved</Badge>}
                    {!isSold && !isReserved && (
                      <Badge variant="success">Available on Lot</Badge>
                    )}
                    {car.customsPaid !== false && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#D9381E]/10 px-2.5 py-0.5 text-xs font-bold text-[#D9381E]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Customs Duty Paid
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs font-medium text-dark-400">
                      <Eye className="w-3.5 h-3.5" />
                      {car.views} views
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 tracking-tight">
                    {car.title}
                  </h1>
                </div>

                {/* Action Icons: Save, Compare, Share */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(car._id)}
                    aria-label={isLiked ? "Remove from saved" : "Save vehicle"}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isLiked
                        ? "bg-danger-soft border-danger/30 text-danger"
                        : "border-dark-200 text-dark-700 hover:text-danger hover:bg-danger-soft hover:border-danger/20"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span className="hidden sm:inline">
                      {isLiked ? "Saved" : "Save"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleCompare}
                    aria-label="Compare vehicle"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isInCompare
                        ? "bg-[#D9381E]/10 border-[#D9381E]/30 text-[#D9381E]"
                        : "border-dark-200 text-dark-700 hover:text-[#D9381E] hover:border-[#D9381E]/30"
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {isInCompare ? "Comparing" : "Compare"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share vehicle"
                    className="p-2.5 rounded-xl border border-dark-200 text-dark-700 hover:text-dark-900 hover:bg-dark-50 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="mt-5 pt-5 border-t border-dark-100 flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-dark-900 tracking-tight">
                    {formatPrice(car.price)}
                  </span>
                  {car.originalPrice && car.originalPrice > car.price && (
                    <>
                      <span className="text-base font-medium text-dark-400 line-through">
                        {formatPrice(car.originalPrice)}
                      </span>
                      <Badge variant="danger">Save {discount}%</Badge>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowEstimator(!showEstimator)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:underline"
                >
                  <Calculator className="h-4 w-4" />
                  {showEstimator
                    ? "Hide Payment Estimator"
                    : "Estimate Deposit / Installments"}
                </button>
              </div>

              {/* Optional Payment / Deposit Calculator */}
              <AnimatePresence>
                {showEstimator && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 rounded-2xl bg-dark-50/80 border border-dark-100 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-dark-900">
                          Illustrative Payment Estimator
                        </h3>
                        <span className="text-[0.7rem] font-semibold text-dark-500">
                          Subject to financing partner approval
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-dark-700 mb-1.5">
                            <span>Initial Deposit ({depositPct}%)</span>
                            <span className="text-[#D9381E]">
                              {formatPrice(depositAmount)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={20}
                            max={80}
                            step={5}
                            value={depositPct}
                            onChange={(e) =>
                              setDepositPct(Number(e.target.value))
                            }
                            aria-label="Deposit percentage"
                            className="w-full accent-[#D9381E] cursor-pointer"
                          />
                        </div>

                        <div>
                          <span className="block text-xs font-bold text-dark-700 mb-1.5">
                            Duration (Months)
                          </span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[6, 12, 18, 24].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setMonths(m)}
                                className={`rounded-lg py-1.5 text-xs font-bold transition-colors ${
                                  months === m
                                    ? "bg-[#D9381E] text-white"
                                    : "bg-white border border-dark-200 text-dark-700"
                                }`}
                              >
                                {m}m
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-dark-200/70">
                        <div>
                          <span className="text-xs text-dark-500">
                            Estimated Monthly Repayment:{" "}
                          </span>
                          <strong className="text-base font-extrabold text-dark-900">
                            {formatPrice(monthlyEstimate)}/mo
                          </strong>
                        </div>
                        <a
                          href={dealershipWhatsApp(
                            `Hello ${dealership.name}, I'd like to ask about financing or payment options for the ${car.year} ${car.title} (${formatPrice(
                              car.price
                            )}) with a ${depositPct}% deposit (${formatPrice(
                              depositAmount
                            )}).`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#D9381E] hover:underline"
                        >
                          Discuss Payment Plan on WhatsApp &rarr;
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Real Inspection Footage (when uploaded) */}
            <CarInspection inspections={inspections} />

            {/* Specifications Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-white border border-dark-900/[0.08] p-5 sm:p-7 shadow-xs"
            >
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-dark-500 mb-4">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-dark-50/70 border border-dark-100/60"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-dark-100 flex items-center justify-center shrink-0">
                      <spec.icon className="w-4 h-4 text-[#D9381E]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.68rem] font-bold uppercase tracking-wider text-dark-400">
                        {spec.label}
                      </p>
                      <p className="text-sm font-bold text-dark-900 capitalize truncate mt-0.5">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 5-Pillar Dealership Verification Scorecard */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-[#0C0C0E] text-white p-5 sm:p-7 shadow-xs border border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C89D54]">
                    Showroom Quality Assurance
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                    5-Pillar Pre-Listing Verification
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBookingType("in-person");
                    setBookingModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-[#D9381E] transition-colors cursor-pointer"
                >
                  <CalendarCheck className="h-4 w-4 text-[#C89D54]" />
                  Bring Your Mechanic to Inspect
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {INSPECTION_PILLARS.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D9381E]/20 text-[#D9381E]">
                      <pillar.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-white">
                          {pillar.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#D9381E]/20 px-2 py-0.5 text-[0.65rem] font-bold text-[#D9381E]">
                          <Check className="h-3 w-3" />
                          {pillar.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-white/70">
                        {pillar.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-white border border-dark-900/[0.08] p-5 sm:p-7 shadow-xs"
            >
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-dark-500 mb-3">
                Vehicle Overview & Seller Notes
              </h2>
              <p className="text-sm sm:text-base text-dark-700 leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </motion.div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white border border-dark-900/[0.08] p-5 sm:p-7 shadow-xs"
              >
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-dark-500 mb-4">
                  Equipped Features & Options ({car.features.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {car.features.map((feature: string) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 rounded-xl bg-dark-50/60 px-3 py-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D9381E] shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-dark-800">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right 4 Columns: Sticky Dealership Action Console */}
          <div className="block min-w-0 lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl bg-white border border-dark-900/[0.08] p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-dark-100">
                  <div className="w-11 h-11 bg-[#D9381E]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-[#D9381E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-extrabold text-dark-900">
                        {dealership.name} Showroom
                      </p>
                      <CheckCircle2 className="h-4 w-4 text-[#D9381E]" />
                    </div>
                    <p className="text-xs text-dark-500 font-medium">
                      {dealership.address.display} &middot;{" "}
                      {dealership.openingHours}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  {isSold ? (
                    <>
                      <Link
                        href={`/cars?brand=${encodeURIComponent(car.brand)}`}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0C0C0E] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D9381E] transition-colors"
                      >
                        <Car className="w-4 h-4" />
                        Browse Available {car.brand}s
                      </Link>
                      <Link
                        href="/request"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-dark-200 text-dark-900 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-dark-50 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[#D9381E]" />
                        Request a Similar {car.model}
                      </Link>
                    </>
                  ) : (
                    <>
                      <a
                        href={dealershipWhatsApp(whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#128C7E] text-white text-sm font-bold rounded-xl hover:bg-[#0e7a6e] transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Enquire on WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setBookingType("in-person");
                          setBookingModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0C0C0E] text-white text-sm font-bold rounded-xl hover:bg-[#D9381E] transition-colors cursor-pointer"
                      >
                        <CalendarCheck className="w-4 h-4 text-[#C89D54]" />
                        Schedule Inspection / Viewing
                      </button>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={dealershipCall()}
                          className="flex items-center justify-center gap-1.5 py-2.5 border border-dark-200 text-dark-800 text-xs font-bold rounded-xl hover:bg-dark-50 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#D9381E]" />
                          Call Sales
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setBookingType("video");
                            setBookingModalOpen(true);
                          }}
                          className="flex items-center justify-center gap-1.5 py-2.5 border border-dark-200 text-dark-800 text-xs font-bold rounded-xl hover:bg-dark-50 transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5 text-[#D9381E]" />
                          Video Call
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Trade-In Callout */}
                <div className="mt-5 rounded-xl bg-[#EFECE6] p-4 border border-dark-100">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D9381E]/15 text-[#D9381E]">
                      <Repeat className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-dark-900">
                        Have a Car to Swap / Trade In?
                      </h4>
                      <p className="mt-0.5 text-xs text-dark-600 leading-relaxed">
                        Use your current vehicle&apos;s value toward this{" "}
                        {car.year} {car.brand} {car.model}.
                      </p>
                      <Link
                        href={`/sell?tradeFor=${encodeURIComponent(car.title)}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#D9381E] hover:underline"
                      >
                        Start Trade-In Valuation
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Safety Guarantee */}
                <div className="mt-5 pt-4 border-t border-dark-100">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-[#D9381E] mt-0.5 shrink-0" />
                    <p className="text-xs text-dark-500 leading-relaxed">
                      <strong className="text-dark-800">
                        Buyer Protection:
                      </strong>{" "}
                      Inspect the vehicle physically at our{" "}
                      {dealership.address.area} lot and verify all customs &
                      ownership papers before making payment.
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <a
                    href={dealershipEmail(`Enquiry: ${car.title}`)}
                    className="text-xs font-semibold text-dark-400 hover:text-[#D9381E] transition-colors"
                  >
                    {dealership.email}
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Cars Section — Using Upgraded CarCard */}
      {similarCars.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pt-8 pb-12 border-t border-dark-900/[0.06]">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9381E] block mb-1">
                Similar Vehicles
              </span>
              <h2 className="text-2xl font-extrabold text-dark-900 uppercase tracking-tight">
                More {car.brand} Inventory
              </h2>
            </div>
            <Link
              href={`/cars?brand=${encodeURIComponent(car.brand)}`}
              className="flex items-center gap-1.5 text-xs font-bold text-dark-600 hover:text-[#D9381E] transition-colors"
            >
              View All {car.brand}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarCars.slice(0, 4).map((item, idx) => (
              <CarCard key={item._id} car={item} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Book Inspection / Video Walkaround Modal */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Schedule vehicle inspection"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0C0C0E]/70 backdrop-blur-sm"
              onClick={() => setBookingModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-dark-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D9381E]">
                    No-Obligation Viewing
                  </span>
                  <h3 className="text-lg font-extrabold text-dark-900">
                    Schedule Inspection
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  aria-label="Close modal"
                  className="rounded-xl p-2 text-dark-400 hover:bg-dark-50 hover:text-dark-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-dark-50 p-1">
                  <button
                    type="button"
                    onClick={() => setBookingType("in-person")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all ${
                      bookingType === "in-person"
                        ? "bg-white text-[#0C0C0E] shadow-xs"
                        : "text-dark-600"
                    }`}
                  >
                    <CalendarCheck className="h-3.5 w-3.5 text-[#D9381E]" />
                    Visit Showroom
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType("video")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all ${
                      bookingType === "video"
                        ? "bg-white text-[#0C0C0E] shadow-xs"
                        : "text-dark-600"
                    }`}
                  >
                    <Video className="h-3.5 w-3.5 text-[#D9381E]" />
                    Live Video Call
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-bold text-dark-700 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. Tunde Bakare"
                    className="w-full rounded-xl border border-dark-200 px-3.5 py-2.5 text-sm text-dark-900 focus:border-[#D9381E] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-bold text-dark-700 mb-1.5"
                  >
                    Preferred Date & Time
                  </label>
                  <input
                    id="booking-date"
                    type="text"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    placeholder="e.g. Tomorrow at 2:00 PM or Saturday morning"
                    className="w-full rounded-xl border border-dark-200 px-3.5 py-2.5 text-sm text-dark-900 focus:border-[#D9381E] focus:outline-none"
                  />
                </div>

                <p className="text-xs text-dark-500 leading-relaxed">
                  {bookingType === "video"
                    ? "Our team will call you on WhatsApp Video straight from the car so you can hear the engine and inspect the interior live."
                    : `Showroom Location: ${dealership.address.display} (${dealership.openingHours}).`}
                </p>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9381E] py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B82B14] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirm Slot via WhatsApp
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Mobile Contact Bar */}
      <StickyContact
        carTitle={car.title}
        price={car.price}
        onBookViewing={() => setBookingModalOpen(true)}
      />
    </div>
  );
}
