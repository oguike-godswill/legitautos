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
        className="text-center py-12 px-6"
      >
        <div className="w-16 h-16 bg-success-soft rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold text-dark-900 mb-3">
          Request Submitted!
        </h3>
        <p className="text-sm text-dark-500 max-w-md mx-auto mb-8 leading-relaxed">
          We&apos;ll search our network and contact you within 24 hours with matching cars.
          Keep your phone nearby!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => { setIsSuccess(false); setStep(1); }} variant="ghost">
            Submit Another Request
          </Button>
          <Link href="/cars">
            <Button>Browse Available Cars</Button>
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
          <div key={i} className="flex-1 w-full flex items-center justify-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i + 1 <= step
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-dark-400"
              }`}>
              {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`flex-1 h-px rounded-full transition-all ${
                  i + 1 < step ? "bg-primary" : "bg-gray-200"
                }`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between t-mono text-[0.45rem] text-dark-400 -mt-4 mb-6">
        <span className={step >= 1 ? "text-primary font-medium" : ""}>Contact</span>
        <span className={step >= 2 ? "text-primary font-medium" : ""}>Car Details</span>
        <span className={step >= 3 ? "text-primary font-medium" : ""}>Preferences</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-dark-800">How can we reach you?</h3>
              <p className="text-sm text-dark-500 mt-1">
                We&apos;ll contact you as soon as we find matching cars
              </p>
            </div>

            <Input
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<Sparkles className="w-4 h-4" />}
              error={errors.name?.message}
              {...register("name")}
            />

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

            <Input
              label="Email (optional)"
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Preferred Contact Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                  { value: "phone", label: "Phone", icon: Phone },
                  { value: "email", label: "Email", icon: Mail },
                ] as const).map((option) => {
                  const selected = watch("preferredContact") === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <input
                        type="radio"
                        value={option.value}
                        {...register("preferredContact")}
                        className="sr-only"
                      />
                      <option.icon
                        className={`w-4 h-4 ${selected ? "text-primary" : "text-dark-400"}`}
                      />
                      <span
                        className={`t-mono text-[0.45rem] ${
                          selected ? "text-primary font-medium" : "text-dark-500"
                        }`}
                      >
                        {option.label}
                      </span>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-dark-800">What car are you looking for?</h3>
              <p className="text-sm text-dark-500 mt-1">
                Tell us the brand and model you want
              </p>
            </div>

            {/* Brand Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Brand <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                {BRANDS.map((brand) => {
                  const selected = watchedBrand === brand;
                  return (
                    <label
                      key={brand}
                      className={`flex items-center justify-center px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                        selected
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "bg-white text-dark-600 border-gray-200 hover:border-gray-300"
                      }`}>
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
              label="Model (optional)"
              placeholder="e.g., Camry, Corolla, C-Class"
              leftIcon={<Car className="w-4 h-4" />}
              error={errors.model?.message}
              {...register("model")}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year From"
                type="number"
                placeholder="2018"
                leftIcon={<Calendar className="w-4 h-4" />}
                error={errors.yearFrom?.message}
                {...register("yearFrom")}
              />
              <Input
                label="Year To"
                type="number"
                placeholder="2024"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-dark-800">Fine-tune your preferences</h3>
              <p className="text-sm text-dark-500 mt-1">
                Optional details to help us find the perfect match
              </p>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Budget Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Min"
                  type="number"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  error={errors.budgetFrom?.message}
                  {...register("budgetFrom")}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  error={errors.budgetTo?.message}
                  {...register("budgetTo")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Transmission"
                options={[
                  { value: "any", label: "Any" },
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                  { value: "cvt", label: "CVT" },
                ]}
                {...register("transmission")}
              />
              <Select
                label="Fuel Type"
                options={[
                  { value: "any", label: "Any" },
                  { value: "petrol", label: "Petrol" },
                  { value: "diesel", label: "Diesel" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "electric", label: "Electric" },
                ]}
                {...register("fuelType")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Condition"
                options={[
                  { value: "any", label: "Any" },
                  { value: "new", label: "New" },
                  { value: "used", label: "Used" },
                  { value: "certified", label: "Certified" },
                ]}
                {...register("condition")}
              />
              <Input
                label="Max Mileage (km)"
                type="number"
                placeholder="e.g., 50000"
                leftIcon={<Gauge className="w-4 h-4" />}
                error={errors.mileageMax?.message}
                {...register("mileageMax")}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">
                Preferred Color
              </label>
              <div className="flex flex-wrap gap-2">
                <label
                  className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                    !watch("color")
                      ? "bg-primary/5 text-primary border-primary/20"
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
                      className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                        selected
                          ? "bg-primary/5 text-primary border-primary/20"
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
                How soon do you need it?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  { value: "asap", label: "ASAP", desc: "Within days" },
                  { value: "1week", label: "1 Week", desc: "Within 7 days" },
                  { value: "1month", label: "1 Month", desc: "Within 30 days" },
                  { value: "flexible", label: "Flexible", desc: "No rush" },
                ] as const).map((option) => {
                  const selected = watchedUrgency === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-all ${
                        selected
                          ? "border-primary bg-primary/5"
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
                        className={`w-4 h-4 ${selected ? "text-primary" : "text-dark-400"}`}
                      />
                      <span
                        className={`t-mono text-[0.45rem] font-semibold ${
                          selected ? "text-primary" : "text-dark-600"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-[10px] text-dark-400">{option.desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Additional Details (optional)"
              placeholder="Any specific features, trim level, or other requirements..."
              rows={3}
              error={errors.description?.message}
              {...register("description")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
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
            Submit Request
          </Button>
        )}
      </div>
    </form>
  );
}
