"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  Home,
  CarFront,
  Heart,
  Scale,
  PlusCircle,
} from "lucide-react";
import { useFavorites } from "@/app/stores/favoriteStore";
import { useCompare } from "@/app/stores/compareStore";
import { useUIStore } from "@/app/stores/uiStore";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { compareList } = useCompare();
  const { setSavedDrawerOpen, savedDrawerOpen } = useUIStore();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Hide on Admin pages or individual Car Detail page (which has its own StickyContact CTA bar)
  if (
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/cars/") && pathname !== "/cars")
  ) {
    return null;
  }

  const favCount = mounted ? favorites.length : 0;
  const cmpCount = mounted ? compareList.length : 0;

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-dark-900/10 bg-white/95 backdrop-blur-lg md:hidden pb-safe"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1.5 text-[0.68rem] font-semibold transition-colors ${
            pathname === "/" ? "text-teal" : "text-dark-500 hover:text-dark-900"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/cars"
          className={`flex flex-col items-center justify-center gap-1 py-1.5 text-[0.68rem] font-semibold transition-colors ${
            pathname === "/cars"
              ? "text-teal"
              : "text-dark-500 hover:text-dark-900"
          }`}
        >
          <CarFront className="h-5 w-5" />
          <span>Inventory</span>
        </Link>

        <button
          type="button"
          onClick={() => setSavedDrawerOpen(!savedDrawerOpen)}
          className={`relative flex flex-col items-center justify-center gap-1 py-1.5 text-[0.68rem] font-semibold transition-colors ${
            savedDrawerOpen
              ? "text-teal"
              : "text-dark-500 hover:text-dark-900"
          }`}
        >
          <div className="relative">
            <Heart className="h-5 w-5" />
            {favCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[0.6rem] font-bold text-white">
                {favCount}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        <Link
          href="/compare"
          className={`relative flex flex-col items-center justify-center gap-1 py-1.5 text-[0.68rem] font-semibold transition-colors ${
            pathname === "/compare"
              ? "text-teal"
              : "text-dark-500 hover:text-dark-900"
          }`}
        >
          <div className="relative">
            <Scale className="h-5 w-5" />
            {cmpCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal px-1 text-[0.6rem] font-bold text-white">
                {cmpCount}
              </span>
            )}
          </div>
          <span>Compare</span>
        </Link>

        <Link
          href="/sell"
          className={`flex flex-col items-center justify-center gap-1 py-1.5 text-[0.68rem] font-semibold transition-colors ${
            pathname === "/sell" || pathname === "/request"
              ? "text-teal"
              : "text-dark-500 hover:text-dark-900"
          }`}
        >
          <PlusCircle className="h-5 w-5" />
          <span>Sell / Trade</span>
        </Link>
      </div>
    </nav>
  );
}
