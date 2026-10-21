import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Inspection } from "@/app/models/Inspection";
import { Car } from "@/app/models/Car";
import { requireAdmin } from "@/app/lib/auth";
import { z } from "zod";
import { isValidObjectId } from "mongoose";

const QuerySchema = z.object({
  type: z.enum(["video", "image"]).optional(),
  /** Filter to the media attached to one car. */
  car: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

/**
 * Public listing of published inspection media. Admin sessions additionally see
 * unpublished items so the admin table can manage them.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const filter: Record<string, unknown> = {};

    // Only signed-in admins may see drafts.
    const { getAdminSession } = await import("@/app/lib/auth");
    const session = await getAdminSession();
    if (!session) filter.published = true;

    if (query.type) filter.type = query.type;

    if (query.car) {
      if (!isValidObjectId(query.car)) {
        return NextResponse.json({ error: "Invalid car id" }, { status: 400 });
      }
      filter.car = query.car;
    }

    const skip = (query.page - 1) * query.limit;

    const [inspections, total] = await Promise.all([
      Inspection.find(filter)
        .sort({ order: -1, createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),
      Inspection.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return NextResponse.json({
      inspections: inspections.map((item) => ({
        ...item,
        _id: item._id.toString(),
        car: item.car?.toString(),
      })),
      total,
      page: query.page,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPrevPage: query.page > 1,
    });
  } catch (error) {
    console.error("GET /api/inspections error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inspection media" },
      { status: 500 }
    );
  }
}

const CreateInspectionSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(600).optional().or(z.literal("")),
  type: z.enum(["video", "image"]),
  url: z.string().url(),
  publicId: z.string().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  duration: z.coerce.number().min(0).optional(),
  car: z.string().optional().or(z.literal("")),
  order: z.coerce.number().default(0),
  published: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await dbConnect();

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = CreateInspectionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;
    let carTitle: string | undefined;

    if (data.car) {
      if (!isValidObjectId(data.car)) {
        return NextResponse.json({ error: "Invalid car id" }, { status: 400 });
      }
      const car = await Car.findById(data.car).select("title").lean();
      if (!car) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }
      carTitle = car.title;
    }

    const inspection = await Inspection.create({
      ...data,
      description: data.description || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      car: data.car || undefined,
      carTitle,
    });

    return NextResponse.json(
      {
        inspection: {
          ...inspection.toObject(),
          _id: inspection._id.toString(),
          car: inspection.car?.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/inspections error:", error);
    return NextResponse.json(
      { error: "Failed to create inspection media" },
      { status: 500 }
    );
  }
}
