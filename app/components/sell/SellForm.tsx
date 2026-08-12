"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { carRequestSchema, CarRequestFormData } from "@/app/types/request";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import {
  Upload,
  X,
  Image as ImageIcon,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Camera,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const BRANDS = [
  "Toyota", "Honda", "Lexus", "Mercedes-Benz", "BMW", "Audi",
  "Ford", "Hyundai", "Kia", "Nissan", "Volkswagen", "Porsche",
  "Chevrolet", "Mazda", "Subaru", "Volvo", "Jaguar", "Land Rover",
];

interface SellFormData {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  condition: string;
  location: string;
  description: string;
  features: string[];
  images: string[];
}

export function SellForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SellFormData>({
    resolver: zodResolver(carRequestSchema as any),
    defaultValues: {
      transmission: "automatic",
      fuelType: "petrol",
      condition: "used",
      features: [],
      images: [],
    },
  });

  const validateStep = async () => {
    let fields: string[] = [];
    if (step === 1) fields = ["name", "phone"];
    if (step === 2) fields = ["brand", "model", "year", "price"];
    if (step === 3) fields = ["mileage", "transmission", "fuelType", "color", "condition", "location"];
    return await trigger(fields as any);
  };

  const nextStep = async () => {
    const valid = await validateStep();
    if (valid && step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          newImages.push(data.url);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    const updated = [...images, ...newImages].slice(0, 10);
    setImages(updated);
    setValue("images", updated);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setValue("images", updated);
  };

  const onSubmit = async (data: SellFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${data.year} ${data.brand} ${data.model}`,
          brand: data.brand,
          model: data.model,
          year: data.year,
          price: data.price,
          mileage: data.mileage,
          transmission: data.transmission,
          fuelType: data.fuelType,
          color: data.color,
          condition: data.condition,
          description: data.description || `${data.year} ${data.brand} ${data.model} for sale.`,
          features: data.features || [],
          images,
          location: data.location,
          sellerName: data.name,
          sellerPhone: data.phone,
          sellerWhatsapp: data.whatsapp,
          sellerEmail: data.email,
          status: "pending",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-dark-900 mb-3">
          Car Listed Successfully!
        </h3>
        <p className="text-sm text-dark-500 max-w-md mx-auto mb-8 leading-relaxed">
          Your car has been submitted and is pending review. Our team will verify the details
          and publish it within 24 hours. You&apos;ll receive a confirmation on WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => { setIsSuccess(false); setStep(1); setImages([]); }} variant="ghost">
            List Another Car
          </Button>
          <Link href="/cars">
            <Button>Browse Cars</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center gap-3 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i + 1 <= step
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-dark-400"
              }`}>
              {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`flex-1 h-px transition-all ${i + 1 < step ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between t-mono text-[0.45rem] text-dark-400 -mt-4 mb-6">
        <span className={step >= 1 ? "text-primary font-medium" : ""}>Contact</span>
        <span className={step >= 2 ? "text-primary font-medium" : ""}>Car Info</span>
        <span className={step >= 3 ? "text-primary font-medium" : ""}>Details</span>
        <span className={step >= 4 ? "text-primary font-medium" : ""}>Photos</span>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Contact */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-dark-800">Your Information</h3>
              <p className="text-sm text-dark-500 mt-1">How buyers will reach you</p>
            </div>
            <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register("name")} />
            <Input label="Phone Number" placeholder="+234 800 000 0000" error={errors.phone?.message} {...register("phone")} />
            <Input label="WhatsApp (optional)" placeholder="+234 800 000 0000" {...register("whatsapp")} />
            <Input label="Email (optional)" type="email" placeholder="john@example.com" {...register("email")} />
          </motion.div>
        )}

        {/* Step 2: Car Info */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-dark-800">Car Information</h3>
              <p className="text-sm text-dark-500 mt-1">Basic details about your car</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Brand <span className="text-rose-500">*</span></label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {BRANDS.map((brand) => {
                  const selected = watch("brand") === brand;
                  return (
                    <label key={brand} className={`flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${selected ? "bg-primary/5 text-primary border-primary/20" : "bg-white text-dark-600 border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" value={brand} {...register("brand")} className="sr-only" />
                      {brand}
                    </label>
                  );
                })}
              </div>
              {errors.brand && <p className="text-xs text-rose-500">{errors.brand.message}</p>}
            </div>
            <Input label="Model" placeholder="e.g., Camry, Corolla" error={errors.model?.message} {...register("model")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Year" type="number" placeholder="2020" leftIcon={<Calendar className="w-4 h-4" />} error={errors.year?.message} {...register("year", { valueAsNumber: true })} />
              <Input label="Price" type="number" placeholder="5000000" leftIcon={<DollarSign className="w-4 h-4" />} error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
            </div>
          </motion.div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-dark-800">Car Details</h3>
              <p className="text-sm text-dark-500 mt-1">Specifications and condition</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Mileage (km)" type="number" placeholder="50000" leftIcon={<Gauge className="w-4 h-4" />} error={errors.mileage?.message} {...register("mileage", { valueAsNumber: true })} />
              <Input label="Color" placeholder="Black" leftIcon={<Palette className="w-4 h-4" />} error={errors.color?.message} {...register("color")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Transmission" options={[{ value: "automatic", label: "Automatic" }, { value: "manual", label: "Manual" }, { value: "cvt", label: "CVT" }]} {...register("transmission")} />
              <Select label="Fuel Type" options={[{ value: "petrol", label: "Petrol" }, { value: "diesel", label: "Diesel" }, { value: "hybrid", label: "Hybrid" }, { value: "electric", label: "Electric" }]} {...register("fuelType")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Condition" options={[{ value: "new", label: "New" }, { value: "used", label: "Used" }, { value: "certified", label: "Certified" }]} {...register("condition")} />
              <Input label="Location" placeholder="Lagos" leftIcon={<Car className="w-4 h-4" />} error={errors.location?.message} {...register("location")} />
            </div>
            <Textarea label="Description" placeholder="Describe your car — condition, history, any modifications..." rows={4} error={errors.description?.message} {...register("description")} />
          </motion.div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-dark-800">Photos</h3>
              <p className="text-sm text-dark-500 mt-1">Upload up to 10 photos of your car</p>
            </div>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-dark-500">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-dark-400" />
                  </div>
                  <div>
                    <p className="text-sm text-dark-600">Click to upload photos</p>
                    <p className="t-mono text-[0.45rem] text-dark-400 mt-1">JPG, PNG up to 5MB each</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                    <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 t-mono text-[0.4rem] text-white bg-black/50 px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="t-mono text-[0.45rem] text-dark-400 text-center">
              {images.length}/10 photos uploaded
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 1} leftIcon={<ChevronLeft className="w-4 h-4" />}>
          Back
        </Button>
        {step < totalSteps ? (
          <Button type="button" onClick={nextStep} rightIcon={<ChevronRight className="w-4 h-4" />}>
            Continue
          </Button>
        ) : (
          <Button type="submit" isLoading={isSubmitting}>
            List My Car
          </Button>
        )}
      </div>
    </form>
  );
}
