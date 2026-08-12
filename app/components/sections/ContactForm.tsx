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
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-dark-900 mb-2">Message Sent!</h3>
        <p className="text-sm text-dark-500 max-w-sm mx-auto mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
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
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            name="name"
            required
            minLength={2}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-dark-900 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-dark-900 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Phone (optional)
          </label>
          <input
            name="phone"
            placeholder="+234 800 000 0000"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-dark-900 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1.5">
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            name="subject"
            required
            minLength={2}
            placeholder="How can we help?"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-dark-900 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-1.5">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="Tell us more..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-dark-900 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-rose-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
