import { generateWhatsAppLink, generateCallLink } from "@/app/utils/format";

/**
 * Single source of truth for the LegitAutos dealership identity and contact details.
 *
 * All public CTAs (call / WhatsApp / email links, footer, car cards, car detail,
 * JSON-LD) must read from this module instead of hardcoding values.
 *
 * The defaults below are the dealership's verified contact details as used on the
 * live site. They can be overridden per environment via NEXT_PUBLIC_* variables —
 * never invent new values here.
 */
export const dealership = {
  name: "LegitAutos",
  legalName: "Legit Ventures",
  tagline: "Quality used cars from one trusted dealership",
  description:
    "LegitAutos is a car dealership offering quality used and new vehicles. Browse our inventory, compare options, and talk to our team about any car.",
  /** Primary phone shown to customers (display format). */
  phone: process.env.NEXT_PUBLIC_DEALERSHIP_PHONE || "+234 817 101 7509",
  /** WhatsApp number in international digits (no +, spaces). */
  whatsapp: process.env.NEXT_PUBLIC_DEALERSHIP_WHATSAPP || "+2348171017509",
  email: process.env.NEXT_PUBLIC_DEALERSHIP_EMAIL || "legitventure04@gmail.com",
  address: {
    area: "Victoria Island",
    city: "Lagos",
    country: "Nigeria",
    get display(): string {
      return `${this.area}, ${this.city}, ${this.country}`;
    },
  },
  openingHours: "Mon - Sat: 8AM - 6PM WAT",
  /** Verified social profiles only — leave empty until confirmed by the owner. */
  socials: [] as { label: string; url: string }[],
  siteUrl:
    process.env.NEXT_PUBLIC_APP_URL || "https://legitautomobile.com",
} as const;

/** WhatsApp deep link to the dealership, optionally with a prefilled message. */
export function dealershipWhatsApp(message?: string): string {
  return generateWhatsAppLink(
    dealership.whatsapp,
    message ?? "Hello, I'm interested in a car on the LegitAutos website."
  );
}

/** tel: link to the dealership. */
export function dealershipCall(): string {
  return generateCallLink(dealership.phone);
}

/** mailto: link to the dealership. */
export function dealershipEmail(subject?: string): string {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${dealership.email}${query}`;
}

/** Short label used in nav/footer branding, e.g. under the logo. */
export const dealershipShortLabel = "Car Dealership";
