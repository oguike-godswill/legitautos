import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const currentCar = await Car.findById(id).lean();
    if (!currentCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const similarCars = await Car.find({
      _id: { $ne: currentCar._id },
      brand: currentCar.brand,
      status: "available",
    })
      .sort({ featured: -1, createdAt: -1 })
      .limit(4)
      .lean();

    return NextResponse.json({
      cars: similarCars.map((car) => ({ ...car, _id: car._id.toString() })),
    });
  } catch (error) {
    console.error("GET /api/cars/similar error:", error);
    return NextResponse.json(
      { error: "Failed to fetch similar cars" },
      { status: 500 }
    );
  }
}
