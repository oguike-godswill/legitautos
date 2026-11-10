"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-dark-900 mb-2">Message Received!</h3>
        <p className="text-sm text-dark-500 max-w-sm mx-auto mb-6">
          Thank you for contacting LegitAutos. Our Lagos showroom team will review your message and respond shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sm font-bold text-teal hover:underline transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-dark-700 mb-1.5">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            required
            minLength={2}
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-dark-700 mb-1.5">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-semibold text-dark-700 mb-1.5">
            Phone / WhatsApp Number
          </label>
          <input
            id="contact-phone"
            name="phone"
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="block text-sm font-semibold text-dark-700 mb-1.5">
            Subject <span className="text-danger">*</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            required
            minLength={2}
            placeholder="e.g., Inspection Booking / Trade-In"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-dark-700 mb-1.5">
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="Tell us which vehicle or service you're inquiring about..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-danger font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-ink text-white text-sm font-bold rounded-xl hover:bg-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {isSubmitting ? "Sending Message..." : "Send Message"}
      </button>
    </form>
  );
}
