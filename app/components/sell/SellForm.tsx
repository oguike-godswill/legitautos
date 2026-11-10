"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { CheckCircle2, Send, Repeat } from "lucide-react";
import Link from "next/link";
import { dealership } from "@/app/config/dealership";

export function SellForm() {
  const searchParams = useSearchParams();
  const tradeForParam = searchParams.get("tradeFor") || "";

  const [intent, setIntent] = useState<"sell" | "trade-in">(
    tradeForParam ? "trade-in" : "sell"
  );
  const [targetCar, setTargetCar] = useState(tradeForParam);
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

    const carLine = `${get("year")} ${get("brand")} ${get("model")} (${get(
      "condition"
    )}${get("mileage") ? `, ${get("mileage")} km` : ""})`;

    const lines = [
      `I would like to ${
        intent === "sell" ? "sell" : "trade in"
      } my car with ${dealership.name}.`,
      `Customer Car: ${carLine}`,
      intent === "trade-in" && targetCar
        ? `Target Showroom Car for Swap: ${targetCar}`
        : "",
      get("location") ? `Car location: ${get("location")}` : "",
      get("expectation") ? `Price expectation: ₦${get("expectation")}` : "",
      get("notes") ? `Notes: ${get("notes")}` : "",
    ].filter(Boolean);

    const payload = {
      name: get("name"),
      email: get("email") || "enquiry@legitautomobile.com",
      phone: get("phone"),
      subject: `${
        intent === "sell" ? "Sell" : "Trade-In"
      } Enquiry — ${carLine}`,
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
        <div className="w-16 h-16 bg-success-soft rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-extrabold text-dark-900 mb-3">
          Valuation Enquiry Received!
        </h3>
        <p className="text-sm text-dark-500 max-w-md mx-auto mb-8 leading-relaxed">
          Thank you. Our acquisition desk will review your vehicle details and
          contact you to schedule a physical inspection and discuss{" "}
          {intent === "sell" ? "an outright purchase" : "your trade-in swap"}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => {
              setIsSuccess(false);
            }}
            variant="ghost"
          >
            Submit Another Vehicle
          </Button>
          <Link href="/cars">
            <Button>Browse Showroom Inventory</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Intent Selector */}
      <fieldset>
        <legend className="block text-xs font-extrabold uppercase tracking-wider text-dark-500 mb-2">
          Select Transaction Type <span className="text-danger">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-dark-50 p-1.5">
          {(
            [
              { value: "sell", label: "Sell Outright for Cash" },
              { value: "trade-in", label: "Swap / Trade-In Car" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center px-4 py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
                intent === option.value
                  ? "bg-ink text-white shadow-xs"
                  : "text-dark-600 hover:text-dark-900"
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

      {intent === "trade-in" && (
        <div className="rounded-xl border border-teal/30 bg-teal/5 p-4">
          <label
            htmlFor="targetCar"
            className="flex items-center gap-1.5 text-xs font-bold text-teal mb-1.5"
          >
            <Repeat className="h-3.5 w-3.5" />
            Which LegitAutos car are you trading toward? (Optional)
          </label>
          <input
            id="targetCar"
            type="text"
            value={targetCar}
            onChange={(e) => setTargetCar(e.target.value)}
            placeholder="e.g. 2021 Lexus RX 350 or any SUV under ₦25M"
            className="w-full rounded-lg border border-teal/20 bg-white px-3.5 py-2 text-sm font-medium text-dark-900 focus:border-teal focus:outline-none"
          />
        </div>
      )}

      {/* Contact Details */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          required
          minLength={2}
          placeholder="Your full name"
        />
        <Input
          label="Phone / WhatsApp Number"
          name="phone"
          type="tel"
          required
          placeholder="+234 800 000 0000"
        />
      </div>
      <Input
        label="Email Address"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
      />

      {/* Vehicle Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Your Car Brand"
          name="brand"
          required
          placeholder="e.g. Toyota"
        />
        <Input
          label="Model & Trim"
          name="model"
          required
          placeholder="e.g. Camry XLE"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Model Year"
          name="year"
          type="number"
          required
          min={1995}
          max={new Date().getFullYear() + 1}
          placeholder="2019"
        />
        <Select
          label="Usage History"
          name="condition"
          options={[
            { value: "foreign-used", label: "Foreign Used (Tokunbo)" },
            { value: "nigerian-used", label: "Nigerian Used (Registered)" },
            { value: "new", label: "Brand New" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Mileage (km, optional)"
          name="mileage"
          type="number"
          min={0}
          placeholder="65000"
        />
        <Input
          label="Current Location"
          name="location"
          placeholder="e.g. Lekki, Lagos"
        />
      </div>
      <Input
        label="Your Asking / Valuation Expectation (₦, optional)"
        name="expectation"
        type="number"
        min={0}
        placeholder="e.g. 12500000"
      />
      <Textarea
        label="Condition & Document Notes (optional)"
        name="notes"
        rows={3}
        placeholder="Share engine/gear condition, customs duty status, or service history..."
      />

      {error && <p className="text-sm font-semibold text-danger">{error}</p>}

      <Button
        type="submit"
        isLoading={isSubmitting}
        leftIcon={<Send className="w-4 h-4" />}
      >
        Submit Valuation Request
      </Button>
    </form>
  );
}
