import { dealership } from "./dealership";

/**
 * Shared FAQ copy for the storefront.
 *
 * Kept in one place so the homepage and contact page never drift apart, and so
 * every answer can be edited without hunting through components.
 *
 * Only include answers the dealership can stand behind — no invented policies,
 * warranties, financing terms, or delivery promises.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "How do I buy a car from LegitAutos?",
    answer:
      "Browse our inventory, find a car you like, and contact our team by phone or WhatsApp from the car's page. We'll confirm availability, share details, and arrange a viewing.",
  },
  {
    question: "Can I sell or trade in my car to LegitAutos?",
    answer:
      "Yes. Visit our Sell or Trade In page and share your car's details. Our team will review it and get back to you to discuss purchase or trade-in options.",
  },
  {
    question: "Are the cars on the website available?",
    answer:
      "Every car page shows its current status — available, reserved, or sold. If a car is marked available, contact us to confirm it's still in stock before visiting.",
  },
  {
    question: "Where are you located?",
    answer: `${dealership.address.display}. Viewings are by appointment — call or message us on WhatsApp to arrange a time during ${dealership.openingHours}.`,
  },
];
