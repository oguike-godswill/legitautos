import { Metadata } from "next";
import { CompareContent } from "./CompareContent";

export const metadata: Metadata = {
  title: "Compare Cars — LegitAutos Autos",
  description: "Compare up to 3 cars side by side. Check specs, prices, and features.",
};

export default function ComparePage() {
  return <CompareContent />;
}

