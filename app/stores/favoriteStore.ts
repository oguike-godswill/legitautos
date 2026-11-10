import { create } from "zustand";

export interface RecentlyViewedItem {
  _id: string;
  slug?: string;
  title: string;
  price: number;
  image?: string;
}

interface FavoriteState {
  favorites: string[];
  addFavorite: (carId: string) => void;
  removeFavorite: (carId: string) => void;
  toggleFavorite: (carId: string) => void;
  clearFavorites: () => void;
  isFavorite: (carId: string) => boolean;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addRecentlyViewed: (item: RecentlyViewedItem) => void;
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
      if (state.favorites.includes(carId)) return state;
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

  clearFavorites: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lv-favorites");
    }
    set({ favorites: [] });
  },

  isFavorite: (carId) => get().favorites.includes(carId),
}));

export const useRecentlyViewed = create<RecentlyViewedState>((set) => ({
  items: (() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("lv-recently-viewed") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  })(),

  addRecentlyViewed: (item) =>
    set((state) => {
      const filtered = state.items.filter((i) => i._id !== item._id);
      const updated = [item, ...filtered].slice(0, 6);
      if (typeof window !== "undefined") {
        localStorage.setItem("lv-recently-viewed", JSON.stringify(updated));
      }
      return { items: updated };
    }),
}));
