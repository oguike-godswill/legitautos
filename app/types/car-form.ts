import { z } from "zod";

export const carFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(100000, "Price must be at least ₦100,000"),
  originalPrice: z.coerce.number().optional(),
  mileage: z.coerce.number().min(0),
  transmission: z.enum(["automatic", "manual", "cvt"]),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  engineSize: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  condition: z.enum(["new", "used", "certified"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  features: z.string().transform((val) =>
    val.split(",").map((f) => f.trim()).filter(Boolean)
  ),
  location: z.string().min(1, "Location is required"),
  sellerName: z.string().min(1, "Seller name is required"),
  sellerPhone: z.string().min(10, "Valid phone number required"),
  sellerWhatsapp: z.string().optional(),
  sellerEmail: z.string().email().optional().or(z.literal("")),
  status: z.enum(["available", "sold", "reserved"]).default("available"),
  featured: z.boolean().default(false),
});

export type CarFormData = z.infer<typeof carFormSchema>;   // output (post-transform)
export type CarFormInput = z.input<typeof carFormSchema>;   // input  (pre-transform, what the form fields hold)
