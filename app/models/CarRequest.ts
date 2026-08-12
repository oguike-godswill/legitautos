import mongoose, { Schema } from "mongoose";

export interface ICarRequest {
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  preferredContact: "phone" | "whatsapp" | "email";
  brand: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  transmission?: "automatic" | "manual" | "cvt" | "any";
  fuelType?: "petrol" | "diesel" | "hybrid" | "electric" | "any";
  budgetFrom?: number;
  budgetTo?: number;
  condition?: "new" | "used" | "certified" | "any";
  color?: string;
  mileageMax?: number;
  description?: string;
  urgency: "asap" | "1week" | "1month" | "flexible";
  status: "pending" | "contacted" | "fulfilled" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const CarRequestSchema = new Schema<ICarRequest>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true, index: true },
    whatsapp: { type: String },
    preferredContact: { type: String, enum: ["phone", "whatsapp", "email"], default: "whatsapp" },
    brand: { type: String, required: true, index: true },
    model: { type: String, index: true },
    yearFrom: { type: Number, min: 1990 },
    yearTo: { type: Number, max: new Date().getFullYear() + 1 },
    transmission: { type: String, enum: ["automatic", "manual", "cvt", "any"], default: "any" },
    fuelType: { type: String, enum: ["petrol", "diesel", "hybrid", "electric", "any"], default: "any" },
    budgetFrom: { type: Number, min: 0 },
    budgetTo: { type: Number, min: 0 },
    condition: { type: String, enum: ["new", "used", "certified", "any"], default: "any" },
    color: { type: String },
    mileageMax: { type: Number, min: 0 },
    description: { type: String },
    urgency: { type: String, enum: ["asap", "1week", "1month", "flexible"], default: "flexible" },
    status: { type: String, enum: ["pending", "contacted", "fulfilled", "closed"], default: "pending", index: true },
  },
  { timestamps: true }
);

CarRequestSchema.index({ status: 1, createdAt: -1 });
CarRequestSchema.index({ brand: 1, status: 1 });

export const CarRequest = mongoose.models.CarRequest || mongoose.model<ICarRequest>("CarRequest", CarRequestSchema);
