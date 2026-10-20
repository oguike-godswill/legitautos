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

/**
 * Standard homepage inventory row: section header plus a 5-up grid on large
 * screens. Shows at most ten cars so the two rows always fill completely.
 */
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
      className={`border-t border-dark-900/[0.06] py-16 sm:py-20 px-2 sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          linkHref={viewAllHref}
          linkLabel={viewAllLabel}
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {cars.slice(0, 10).map((car, i) => (
            <CarCard key={car._id} car={car} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
