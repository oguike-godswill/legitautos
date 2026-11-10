import mongoose, { Schema } from "mongoose";

export interface ICar {
  title: string;
  slug: string;
  brand: string;
  model: string;
  trim?: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  transmission: "automatic" | "manual" | "cvt";
  fuelType: "petrol" | "diesel" | "hybrid" | "electric";
  bodyType?: "suv" | "sedan" | "coupe" | "pickup" | "hatchback" | "van" | "convertible" | "wagon";
  drivetrain?: "fwd" | "rwd" | "awd" | "4wd";
  engineSize?: string;
  color: string;
  interiorColor?: string;
  condition: "new" | "used" | "certified" | "foreign-used" | "nigerian-used";
  customsPaid?: boolean;
  vin?: string;
  description: string;
  features: string[];
  images: string[];
  location: string;
  /**
   * Legacy multi-vendor field. Single-dealership inventory no longer records a
   * per-car seller — enquiries go to the dealership. Retained as optional so
   * older documents still validate.
   */
  seller?: {
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
    trim: { type: String },
    year: { type: Number, required: true, index: true },
    price: { type: Number, required: true, index: true },
    originalPrice: { type: Number },
    mileage: { type: Number, required: true, default: 0 },
    transmission: { type: String, enum: ["automatic", "manual", "cvt"], required: true, index: true },
    fuelType: { type: String, enum: ["petrol", "diesel", "hybrid", "electric"], required: true, index: true },
    bodyType: {
      type: String,
      enum: ["suv", "sedan", "coupe", "pickup", "hatchback", "van", "convertible", "wagon"],
      index: true,
    },
    drivetrain: {
      type: String,
      enum: ["fwd", "rwd", "awd", "4wd"],
    },
    engineSize: { type: String },
    color: { type: String, required: true },
    interiorColor: { type: String },
    condition: {
      type: String,
      enum: ["new", "used", "certified", "foreign-used", "nigerian-used"],
      required: true,
      index: true,
    },
    customsPaid: { type: Boolean, default: true },
    vin: { type: String },
    description: { type: String, required: true },
    features: [{ type: String }],
    images: [{ type: String }],
    location: { type: String, required: true, index: true },
    seller: {
      type: {
        name: { type: String },
        phone: { type: String },
        whatsapp: { type: String },
        email: { type: String },
      },
      required: false,
    },
    status: { type: String, enum: ["available", "sold", "reserved"], default: "available", index: true },
    featured: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CarSchema.index({ brand: 1, status: 1 });
CarSchema.index({ bodyType: 1, status: 1 });
CarSchema.index({ price: 1, status: 1 });
CarSchema.index({ year: -1, status: 1 });
CarSchema.index({ featured: -1, createdAt: -1 });
CarSchema.index({ status: 1, createdAt: -1 });

export const Car = mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
