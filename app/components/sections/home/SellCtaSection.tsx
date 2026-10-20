"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";

/**
 * Dark CTA band: sell/trade-in enquiry + direct WhatsApp contact.
 * All contact values come from the central dealership config.
 */
export function SellCtaSection() {
  return (
    <section className="py-16 px-2 sm:px-8 lg:px-12 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-ink rounded-2xl p-6 sm:p-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-teal/25 transition-colors duration-700" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base sm:text-3xl font-bold text-white mb-3 uppercase">
              Sell or Trade In
            </h3>
            <p className="text-white/60 mb-8 max-w-sm leading-relaxed text-sm">
              Have a car to sell or trade in? Share the details and our team will
              get back to you to discuss your options.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-ink text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start an Enquiry <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="bg-gradient-to-br from-[#128C7E]/8 to-[#25D366]/5 border border-[#128C7E]/15 rounded-2xl p-6 sm:p-10 group"
        >
          <div className="w-12 h-12 bg-[#128C7E]/15 rounded-xl flex items-center justify-center mb-6">
            <MessageCircle className="w-6 h-6 text-[#25D366]" />
          </div>
          <h3 className="text-base sm:text-3xl font-bold text-dark-900 mb-3 uppercase">
            Need Help?
          </h3>
          <p className="text-dark-500 mb-8 max-w-sm leading-relaxed text-sm">
            Chat with the {dealership.name} team on WhatsApp. We&apos;ll help you
            find the right car. Available {dealership.openingHours}.
          </p>
          <a
            href={dealershipWhatsApp(
              `Hello, I'm looking for a car on the ${dealership.name} website.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#128C7E] text-white text-sm font-bold rounded-lg hover:bg-[#0e7a6e] transition-colors"
          >
            <Phone className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
