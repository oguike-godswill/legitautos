import { z } from "zod";

export const carRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Valid phone number required").max(20),
  whatsapp: z.string().optional(),
  preferredContact: z.enum(["phone", "whatsapp", "email"]),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().optional(),
  yearFrom: z.string().optional(),
  yearTo: z.string().optional(),
  transmission: z.enum(["automatic", "manual", "cvt", "any"]),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "any"]),
  budgetFrom: z.string().optional(),
  budgetTo: z.string().optional(),
  condition: z.enum(["new", "used", "certified", "any"]),
  color: z.string().optional(),
  mileageMax: z.string().optional(),
  description: z.string().max(500, "Description too long").optional(),
  urgency: z.enum(["asap", "1week", "1month", "flexible"]),
});

export type CarRequestFormData = z.infer<typeof carRequestSchema>;

export interface CarRequest {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  preferredContact: "phone" | "whatsapp" | "email";
  brand: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  transmission: string;
  fuelType: string;
  budgetFrom?: number;
  budgetTo?: number;
  condition: string;
  color?: string;
  mileageMax?: number;
  description?: string;
  urgency: string;
  status: "pending" | "contacted" | "fulfilled" | "closed";
  createdAt: string;
  updatedAt: string;
}
