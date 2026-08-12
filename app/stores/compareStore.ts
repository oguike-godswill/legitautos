import { create } from "zustand";

interface CompareState {
  compareList: string[];
  addToCompare: (carId: string) => void;
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

  addToCompare: (carId) =>
    set((state) => {
      if (state.compareList.length >= 3) return state;
      const updated = [...state.compareList, carId];
      if (typeof window !== "undefined") {
        localStorage.setItem("lv-compare", JSON.stringify(updated));
      }
      return { compareList: updated };
    }),

  removeFromCompare: (carId) =>
    set((state) => {
      const updated = state.compareList.filter((id) => id !== carId);
      if (typeof window !== "undefined") {
        localStorage.setItem("lv-compare", JSON.stringify(updated));
      }
      return { compareList: updated };
    }),

  clearCompare: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lv-compare");
    }
    set({ compareList: [] });
  },

  isInCompare: (carId) => get().compareList.includes(carId),
}));
