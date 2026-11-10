import { create } from "zustand";

interface UIState {
  mobileMenuOpen: boolean;
  filterDrawerOpen: boolean;
  savedDrawerOpen: boolean;
  commandSearchOpen: boolean;
  imageGalleryOpen: boolean;
  selectedImageIndex: number;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setFilterDrawerOpen: (open: boolean) => void;
  toggleFilterDrawer: () => void;
  setSavedDrawerOpen: (open: boolean) => void;
  toggleSavedDrawer: () => void;
  setCommandSearchOpen: (open: boolean) => void;
  toggleCommandSearch: () => void;
  setImageGalleryOpen: (open: boolean) => void;
  setSelectedImageIndex: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  filterDrawerOpen: false,
  savedDrawerOpen: false,
  commandSearchOpen: false,
  imageGalleryOpen: false,
  selectedImageIndex: 0,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setFilterDrawerOpen: (open) => set({ filterDrawerOpen: open }),
  toggleFilterDrawer: () => set((state) => ({ filterDrawerOpen: !state.filterDrawerOpen })),
  setSavedDrawerOpen: (open) => set({ savedDrawerOpen: open }),
  toggleSavedDrawer: () => set((state) => ({ savedDrawerOpen: !state.savedDrawerOpen })),
  setCommandSearchOpen: (open) => set({ commandSearchOpen: open }),
  toggleCommandSearch: () => set((state) => ({ commandSearchOpen: !state.commandSearchOpen })),
  setImageGalleryOpen: (open) => set({ imageGalleryOpen: open }),
  setSelectedImageIndex: (index) => set({ selectedImageIndex: index }),
}));
