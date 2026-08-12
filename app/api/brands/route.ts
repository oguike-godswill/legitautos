import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Brand } from "@/app/models/Brand";

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find({}).sort({ carCount: -1 }).lean();
    return NextResponse.json({
      brands: brands.map((b) => ({ ...b, _id: b._id.toString() })),
    });
  } catch (error) {
    console.error("GET /api/brands error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}
