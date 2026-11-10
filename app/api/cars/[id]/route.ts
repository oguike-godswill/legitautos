import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { requireAdmin } from "@/app/lib/auth";
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

    Car.updateOne({ _id: car._id }, { $inc: { views: 1 } }).catch(() => {});

    return NextResponse.json({ car: { ...car, _id: car._id.toString() } });
  } catch (error) {
    console.error("GET /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

const UpdateCarSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  trim: z.string().optional(),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1).optional(),
  price: z.coerce.number().min(100000).optional(),
  originalPrice: z.coerce.number().optional().nullable(),
  mileage: z.coerce.number().min(0).optional(),
  transmission: z.enum(["automatic", "manual", "cvt"]).optional(),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]).optional(),
  bodyType: z.enum(["suv", "sedan", "coupe", "pickup", "hatchback", "van", "convertible", "wagon"]).optional().or(z.literal("")),
  drivetrain: z.enum(["fwd", "rwd", "awd", "4wd"]).optional().or(z.literal("")),
  engineSize: z.string().optional(),
  color: z.string().min(1).optional(),
  interiorColor: z.string().optional(),
  condition: z.enum(["new", "used", "certified", "foreign-used", "nigerian-used"]).optional(),
  customsPaid: z.boolean().optional(),
  description: z.string().min(20).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  location: z.string().min(1).optional(),
  status: z.enum(["available", "sold", "reserved"]).optional(),
  featured: z.boolean().optional(),
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

    const car = await Car.findByIdAndUpdate(id, result.data, {
      returnDocument: "after",
    }).lean();

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
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

    await Car.db.collection("brands").updateOne(
      { name: { $regex: new RegExp(`^${car.brand}$`, "i") } },
      { $inc: { carCount: -1 } }
    );

    return NextResponse.json({ success: true, message: "Car deleted" });
  } catch (error) {
    console.error("DELETE /api/cars/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
