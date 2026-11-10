import { create } from "zustand";
import { CarFilters } from "@/app/types";

interface FilterState extends CarFilters {
  filterDrawerOpen: boolean;
  viewMode: "grid" | "compact";
  setFilterDrawerOpen: (open: boolean) => void;
  setViewMode: (mode: "grid" | "compact") => void;
  setSearch: (search: string) => void;
  setBrand: (brand: string[]) => void;
  toggleBrand: (brand: string) => void;
  setBodyType: (bodyType: string[]) => void;
  toggleBodyType: (bodyType: string) => void;
  setPriceRange: (min: number | undefined, max: number | undefined) => void;
  setYearRange: (min: number | undefined, max: number | undefined) => void;
  setMaxMileage: (maxMileage: number | undefined) => void;
  setTransmission: (transmission: string[]) => void;
  toggleTransmission: (transmission: string) => void;
  setFuelType: (fuelType: string[]) => void;
  toggleFuelType: (fuelType: string) => void;
  setCondition: (condition: string[]) => void;
  toggleCondition: (condition: string) => void;
  setStatus: (status: CarFilters["status"]) => void;
  setSortBy: (sortBy: CarFilters["sortBy"]) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  getQueryString: () => string;
}

const initialState: CarFilters = {
  search: undefined,
  brand: undefined,
  bodyType: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minYear: undefined,
  maxYear: undefined,
  maxMileage: undefined,
  transmission: undefined,
  fuelType: undefined,
  condition: undefined,
  status: undefined,
  sortBy: "newest",
  page: 1,
  limit: 12,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,
  filterDrawerOpen: false,
  viewMode: "grid",
  setFilterDrawerOpen: (open) => set({ filterDrawerOpen: open }),
  setViewMode: (viewMode) => set({ viewMode }),

  setSearch: (search) => set({ search: search || undefined, page: 1 }),

  setBrand: (brand) => set({ brand: brand.length > 0 ? brand : undefined, page: 1 }),

  toggleBrand: (brand) =>
    set((state) => {
      const current = state.brand || [];
      const updated = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      return { brand: updated.length > 0 ? updated : undefined, page: 1 };
    }),

  setBodyType: (bodyType) =>
    set({ bodyType: bodyType.length > 0 ? bodyType : undefined, page: 1 }),

  toggleBodyType: (bodyType) =>
    set((state) => {
      const current = state.bodyType || [];
      const updated = current.includes(bodyType)
        ? current.filter((b) => b !== bodyType)
        : [...current, bodyType];
      return { bodyType: updated.length > 0 ? updated : undefined, page: 1 };
    }),

  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),

  setYearRange: (min, max) => set({ minYear: min, maxYear: max, page: 1 }),

  setMaxMileage: (maxMileage) => set({ maxMileage, page: 1 }),

  setTransmission: (transmission) =>
    set({ transmission: transmission.length > 0 ? transmission : undefined, page: 1 }),

  toggleTransmission: (transmission) =>
    set((state) => {
      const current = state.transmission || [];
      const updated = current.includes(transmission)
        ? current.filter((t) => t !== transmission)
        : [...current, transmission];
      return { transmission: updated.length > 0 ? updated : undefined, page: 1 };
    }),

  setFuelType: (fuelType) =>
    set({ fuelType: fuelType.length > 0 ? fuelType : undefined, page: 1 }),

  toggleFuelType: (fuelType) =>
    set((state) => {
      const current = state.fuelType || [];
      const updated = current.includes(fuelType)
        ? current.filter((f) => f !== fuelType)
        : [...current, fuelType];
      return { fuelType: updated.length > 0 ? updated : undefined, page: 1 };
    }),

  setCondition: (condition) =>
    set({ condition: condition.length > 0 ? condition : undefined, page: 1 }),

  toggleCondition: (condition) =>
    set((state) => {
      const current = state.condition || [];
      const updated = current.includes(condition)
        ? current.filter((c) => c !== condition)
        : [...current, condition];
      return { condition: updated.length > 0 ? updated : undefined, page: 1 };
    }),

  setStatus: (status) => set({ status, page: 1 }),

  setSortBy: (sortBy) => set({ sortBy }),

  setPage: (page) => set({ page }),

  resetFilters: () => set({ ...initialState }),

  getQueryString: () => {
    const state = get();
    const params = new URLSearchParams();

    if (state.search) params.set("search", state.search);
    if (state.brand?.length) params.set("brand", state.brand.join(","));
    if (state.bodyType?.length) params.set("bodyType", state.bodyType.join(","));
    if (state.minPrice !== undefined) params.set("minPrice", state.minPrice.toString());
    if (state.maxPrice !== undefined) params.set("maxPrice", state.maxPrice.toString());
    if (state.minYear !== undefined) params.set("minYear", state.minYear.toString());
    if (state.maxYear !== undefined) params.set("maxYear", state.maxYear.toString());
    if (state.maxMileage !== undefined) params.set("maxMileage", state.maxMileage.toString());
    if (state.transmission?.length) params.set("transmission", state.transmission.join(","));
    if (state.fuelType?.length) params.set("fuelType", state.fuelType.join(","));
    if (state.condition?.length) params.set("condition", state.condition.join(","));
    if (state.status) params.set("status", state.status);
    if (state.sortBy && state.sortBy !== "newest") params.set("sortBy", state.sortBy);
    if (state.page && state.page > 1) params.set("page", state.page.toString());

    return params.toString();
  },
}));
