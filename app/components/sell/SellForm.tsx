"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import { dealership } from "@/app/config/dealership";

/**
 * Sell / Trade-In enquiry form.
 *
 * This is a lead to the LegitAutos team — it does NOT create a public car
 * listing. Submissions go to the validated /api/contact endpoint and appear
 * in the dealership's message inbox.
 */
export function SellForm() {
  const [intent, setIntent] = useState<"sell" | "trade-in">("sell");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (key: string) => (fd.get(key) as string | null)?.trim() || "";

    const carLine = `${get("year")} ${get("brand")} ${get("model")} (${get("condition")}${
      get("mileage") ? `, ${get("mileage")} km` : ""
    })`;

    const lines = [
      `I would like to ${intent === "sell" ? "sell" : "trade in"} my car with ${dealership.name}.`,
      `Car: ${carLine}`,
      get("location") ? `Car location: ${get("location")}` : "",
      get("expectation") ? `Price expectation: ₦${get("expectation")}` : "",
      get("notes") ? `Notes: ${get("notes")}` : "",
    ].filter(Boolean);

    const payload = {
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      subject: `${intent === "sell" ? "Sell" : "Trade-In"} Enquiry — ${carLine}`,
      message: lines.join("\n"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send enquiry");
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or contact us directly."
      );
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
        <h3 className="text-xl font-bold text-dark-900 mb-3">Enquiry Received!</h3>
        <p className="text-sm text-dark-500 max-w-md mx-auto mb-8 leading-relaxed">
          Thank you. Our team will review your details and get back to you to
          discuss {intent === "sell" ? "a purchase" : "your trade-in"} — usually
          within one business day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => {
              setIsSuccess(false);
              setIntent("sell");
            }}
            variant="ghost"
          >
            Submit Another Enquiry
          </Button>
          <Link href="/cars">
            <Button>Browse Cars</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Intent */}
      <fieldset>
        <legend className="block text-sm font-medium text-dark-700 mb-2">
          I want to <span className="text-rose-500">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "sell", label: "Sell My Car" },
              { value: "trade-in", label: "Trade In" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all border ${
                intent === option.value
                  ? "bg-teal/10 text-teal border-teal/30"
                  : "bg-white text-dark-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="intent"
                value={option.value}
                checked={intent === option.value}
                onChange={() => setIntent(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Contact */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          required
          minLength={2}
          placeholder="Your name"
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          required
          placeholder="+234 800 000 0000"
        />
      </div>
      <Input label="Email (optional)" name="email" type="email" placeholder="you@example.com" />

      {/* Car */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Car Brand" name="brand" required placeholder="e.g. Toyota" />
        <Input label="Model" name="model" required placeholder="e.g. Camry" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Year" name="year" type="number" required min={1990} max={new Date().getFullYear() + 1} placeholder="2018" />
        <Select
          label="Condition"
          name="condition"
          options={[
            { value: "new", label: "New" },
            { value: "used", label: "Used" },
            { value: "certified", label: "Certified" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Mileage (km, optional)" name="mileage" type="number" min={0} placeholder="65000" />
        <Input label="Location (optional)" name="location" placeholder="Lagos" />
      </div>
      <Input
        label="Your Price Expectation (optional)"
        name="expectation"
        type="number"
        min={0}
        placeholder="e.g. 4500000"
      />
      <Textarea
        label="Anything else? (optional)"
        name="notes"
        rows={3}
        placeholder="Condition details, history, or questions for our team..."
      />

      <p className="text-xs text-dark-400 leading-relaxed">
        By submitting, you agree to be contacted by the {dealership.name} team
        about your enquiry. We use your details only to respond to you.
      </p>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
        Send Enquiry
      </Button>
    </form>
  );
}
