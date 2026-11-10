"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFilterStore } from "@/app/stores/filterStore";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const setPage = useFilterStore((state) => state.setPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter((page) => {
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <div className="flex items-center justify-center gap-2 mt-6 sm:mt-10 overflow-x-auto pb-2">
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={!hasPrevPage}
        className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg t-mono text-xs font-bold border border-[#0C0C0E]/15 text-[#52504D] hover:text-[#0C0C0E] hover:bg-[#EFECE6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Prev
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 sm:px-2 py-2 t-mono text-[0.5rem] text-dark-300">
                  ...
                </span>
              )}
              <button
                onClick={() => setPage(page)}
                className={`w-10 h-10 rounded-lg t-mono text-xs font-bold transition-colors ${
                  page === currentPage
                    ? "bg-[#0C0C0E] text-white"
                    : "text-[#52504D] hover:text-[#0C0C0E] hover:bg-[#EFECE6]"
                }`}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center gap-1 px-3.5 py-2.5 rounded-lg t-mono text-xs font-bold border border-[#0C0C0E]/15 text-[#52504D] hover:text-[#0C0C0E] hover:bg-[#EFECE6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
