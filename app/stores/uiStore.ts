import { create } from "zustand";

interface UIState {
  mobileMenuOpen: boolean;
  filterDrawerOpen: boolean;
  imageGalleryOpen: boolean;
  selectedImageIndex: number;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setFilterDrawerOpen: (open: boolean) => void;
  toggleFilterDrawer: () => void;
  setImageGalleryOpen: (open: boolean) => void;
  setSelectedImageIndex: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  filterDrawerOpen: false,
  imageGalleryOpen: false,
  selectedImageIndex: 0,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setFilterDrawerOpen: (open) => set({ filterDrawerOpen: open }),
  toggleFilterDrawer: () => set((state) => ({ filterDrawerOpen: !state.filterDrawerOpen })),
  setImageGalleryOpen: (open) => set({ imageGalleryOpen: open }),
  setSelectedImageIndex: (index) => set({ selectedImageIndex: index }),
}));
