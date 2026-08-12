import mongoose, { Schema } from "mongoose";

export interface ICar {
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
  seller: {
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
  };
  status: "available" | "sold" | "reserved";
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    title: { type: String, required: true, index: "text" },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true, index: true },
    model: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    price: { type: Number, required: true, index: true },
    originalPrice: { type: Number },
    mileage: { type: Number, required: true, default: 0 },
    transmission: { type: String, enum: ["automatic", "manual", "cvt"], required: true, index: true },
    fuelType: { type: String, enum: ["petrol", "diesel", "hybrid", "electric"], required: true, index: true },
    engineSize: { type: String },
    color: { type: String, required: true },
    condition: { type: String, enum: ["new", "used", "certified"], required: true, index: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    images: [{ type: String }],
    location: { type: String, required: true, index: true },
    seller: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      whatsapp: { type: String },
      email: { type: String },
    },
    status: { type: String, enum: ["available", "sold", "reserved"], default: "available", index: true },
    featured: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CarSchema.index({ brand: 1, status: 1 });
CarSchema.index({ price: 1, status: 1 });
CarSchema.index({ year: -1, status: 1 });
CarSchema.index({ featured: -1, createdAt: -1 });
CarSchema.index({ status: 1, createdAt: -1 });

export const Car = mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
