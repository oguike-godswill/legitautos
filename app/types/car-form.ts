import { z } from "zod";

const optionalNumber = z
  .union([z.number(), z.string(), z.undefined(), z.null()])
  .transform((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const num = Number(val);
    return Number.isNaN(num) ? undefined : num;
  });

export const carFormSchema = z
  .object({
    title: z.string().max(100).default(""),
    brand: z.string().default(""),
    model: z.string().default(""),
    trim: z.string().optional().default(""),
    year: optionalNumber.transform((v) => v ?? new Date().getFullYear()),
    price: optionalNumber.transform((v) => v ?? 0),
    originalPrice: optionalNumber,
    mileage: optionalNumber.transform((v) => v ?? 0),
    transmission: z.enum(["automatic", "manual", "cvt"]).default("automatic"),
    fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]).default("petrol"),
    bodyType: z
      .enum(["suv", "sedan", "coupe", "pickup", "hatchback", "van", "convertible", "wagon"])
      .optional()
      .or(z.literal("")),
    drivetrain: z.enum(["fwd", "rwd", "awd", "4wd"]).optional().or(z.literal("")),
    engineSize: z.string().optional().default(""),
    color: z.string().default(""),
    interiorColor: z.string().optional().default(""),
    condition: z
      .enum(["new", "used", "certified", "foreign-used", "nigerian-used"])
      .default("foreign-used"),
    customsPaid: z.boolean().default(true),
    description: z.string().default(""),
    features: z
      .string()
      .default("")
      .transform((val) =>
        val
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      ),
    location: z.string().default("Lagos, Nigeria"),
    status: z.enum(["available", "sold", "reserved", "draft"]).default("available"),
    featured: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.status === "draft") {
      return;
    }

    if (!data.title || data.title.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "Title must be at least 3 characters",
      });
    }
    if (!data.brand || data.brand.trim().length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["brand"],
        message: "Brand is required",
      });
    }
    if (!data.model || data.model.trim().length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["model"],
        message: "Model is required",
      });
    }
    const maxYear = new Date().getFullYear() + 1;
    if (data.year < 1990 || data.year > maxYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["year"],
        message: `Year must be between 1990 and ${maxYear}`,
      });
    }
    if (data.price < 100000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Price must be at least ₦100,000",
      });
    }
    if (data.mileage < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mileage"],
        message: "Mileage cannot be negative",
      });
    }
    if (!data.color || data.color.trim().length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["color"],
        message: "Color is required",
      });
    }
    if (!data.description || data.description.trim().length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["description"],
        message: "Description must be at least 20 characters",
      });
    }
    if (!data.location || data.location.trim().length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required",
      });
    }
  });

export type CarFormData = z.infer<typeof carFormSchema>; // output (post-transform)
export type CarFormInput = z.input<typeof carFormSchema>; // input  (pre-transform, what the form fields hold)
