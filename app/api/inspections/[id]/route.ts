import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Inspection } from "@/app/models/Inspection";
import { Car } from "@/app/models/Car";
import { requireAdmin } from "@/app/lib/auth";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";

/** Looks up an inspection by ObjectId or by id, returning null when absent. */
async function findInspection(id: string) {
  if (!isValidObjectId(id)) return null;
  return Inspection.findById(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const inspection = await findInspection(id);
    if (!inspection) {
      return NextResponse.json(
        { error: "Inspection media not found" },
        { status: 404 }
      );
    }

    if (!inspection.published) {
      const { getAdminSession } = await import("@/app/lib/auth");
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json(
          { error: "Inspection media not found" },
          { status: 404 }
        );
      }
    }

    const plain = inspection.toObject();
    return NextResponse.json({
      inspection: { ...plain, _id: plain._id.toString(), car: plain.car?.toString() },
    });
  } catch (error) {
    console.error("GET /api/inspections/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inspection media" },
      { status: 500 }
    );
  }
}

const UpdateInspectionSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(600).optional().nullable(),
  type: z.enum(["video", "image"]).optional(),
  url: z.string().url().optional(),
  publicId: z.string().optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  duration: z.coerce.number().min(0).optional().nullable(),
  car: z.string().optional().nullable(),
  order: z.coerce.number().optional(),
  published: z.boolean().optional(),
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

    const result = UpdateInspectionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;
    const update: Record<string, unknown> = { ...data };

    // Re-resolve the car title whenever the link changes, so the denormalised
    // label never points at a stale listing.
    if (data.car !== undefined) {
      if (!data.car) {
        update.car = undefined;
        update.carTitle = undefined;
      } else {
        if (!isValidObjectId(data.car)) {
          return NextResponse.json({ error: "Invalid car id" }, { status: 400 });
        }
        const car = await Car.findById(data.car).select("title").lean();
        if (!car) {
          return NextResponse.json({ error: "Car not found" }, { status: 404 });
        }
        update.car = car._id;
        update.carTitle = car.title;
      }
    }

    const inspection = await Inspection.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!inspection) {
      return NextResponse.json(
        { error: "Inspection media not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      inspection: {
        ...inspection,
        _id: inspection._id.toString(),
        car: inspection.car?.toString(),
      },
    });
  } catch (error) {
    console.error("PUT /api/inspections/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update inspection media" },
      { status: 500 }
    );
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

    const inspection = await Inspection.findByIdAndDelete(id).lean();
    if (!inspection) {
      return NextResponse.json(
        { error: "Inspection media not found" },
        { status: 404 }
      );
    }

    // Best-effort cleanup of the stored asset. A failure here must not fail the
    // request — the record is already gone and a stray file is harmless.
    if (
      inspection.publicId &&
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        cloudinary.config({
          cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        await cloudinary.uploader.destroy(inspection.publicId, {
          resource_type: inspection.type === "video" ? "video" : "image",
        });
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json({ success: true, message: "Inspection media deleted" });
  } catch (error) {
    console.error("DELETE /api/inspections/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete inspection media" },
      { status: 500 }
    );
  }
}
