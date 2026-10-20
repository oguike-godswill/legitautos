"use client";

import { MessageCircle, Phone } from "lucide-react";
import { generateWhatsAppLink, generateCallLink } from "@/app/utils/format";
import { dealership } from "@/app/config/dealership";

interface StickyContactProps {
  carTitle?: string;
}

export function StickyContact({ carTitle }: StickyContactProps) {
  const message = carTitle
    ? `Hello, I'm interested in the ${carTitle} listed on the ${dealership.name} website. Is it still available?`
    : `Hello, I'm interested in a car on the ${dealership.name} website.`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/80 md:hidden">
      <div className="flex items-center">
        <a
          href={generateCallLink(dealership.phone)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-dark-500 hover:text-dark-800 hover:bg-gray-50 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call Dealership
        </a>
        <div className="w-px h-8 bg-gray-200" />
        <a
          href={generateWhatsAppLink(dealership.whatsapp, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#25D366] bg-[#128C7E]/5 hover:bg-[#128C7E]/10 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
