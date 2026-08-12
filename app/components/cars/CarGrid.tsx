"use client";

import { CarCard } from "./CarCard";
import { Car } from "@/app/types";
import { Car as CarIcon } from "lucide-react";

interface CarGridProps {
  cars: Car[];
}

export function CarGrid({ cars }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CarIcon className="w-6 h-6 text-dark-300" />
        </div>
        <h3 className="text-sm font-semibold text-dark-500">No cars found</h3>
        <p className="text-xs text-dark-400 mt-1 max-w-sm">
          Try adjusting your filters or search for something different.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map((car, index) => (
        <CarCard key={car._id} car={car} index={index} />
      ))}
    </div>
  );
}
