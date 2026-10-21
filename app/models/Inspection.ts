import mongoose, { Schema } from "mongoose";

/**
 * Inspection media: walkaround videos and photos the dealership records of its
 * own stock. This is proof-of-condition content, so every clip should be real
 * footage of the car it is attached to.
 */
export interface IInspection {
  title: string;
  /** Optional longer note shown under the title. */
  description?: string;
  type: "video" | "image";
  /** Cloudinary secure URL for the media file. */
  url: string;
  /** Cloudinary public id, kept so the asset can be deleted later. */
  publicId?: string;
  /** Cloudinary poster frame for videos. */
  thumbnailUrl?: string;
  /** Length in seconds; videos only. */
  duration?: number;
  /**
   * The car this inspection belongs to, when it covers a specific listing.
   * General lot tours or workshop clips can be left unattached.
   */
  car?: mongoose.Types.ObjectId;
  /** Denormalised car title so listings survive a car being deleted. */
  carTitle?: string;
  /** Controls homepage ordering; higher sorts first. */
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InspectionSchema = new Schema<IInspection>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ["video", "image"], required: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String },
    thumbnailUrl: { type: String },
    duration: { type: Number },
    car: { type: Schema.Types.ObjectId, ref: "Car", index: true },
    carTitle: { type: String },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

InspectionSchema.index({ published: 1, order: -1, createdAt: -1 });
InspectionSchema.index({ car: 1, published: 1, createdAt: -1 });

export const Inspection =
  mongoose.models.Inspection ||
  mongoose.model<IInspection>("Inspection", InspectionSchema);
