import mongoose, { Schema } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "replied"], default: "new", index: true },
  },
  { timestamps: true }
);

ContactMessageSchema.index({ status: 1, createdAt: -1 });

export const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
