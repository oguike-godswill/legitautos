
export interface Car {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  transmission: "automatic" | "manual" | "cvt";
  fuelType: "petrol" | "diesel" | "hybrid" | "electric";
  engineSize?: string;
  color: string;
  condition: "new" | "used" | "certified";
  description: string;
  features: string[];
  images: string[];
  location: string;
  /** Legacy multi-vendor field, optional. See the Car model for details. */
  seller?: {
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
  };
  status: "available" | "sold" | "reserved";
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  search?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string[];
  fuelType?: string[];
  condition?: string[];
  sortBy?: "price-asc" | "price-desc" | "year-desc" | "year-asc" | "mileage-asc" | "newest";
  page?: number;
  limit?: number;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  country: string;
  carCount: number;
}

export interface PaginatedCars {
  cars: Car[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Inspection media attached to the dealership's own stock. `car` is present
 * only when the clip covers a specific listing.
 */
export interface Inspection {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "image";
  url: string;
  publicId?: string;
  thumbnailUrl?: string;
  duration?: number;
  car?: string;
  carTitle?: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedInspections {
  inspections: Inspection[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Testimonial {
  _id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  carBought: string;
  date: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}





