"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { carRequestSchema, CarRequestFormData } from "@/app/types/request";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import {
  Phone,
  Mail,
  MessageCircle,
  Car,
  Calendar,
  Gauge,
  DollarSign,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const BRANDS = [
  "Toyota", "Honda", "Lexus", "Mercedes-Benz", "BMW", "Audi",
  "Ford", "Hyundai", "Kia", "Nissan", "Volkswagen", "Porsche",
  "Chevrolet", "Mazda", "Subaru", "Volvo", "Jaguar", "Land Rover",
];

const COLORS = [
  "Black", "White", "Silver", "Gray", "Red", "Blue", "Green",
  "Brown", "Beige", "Gold", "Orange", "Yellow", "Purple",
];

interface RequestFormProps {
  onSuccess?: () => void;
}

export function RequestForm({ onSuccess }: RequestFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<CarRequestFormData>({
    resolver: zodResolver(carRequestSchema),
    defaultValues: {
      preferredContact: "whatsapp",
      transmission: "any",
      fuelType: "any",
      condition: "any",
      urgency: "flexible",
    },
  });

  const watchedBrand = watch("brand");
  const watchedUrgency = watch("urgency");

  const validateStep = async () => {
    let fields: (keyof CarRequestFormData)[] = [];
    if (step === 1) fields = ["name", "phone", "preferredContact"];
    if (step === 2) fields = ["brand"];
    if (step === 3) fields = [];
    return await trigger(fields);
  };

  const nextStep = async () => {
    const valid = await validateStep();
    if (valid && step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: CarRequestFormData) => {
    if (step < totalSteps) return;
    setIsSubmitting(true);
    try {
      const toNum = (v: unknown) => {
        if (v === "" || v === undefined || v === null) return undefined;
        const n = Number(v);
        return isNaN(n) ? undefined : n;
      };
      const payload = {
        ...data,
        yearFrom: toNum(data.yearFrom as string),
        yearTo: toNum(data.yearTo as string),
        budgetFrom: toNum(data.budgetFrom as string),
        budgetTo: toNum(data.budgetTo as string),
        mileageMax: toNum(data.mileageMax as string),
      };
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Validation issues:", error.issues);
        throw new Error(error.error || "Failed to submit");
      }

      setIsSuccess(true);
      reset();
      onSuccess?.();
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
        className="text-center py-10 px-4"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-black text-dark-900 mb-2">
          Sourcing Brief Received!
        </h3>
        <p className="text-sm text-dark-500 max-w-md mx-auto mb-8 leading-relaxed">
          Our sourcing desk will search our port &amp; dealer network and contact you within 24 hours with matching options, photos, and pricing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => { setIsSuccess(false); setStep(1); }} variant="ghost">
            Submit Another Brief
          </Button>
          <Link href="/cars">
            <Button>Browse Live Inventory</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                  i + 1 <= step
                    ? "bg-ink text-white shadow-sm"
                    : "bg-gray-100 text-dark-400"
                }`}
              >
                {i + 1 < step ? <CheckCircle2 className="w-4 h-4 text-teal" /> : `0${i + 1}`}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all ${
                    i + 1 < step ? "bg-teal" : "bg-gray-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs font-semibold text-dark-400">
          <span className={step >= 1 ? "text-dark-900" : ""}>1. Contact Details</span>
          <span className={step >= 2 ? "text-dark-900" : ""}>2. Target Vehicle</span>
          <span className={step >= 3 ? "text-dark-900" : ""}>3. Specs &amp; Budget</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-4"
          >
            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-dark-900">How can our sourcing desk reach you?</h3>
              <p className="text-xs text-dark-500 mt-1">
                We&apos;ll send verified vehicle photos and pricing to your preferred channel.
              </p>
            </div>

            <Input
              label="Full Name"
              placeholder="e.g., Tunde Bakare"
              leftIcon={<Sparkles className="w-4 h-4" />}
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+234 800 000 0000"
                leftIcon={<Phone className="w-4 h-4" />}
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="WhatsApp Number (optional)"
                placeholder="+234 800 000 0000"
                leftIcon={<MessageCircle className="w-4 h-4" />}
                error={errors.whatsapp?.message}
                {...register("whatsapp")}
              />
            </div>

            <Input
              label="Email Address (optional)"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-2 pt-1">
              <label className="block text-sm font-medium text-dark-700">
                Preferred Contact Channel
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                  { value: "phone", label: "Phone Call", icon: Phone },
                  { value: "email", label: "Email", icon: Mail },
                ] as const).map((option) => {
                  const selected = watch("preferredContact") === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selected
                          ? "border-teal bg-teal/5 text-teal"
                          : "border-gray-200 hover:border-gray-300 text-dark-600"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("preferredContact")}
                        className="sr-only"
                      />
                      <option.icon className="w-4 h-4" />
                      <span className="text-xs font-bold">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-5"
          >
            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-dark-900">What vehicle are you looking for?</h3>
              <p className="text-xs text-dark-500 mt-1">
                Select the make, model, and target production years.
              </p>
            </div>

            {/* Brand Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Manufacturer <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
                {BRANDS.map((brand) => {
                  const selected = watchedBrand === brand;
                  return (
                    <label
                      key={brand}
                      className={`flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                        selected
                          ? "bg-ink text-white border-ink shadow-sm"
                          : "bg-white text-dark-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={brand}
                        {...register("brand")}
                        className="sr-only"
                      />
                      {brand}
                    </label>
                  );
                })}
              </div>
              {errors.brand && (
                <p className="text-xs text-danger mt-1">{errors.brand.message}</p>
              )}
            </div>

            <Input
              label="Model & Trim (optional)"
              placeholder="e.g., RX 350 F-Sport, GLE 450, Camry XSE"
              leftIcon={<Car className="w-4 h-4" />}
              error={errors.model?.message}
              {...register("model")}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Minimum Year"
                type="number"
                placeholder="2019"
                leftIcon={<Calendar className="w-4 h-4" />}
                error={errors.yearFrom?.message}
                {...register("yearFrom")}
              />
              <Input
                label="Maximum Year"
                type="number"
                placeholder="2025"
                leftIcon={<Calendar className="w-4 h-4" />}
                error={errors.yearTo?.message}
                {...register("yearTo")}
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-5"
          >
            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-dark-900">Origin, Budget &amp; Timeline</h3>
              <p className="text-xs text-dark-500 mt-1">
                Help us narrow down exact units that match your expectations.
              </p>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Target Budget Range (₦)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Min (e.g. 15000000)"
                  type="number"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  error={errors.budgetFrom?.message}
                  {...register("budgetFrom")}
                />
                <Input
                  placeholder="Max (e.g. 25000000)"
                  type="number"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  error={errors.budgetTo?.message}
                  {...register("budgetTo")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Condition / Origin"
                options={[
                  { value: "any", label: "Any Condition" },
                  { value: "foreign-used", label: "Foreign Used (Tokunbo)" },
                  { value: "new", label: "Brand New" },
                  { value: "nigerian-used", label: "Nigerian Used" },
                  { value: "certified", label: "Certified Pre-Owned" },
                ]}
                {...register("condition")}
              />
              <Input
                label="Max Mileage (km)"
                type="number"
                placeholder="e.g., 60000"
                leftIcon={<Gauge className="w-4 h-4" />}
                error={errors.mileageMax?.message}
                {...register("mileageMax")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Transmission"
                options={[
                  { value: "any", label: "Any Transmission" },
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                  { value: "cvt", label: "CVT" },
                ]}
                {...register("transmission")}
              />
              <Select
                label="Fuel / Powertrain"
                options={[
                  { value: "any", label: "Any Fuel Type" },
                  { value: "petrol", label: "Petrol" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "diesel", label: "Diesel" },
                  { value: "electric", label: "Electric" },
                ]}
                {...register("fuelType")}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Preferred Exterior Color
              </label>
              <div className="flex flex-wrap gap-2">
                <label
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                    !watch("color")
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-dark-600 border-gray-200"
                  }`}
                >
                  <input type="radio" value="" {...register("color")} className="sr-only" />
                  Any Color
                </label>
                {COLORS.map((color) => {
                  const selected = watch("color") === color;
                  return (
                    <label
                      key={color}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                        selected
                          ? "bg-ink text-white border-ink"
                          : "bg-white text-dark-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={color}
                        {...register("color")}
                        className="sr-only"
                      />
                      {color}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Purchase Timeline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {([
                  { value: "asap", label: "Ready Now", desc: "Immediate" },
                  { value: "1week", label: "Within 7 Days", desc: "This week" },
                  { value: "1month", label: "Within 30 Days", desc: "This month" },
                  { value: "flexible", label: "Flexible", desc: "Comparing options" },
                ] as const).map((option) => {
                  const selected = watchedUrgency === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        selected
                          ? "border-teal bg-teal/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("urgency")}
                        className="sr-only"
                      />
                      <Clock
                        className={`w-4 h-4 ${selected ? "text-teal" : "text-dark-400"}`}
                      />
                      <span
                        className={`text-xs font-bold ${
                          selected ? "text-teal" : "text-dark-800"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-[11px] text-dark-400">{option.desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Special Trim, Interior Color, or Custom Notes (optional)"
              placeholder="e.g., Must have panoramic roof, red leather interior, 360 camera, and clean Carfax..."
              rows={3}
              error={errors.description?.message}
              {...register("description")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        {step < totalSteps ? (
          <Button type="button" onClick={nextStep} rightIcon={<ChevronRight className="w-4 h-4" />}>
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Submit Sourcing Brief
          </Button>
        )}
      </div>
    </form>
  );
}
