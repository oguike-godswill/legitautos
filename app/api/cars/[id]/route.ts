import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { requireAdmin, getAdminSession } from "@/app/lib/auth";
import { Brand } from "@/app/models/Brand";
import slugify from "slugify";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const decoded = decodeURIComponent(id).trim();

    let car = null;
    if (isValidObjectId(decoded)) {
      car = await Car.findById(decoded).lean();
    }
    if (!car) {
      car = await Car.findOne({ slug: decoded }).lean();
    }

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (car.status === "draft") {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }
    }

    if (car.status !== "draft") {
      Car.updateOne({ _id: car._id }, { $inc: { views: 1 } }).catch(() => {});
    }

    return NextResponse.json({ car: { ...car, _id: car._id.toString() } });
  } catch (error) {
    console.error("GET /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

const UpdateCarSchema = z
  .object({
    title: z.string().max(100).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    trim: z.string().optional(),
    year: z.coerce.number().optional(),
    price: z.coerce.number().optional(),
    originalPrice: z.coerce.number().optional().nullable(),
    mileage: z.coerce.number().optional(),
    transmission: z.enum(["automatic", "manual", "cvt"]).optional(),
    fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]).optional(),
    bodyType: z
      .enum(["suv", "sedan", "coupe", "pickup", "hatchback", "van", "convertible", "wagon"])
      .optional()
      .or(z.literal("")),
    drivetrain: z.enum(["fwd", "rwd", "awd", "4wd"]).optional().or(z.literal("")),
    engineSize: z.string().optional(),
    color: z.string().optional(),
    interiorColor: z.string().optional(),
    condition: z.enum(["new", "used", "certified", "foreign-used", "nigerian-used"]).optional(),
    customsPaid: z.boolean().optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    location: z.string().optional(),
    status: z.enum(["available", "sold", "reserved", "draft"]).optional(),
    featured: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Only enforce strict field lengths when explicitly publishing (non-draft)
    // and those fields are included in the payload.
    if (data.status === "draft") return;

    if (data.title !== undefined && data.title.trim().length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["title"], message: "Title must be at least 3 characters" });
    }
    if (data.brand !== undefined && data.brand.trim().length < 1 && data.status !== undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["brand"], message: "Brand is required" });
    }
    if (data.model !== undefined && data.model.trim().length < 1 && data.status !== undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["model"], message: "Model is required" });
    }
    if (data.price !== undefined && data.price < 100000 && data.status !== undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["price"], message: "Price must be at least 100,000" });
    }
    if (data.description !== undefined && data.description.trim().length < 20 && data.status !== undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["description"], message: "Description must be at least 20 characters" });
    }
  });

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await dbConnect();
    const { id } = await params;

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = UpdateCarSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const existing = await Car.findById(id).select("status brand").lean();
    if (!existing) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const cleanedUpdate: Record<string, unknown> = { ...result.data };
    if (cleanedUpdate.bodyType === "") cleanedUpdate.bodyType = undefined;
    if (cleanedUpdate.drivetrain === "") cleanedUpdate.drivetrain = undefined;
    if (cleanedUpdate.status === "draft" && typeof cleanedUpdate.title === "string" && !cleanedUpdate.title.trim()) {
      cleanedUpdate.title = "Untitled Vehicle Draft";
    }

    const car = await Car.findByIdAndUpdate(id, cleanedUpdate, {
      returnDocument: "after",
    }).lean();

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // If transitioning from draft to a live status, ensure brand record exists
    const nextStatus = result.data.status ?? existing.status;
    const brandName = result.data.brand ?? existing.brand;
    if (existing.status === "draft" && nextStatus !== "draft" && brandName?.trim()) {
      await Brand.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${brandName}$`, "i") } },
        {
          $setOnInsert: {
            name: brandName,
            slug: slugify(brandName, { lower: true, strict: true }),
            country: "Global",
          },
          $inc: { carCount: 1 },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ car: { ...car, _id: car._id.toString() } });
  } catch (error) {
    console.error("PUT /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await dbConnect();
    const { id } = await params;

    const car = await Car.findByIdAndDelete(id).lean();

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (car.status !== "draft" && car.brand) {
      await Car.db.collection("brands").updateOne(
        { name: { $regex: new RegExp(`^${car.brand}$`, "i") } },
        { $inc: { carCount: -1 } }
      );
    }

    return NextResponse.json({ success: true, message: "Car deleted" });
  } catch (error) {
    console.error("DELETE /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
