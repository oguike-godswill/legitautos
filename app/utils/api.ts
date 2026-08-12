import { Car, CarFilters, PaginatedCars, Brand } from "@/app/types";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "";

export async function fetchCars(filters?: CarFilters): Promise<PaginatedCars> {
  const params = new URLSearchParams();

  if (filters?.search) params.set("search", filters.search);
  if (filters?.brand?.length) params.set("brand", filters.brand.join(","));
  if (filters?.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
  if (filters?.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
  if (filters?.minYear !== undefined) params.set("minYear", filters.minYear.toString());
  if (filters?.maxYear !== undefined) params.set("maxYear", filters.maxYear.toString());
  if (filters?.transmission?.length) params.set("transmission", filters.transmission.join(","));
  if (filters?.fuelType?.length) params.set("fuelType", filters.fuelType.join(","));
  if (filters?.condition?.length) params.set("condition", filters.condition.join(","));
  if (filters?.sortBy) params.set("sortBy", filters.sortBy);
  if (filters?.page) params.set("page", filters.page.toString());
  if (filters?.limit) params.set("limit", filters.limit.toString());

  const res = await fetch(`${API_BASE}/api/cars?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json();
}

export async function fetchCar(id: string): Promise<{ car: Car }> {
  const res = await fetch(`${API_BASE}/api/cars/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch car");
  return res.json();
}

export async function fetchFeaturedCars(): Promise<PaginatedCars> {
  const res = await fetch(`${API_BASE}/api/cars?featured=true&limit=6`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error("Failed to fetch featured cars");
  return res.json();
}

export async function fetchBrands(): Promise<{ brands: Brand[] }> {
  const res = await fetch(`${API_BASE}/api/brands`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch brands");
  return res.json();
}

export async function createCar(data: unknown): Promise<{ car: Car }> {
  const res = await fetch(`${API_BASE}/api/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create car");
  }
  return res.json();
}

export async function updateCar(id: string, data: unknown): Promise<{ car: Car }> {
  const res = await fetch(`${API_BASE}/api/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update car");
  }
  return res.json();
}

export async function deleteCar(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/cars/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete car");
  }
}

export async function fetchSimilarCars(id: string): Promise<{ cars: Car[] }> {
  const res = await fetch(`${API_BASE}/api/cars/${id}/similar`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch similar cars");
  return res.json();
}

export async function uploadImage(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to upload image");
  }
  return res.json();
}
