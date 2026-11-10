import { z } from "zod";

export const carFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  trim: z.string().optional(),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(100000, "Price must be at least ₦100,000"),
  originalPrice: z.coerce.number().optional(),
  mileage: z.coerce.number().min(0),
  transmission: z.enum(["automatic", "manual", "cvt"]),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  bodyType: z.enum(["suv", "sedan", "coupe", "pickup", "hatchback", "van", "convertible", "wagon"]).optional().or(z.literal("")),
  drivetrain: z.enum(["fwd", "rwd", "awd", "4wd"]).optional().or(z.literal("")),
  engineSize: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  interiorColor: z.string().optional(),
  condition: z.enum(["new", "used", "certified", "foreign-used", "nigerian-used"]),
  customsPaid: z.boolean().default(true),
  description: z.string().min(20, "Description must be at least 20 characters"),
  features: z.string().transform((val) =>
    val.split(",").map((f) => f.trim()).filter(Boolean)
  ),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["available", "sold", "reserved"]).default("available"),
  featured: z.boolean().default(false),
});

export type CarFormData = z.infer<typeof carFormSchema>;   // output (post-transform)
export type CarFormInput = z.input<typeof carFormSchema>;   // input  (pre-transform, what the form fields hold)
