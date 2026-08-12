"use client";

import { Suspense } from "react";
import CarsPageContent from "./CarsPageContent";

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center">
          <div className="text-dark-500">Loading...</div>
        </div>
      }
    >
      <CarsPageContent />
    </Suspense>
  );
}
