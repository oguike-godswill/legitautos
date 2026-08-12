"use client";

export function CarCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-gray-200/80 animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-5 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-3">
          <div className="h-3 bg-gray-100 rounded w-14" />
          <div className="h-3 bg-gray-100 rounded w-14" />
          <div className="h-3 bg-gray-100 rounded w-14" />
        </div>
        <div className="pt-2 border-t border-gray-100">
          <div className="h-9 bg-gray-100 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

export function CarDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="aspect-[16/10] bg-gray-100 rounded-xl" />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-video bg-gray-100 rounded-lg" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-7 bg-gray-100 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-18 bg-gray-100 rounded-lg" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 bg-gray-100 rounded w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
