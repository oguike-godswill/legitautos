import { Car, CarFilters, PaginatedCars, Brand, Inspection, PaginatedInspections } from "@/app/types";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "";

/**
 * Admin API calls return 401 once the session cookie expires. Send the user
 * back to the login page instead of surfacing a generic failure.
 */
function handleUnauthorized() {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin/login")) return;
  window.location.href = "/admin/login";
}

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

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
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

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
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

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
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

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to upload image");
  }
  return res.json();
}

/**
 * Uploads an inspection video or photo. Kept separate from uploadImage because
 * inspection media is stored at its own aspect ratio rather than cropped to the
 * 3:2 shape the inventory cards use.
 */
export async function uploadInspectionMedia(file: File): Promise<{
  type: "video" | "image";
  url: string;
  publicId: string;
  thumbnailUrl?: string;
  duration?: number;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload/inspection`, {
    method: "POST",
    body: formData,
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to upload media");
  }
  return res.json();
}

/** Published inspection media, newest or highest-priority first. */
export async function fetchInspections(filters?: {
  car?: string;
  type?: "video" | "image";
  limit?: number;
  page?: number;
}): Promise<PaginatedInspections> {
  const params = new URLSearchParams();

  if (filters?.car) params.set("car", filters.car);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.limit) params.set("limit", filters.limit.toString());
  if (filters?.page) params.set("page", filters.page.toString());

  const res = await fetch(`${API_BASE}/api/inspections?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch inspection media");
  return res.json();
}

export async function fetchInspection(id: string): Promise<{ inspection: Inspection }> {
  const res = await fetch(`${API_BASE}/api/inspections/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch inspection media");
  return res.json();
}

export async function createInspection(data: unknown): Promise<{ inspection: Inspection }> {
  const res = await fetch(`${API_BASE}/api/inspections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to save inspection media");
  }
  return res.json();
}

export async function updateInspection(
  id: string,
  data: unknown
): Promise<{ inspection: Inspection }> {
  const res = await fetch(`${API_BASE}/api/inspections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to update inspection media");
  }
  return res.json();
}

export async function deleteInspection(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/inspections/${id}`, {
    method: "DELETE",
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session expired. Please sign in again.");
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to delete inspection media");
  }
}
