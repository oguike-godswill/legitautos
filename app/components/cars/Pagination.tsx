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
        className="flex items-center gap-1 px-3 py-2.5 rounded-lg t-mono text-[0.5rem] border border-gray-200 text-dark-500 hover:text-dark-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
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
                className={`w-10 h-10 rounded-lg t-mono text-[0.5rem] transition-colors ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "text-dark-500 hover:text-dark-700 hover:bg-gray-100"
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
        className="flex items-center gap-1 px-3 py-2.5 rounded-lg t-mono text-[0.5rem] border border-gray-200 text-dark-500 hover:text-dark-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[44px]"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
