"use client";

import { useParams } from "next/navigation";
import { useCar, useSimilarCars } from "@/app/hooks/useCars";
import { ImageGallery } from "@/app/components/cars/ImageGallery";
import { CarDetailSkeleton } from "@/app/components/ui/Skeleton";
import { ErrorMessage } from "@/app/components/ui/ErrorMessage";
import { StickyContact } from "@/app/components/layout/StickyContact";
import { formatPrice, formatMileage, generateWhatsAppLink, generateCallLink } from "@/app/utils/format";
import { Badge } from "@/app/components/ui/Badge";
import { useFavorites } from "@/app/stores/favoriteStore";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Palette,
  User,
  Phone,
  MessageCircle,
  Check,
  Share2,
  Heart,
  Eye,
  ArrowRight,
  Shield,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function CarDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError, refetch } = useCar(id);
  const { data: similarData } = useSimilarCars(id);
  const { toggleFavorite, favorites } = useFavorites();
  const isLiked = favorites.includes(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-28 pb-12 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
          <CarDetailSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !data?.car) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ErrorMessage message="Car not found" onRetry={refetch} />
      </div>
    );
  }

  const car = data.car;
  const similarCars = similarData?.cars || [];
  const discount = car.originalPrice
    ? Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)
    : null;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: car.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const whatsappMessage = `Hello, I'm interested in the ${car.title} (${car.year}) listed for ${formatPrice(car.price)} on LegitAutos Autos. Is it still available?`;

  const specs = [
    { icon: Calendar, label: "Year", value: car.year.toString() },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage) },
    { icon: Settings, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuelType },
    { icon: Palette, label: "Color", value: car.color },
    { icon: MapPin, label: "Location", value: car.location },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <nav className="flex items-center gap-2 t-mono text-[0.5rem] text-dark-400 min-w-0">
          <Link href="/" className="hover:text-dark-600 transition-colors shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          <Link href="/cars" className="hover:text-dark-600 transition-colors shrink-0">Cars</Link>
          <span className="shrink-0">/</span>
          <span className="text-dark-600 truncate min-w-0">{car.title}</span>
        </nav>
      </div>

      <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <ImageGallery images={car.images} title={car.title} />

            {/* Title & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-white border border-gray-200/80 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-dark-900">{car.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Badge variant={car.condition === "new" ? "success" : car.condition === "certified" ? "primary" : "default"}>
                      {car.condition}
                    </Badge>
                    {car.featured && <Badge variant="warning">Featured</Badge>}
                    <span className="flex items-center gap-1 t-mono text-[0.5rem] text-dark-400">
                      <Eye className="w-3 h-3" />
                      {car.views}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(id)}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isLiked
                        ? "bg-rose-50 border-rose-200 text-rose-500"
                        : "border-gray-200 text-dark-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                  <button onClick={handleShare} className="p-2.5 rounded-lg border border-gray-200 text-dark-400 hover:text-dark-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl sm:text-4xl font-bold text-dark-900">
                  {formatPrice(car.price)}
                </span>
                {car.originalPrice && car.originalPrice > car.price && (
                  <>
                    <span className="text-lg text-dark-400 line-through">
                      {formatPrice(car.originalPrice)}
                    </span>
                    <Badge variant="danger">-{discount}%</Badge>
                  </>
                )}
              </div>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-white border border-gray-200/80 p-6"
            >
              <h2 className="t-mono text-dark-500 text-[0.55rem] tracking-[0.1em] mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <spec.icon className="w-3.5 h-3.5 text-dark-500" />
                    </div>
                    <div>
                      <p className="t-mono text-[0.45rem] text-dark-400">{spec.label}</p>
                      <p className="text-sm font-semibold text-dark-700 capitalize">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-white border border-gray-200/80 p-6"
            >
              <h2 className="t-mono text-dark-500 text-[0.55rem] tracking-[0.1em] mb-4">Description</h2>
              <p className="text-sm text-dark-600 leading-relaxed whitespace-pre-line">{car.description}</p>
            </motion.div>

            {/* Features */}
            {car.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl bg-white border border-gray-200/80 p-6"
              >
                <h2 className="t-mono text-dark-500 text-[0.55rem] tracking-[0.1em] mb-4">Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {car.features.map((feature: any) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-sm text-dark-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="block space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-white border border-gray-200/80 p-6 sticky top-28"
            >
              <h3 className="t-mono text-dark-500 text-[0.55rem] tracking-[0.1em] mb-5">Contact Seller</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark-800">{car.seller.name}</p>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-primary" />
                      <p className="t-mono text-[0.45rem] text-primary font-medium">Verified Seller</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={generateWhatsAppLink(car.seller.whatsapp || car.seller.phone, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#128C7E] text-white text-sm font-semibold rounded-lg hover:bg-[#0e7a6e] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a
                    href={generateCallLink(car.seller.phone)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-dark text-white text-sm font-semibold rounded-lg hover:bg-dark-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Seller
                  </a>
                </div>

                {car.seller.email && (
                  <a
                    href={`mailto:${car.seller.email}`}
                    className="block text-center t-mono text-[0.5rem] text-dark-400 hover:text-primary transition-colors"
                  >
                    {car.seller.email}
                  </a>
                )}
              </div>

              {/* Safety Tips */}
              <div className="mt-6 pt-5 border-t border-gray-200/80">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[0.7rem] text-dark-500 leading-relaxed">
                    <span className="font-semibold text-dark-700">Safety Tip:</span> Always inspect the car in person and verify documents before making payment. Never send money before seeing the car.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <div className="px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto pb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="t-mono text-[0.5rem] text-dark-400 block mb-2">Similar Cars</span>
              <h2 className="text-xl font-bold text-dark-900">
                More {car.brand}
              </h2>
            </div>
            <Link
              href={`/cars?brand=${car.brand}`}
              className="flex items-center gap-1.5 t-mono text-[0.5rem] text-dark-400 hover:text-primary transition-colors"
            >
              View All
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {similarCars.map((item: any) => (
              <Link
                key={item._id}
                href={`/cars/${item._id}`}
                className="group rounded-xl bg-white border border-gray-200/80 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/80 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="t-mono text-[0.5rem] text-dark-300">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base font-bold text-dark-900">{formatPrice(item.price)}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-dark-700 group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="t-mono text-[0.45rem] text-dark-400">{item.year}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-dark-300" />
                    <span className="t-mono text-[0.45rem] text-dark-400">{formatMileage(item.mileage)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Contact */}
      <StickyContact
        phone={car.seller.phone}
        whatsapp={car.seller.whatsapp}
        carTitle={car.title}
      />
    </div>
  );
}
