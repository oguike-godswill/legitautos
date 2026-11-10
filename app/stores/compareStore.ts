import { create } from "zustand";

export interface CompareCarSummary {
  _id: string;
  slug?: string;
  title: string;
  price: number;
  year: number;
  image?: string;
}

interface CompareState {
  compareList: string[];
  compareSummaries: Record<string, CompareCarSummary>;
  addToCompare: (carId: string, summary?: CompareCarSummary) => void;
  removeFromCompare: (carId: string) => void;
  clearCompare: () => void;
  isInCompare: (carId: string) => boolean;
}

export const useCompare = create<CompareState>((set, get) => ({
  compareList: (() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("lv-compare") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  })(),

  compareSummaries: (() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("lv-compare-summaries") || "{}");
      } catch {
        return {};
      }
    }
    return {};
  })(),

  addToCompare: (carId, summary) =>
    set((state) => {
      if (state.compareList.includes(carId) || state.compareList.length >= 3) {
        return state;
      }
      const updated = [...state.compareList, carId];
      const updatedSummaries = summary
        ? { ...state.compareSummaries, [carId]: summary }
        : state.compareSummaries;
      if (typeof window !== "undefined") {
        localStorage.setItem("lv-compare", JSON.stringify(updated));
        localStorage.setItem("lv-compare-summaries", JSON.stringify(updatedSummaries));
      }
      return { compareList: updated, compareSummaries: updatedSummaries };
    }),

  removeFromCompare: (carId) =>
    set((state) => {
      const updated = state.compareList.filter((id) => id !== carId);
      const updatedSummaries = { ...state.compareSummaries };
      delete updatedSummaries[carId];
      if (typeof window !== "undefined") {
        localStorage.setItem("lv-compare", JSON.stringify(updated));
        localStorage.setItem("lv-compare-summaries", JSON.stringify(updatedSummaries));
      }
      return { compareList: updated, compareSummaries: updatedSummaries };
    }),

  clearCompare: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lv-compare");
      localStorage.removeItem("lv-compare-summaries");
    }
    set({ compareList: [], compareSummaries: {} });
  },

  isInCompare: (carId) => get().compareList.includes(carId),
}));
