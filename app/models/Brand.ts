import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo?: string;
  country: string;
  carCount: number;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String },
    country: { type: String, required: true },
    carCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Brand = mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);
