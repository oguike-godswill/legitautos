import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    let car;
    if (isValidObjectId(id)) {
      car = await Car.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).lean();
    } else {
      car = await Car.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } }, { new: true }).lean();
    }

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

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
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1).optional(),
  price: z.coerce.number().min(100000).optional(),
  originalPrice: z.coerce.number().optional().nullable(),
  mileage: z.coerce.number().min(0).optional(),
  transmission: z.enum(["automatic", "manual", "cvt"]).optional(),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]).optional(),
  engineSize: z.string().optional(),
  color: z.string().min(1).optional(),
  condition: z.enum(["new", "used", "certified"]).optional(),
  description: z.string().min(20).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  location: z.string().min(1).optional(),
  sellerName: z.string().min(1).optional(),
  sellerPhone: z.string().min(10).optional(),
  sellerWhatsapp: z.string().optional(),
  sellerEmail: z.string().email().optional().or(z.literal("")),
  status: z.enum(["available", "sold", "reserved"]).optional(),
  featured: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const data = result.data;
    const updateData: Record<string, unknown> = { ...data };

    if (data.sellerName || data.sellerPhone || data.sellerWhatsapp || data.sellerEmail) {
      const existingCar = await Car.findById(id).lean();
      if (existingCar) {
        updateData.seller = {
          name: data.sellerName ?? existingCar.seller.name,
          phone: data.sellerPhone ?? existingCar.seller.phone,
          whatsapp: data.sellerWhatsapp ?? existingCar.seller.whatsapp,
          email: data.sellerEmail ?? existingCar.seller.email,
        };
      }
      delete updateData.sellerName;
      delete updateData.sellerPhone;
      delete updateData.sellerWhatsapp;
      delete updateData.sellerEmail;
    }

    const car = await Car.findByIdAndUpdate(id, updateData, { new: true }).lean();

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
