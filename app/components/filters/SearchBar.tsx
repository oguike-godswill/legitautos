"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useFilterStore } from "@/app/stores/filterStore";

export function SearchBar() {
  const search = useFilterStore((state) => state.search);
  const setSearch = useFilterStore((state) => state.setSearch);
  const [inputValue, setInputValue] = useState(search || "");

  const debouncedSetSearch = useCallback(
    (value: string) => {
      setSearch(value);
    },
    [setSearch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSetSearch(inputValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, debouncedSetSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by brand, model, or keyword..."
        className="w-full pl-10 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-300"
      />
      {inputValue && (
        <button
          onClick={() => {
            setInputValue("");
            setSearch("");
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-dark-400" />
        </button>
      )}
    </div>
  );
}
