"use client";

import { MessageCircle, Phone } from "lucide-react";
import { generateWhatsAppLink, generateCallLink } from "@/app/utils/format";

interface StickyContactProps {
  phone?: string;
  whatsapp?: string;
  carTitle?: string;
}

export function StickyContact({ phone, whatsapp, carTitle }: StickyContactProps) {
  const contactPhone = phone || "+2348171017509";
  const contactWhatsapp = whatsapp || contactPhone;
  const message = carTitle
    ? `Hello, I'm interested in the ${carTitle}. Is it still available?`
    : "Hello, I'm interested in a car on your website.";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/80 md:hidden">
      <div className="flex items-center">
        <a
          href={generateCallLink(contactPhone)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-dark-500 hover:text-dark-800 hover:bg-gray-50 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <div className="w-px h-8 bg-gray-200" />
        <a
          href={generateWhatsAppLink(contactWhatsapp, message)}
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
