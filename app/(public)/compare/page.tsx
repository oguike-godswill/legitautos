import { Metadata } from "next";
import { CompareContent } from "./CompareContent";

export const metadata: Metadata = {
  title: "Compare Cars",
  description: "Compare up to 3 cars side by side. Check specs, prices, and features.",
  openGraph: {
    title: "Compare Cars | LegitAutos",
    description: "Compare up to 3 cars side by side.",
    url: "https://legitautomobile.com/compare",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://legitautomobile.com/compare",
  },
};

export default function ComparePage() {
  return <CompareContent />;
}

