"use client";

import { CarCard } from "@/app/components/cars/CarCard";
import { SectionHeader } from "./SectionHeader";
import { Car } from "@/app/types";

interface InventoryRowProps {
  eyebrow: string;
  title: string;
  description?: string;
  viewAllHref: string;
  viewAllLabel?: string;
  cars: Car[];
  /** Extra classes for the section element, e.g. to tune vertical padding. */
  className?: string;
}

export function InventoryRow({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel = "View All",
  cars,
  className = "",
}: InventoryRowProps) {
  if (cars.length === 0) return null;

  return (
    <section
      className={`border-t border-dark-900/[0.06] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          linkHref={viewAllHref}
          linkLabel={viewAllLabel}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.slice(0, 8).map((car, i) => (
            <CarCard key={car._id} car={car} index={i} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
