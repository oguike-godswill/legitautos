"use client";

import Link from "next/link";
import { useCompare } from "@/app/stores/compareStore";
import { Scale, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 max-w-[calc(100vw-2rem)] overflow-x-auto">
      <div className="flex items-center gap-2 shrink-0">
        <Scale className="w-4 h-4 text-dark-400" />
        <span className="t-mono text-[0.5rem] text-dark-500">
          {compareList.length}/3
        </span>
      </div>

      <div className="w-px h-6 bg-gray-200 shrink-0" />

      <div className="flex items-center gap-2">
        {compareList.map((id) => (
          <div
            key={id}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200"
          >
            <span className="t-mono text-[0.45rem] text-dark-500 max-w-[60px] truncate">
              {id.slice(0, 6)}...
            </span>
            <button
              onClick={() => removeFromCompare(id)}
              className="w-6 h-6 flex items-center justify-center text-dark-400 hover:text-dark-600 transition-colors"
              aria-label="Remove from compare"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-200 shrink-0" />

      <Link
        href="/compare"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark hover:bg-primary text-white t-mono text-[0.5rem] transition-all shrink-0"
      >
        Compare
        <ArrowRight className="w-3 h-3" />
      </Link>

      <button
        onClick={clearCompare}
        className="w-7 h-7 flex items-center justify-center text-dark-400 hover:text-dark-600 transition-colors shrink-0"
        aria-label="Clear compare"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
