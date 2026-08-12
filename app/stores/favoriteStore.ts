import { create } from "zustand";

interface FavoriteState {
  favorites: string[];
  addFavorite: (carId: string) => void;
  removeFavorite: (carId: string) => void;
  toggleFavorite: (carId: string) => void;
  isFavorite: (carId: string) => boolean;
}

export const useFavorites = create<FavoriteState>((set, get) => ({
  favorites: (() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("lv-favorites") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  })(),

  addFavorite: (carId) =>
    set((state) => {
      const updated = [...state.favorites, carId];
      if (typeof window !== "undefined") {
        localStorage.setItem("lv-favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),

  removeFavorite: (carId) =>
    set((state) => {
      const updated = state.favorites.filter((id) => id !== carId);
      if (typeof window !== "undefined") {
        localStorage.setItem("lv-favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),

  toggleFavorite: (carId) => {
    const { favorites } = get();
    if (favorites.includes(carId)) {
      get().removeFavorite(carId);
    } else {
      get().addFavorite(carId);
    }
  },

  isFavorite: (carId) => get().favorites.includes(carId),
}));
