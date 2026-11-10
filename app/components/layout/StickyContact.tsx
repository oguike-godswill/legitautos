"use client";

import { MessageCircle, Phone, CalendarCheck } from "lucide-react";
import { formatPrice } from "@/app/utils/format";
import { dealership, dealershipWhatsApp, dealershipCall } from "@/app/config/dealership";

interface StickyContactProps {
  carTitle?: string;
  price?: number;
  onBookViewing?: () => void;
}

export function StickyContact({
  carTitle,
  price,
  onBookViewing,
}: StickyContactProps) {
  const message = carTitle
    ? `Hello, I'm interested in the ${carTitle}${
        price ? ` (${formatPrice(price)})` : ""
      } listed on the ${dealership.name} website. Is it still available?`
    : `Hello, I'm interested in a car on the ${dealership.name} website.`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-dark-900/10 bg-white/95 backdrop-blur-lg md:hidden pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 px-3 py-2.5">
        {price ? (
          <div className="min-w-0 pr-2">
            <span className="block text-[0.62rem] font-bold uppercase tracking-wider text-dark-400">
              Asking Price
            </span>
            <span className="block truncate text-sm font-extrabold text-dark-900">
              {formatPrice(price)}
            </span>
          </div>
        ) : null}

        <div className="ml-auto flex flex-1 items-center justify-end gap-2">
          {onBookViewing && (
            <button
              type="button"
              onClick={onBookViewing}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-dark-200 bg-dark-50 px-3 py-2.5 text-xs font-bold text-dark-800 hover:bg-dark-100 transition-colors"
            >
              <CalendarCheck className="h-4 w-4 text-teal" />
              Inspect
            </button>
          )}
          <a
            href={dealershipCall()}
            aria-label="Call Dealership"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-200 text-dark-800 hover:bg-dark-50 transition-colors"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href={dealershipWhatsApp(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#128C7E] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0e7a6e] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
