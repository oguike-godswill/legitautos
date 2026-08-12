import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { CarRequest } from "@/models/CarRequest";
import { z } from "zod";

const UpdateSchema = z.object({
  status: z.enum(["pending", "contacted", "fulfilled", "closed"]),
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

    const result = UpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const updated = await CarRequest.findByIdAndUpdate(id, result.data, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ request: { ...updated, _id: updated._id.toString() } });
  } catch (error) {
    console.error("PUT /api/requests/[id] error:", error);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await CarRequest.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/requests/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
  }
}
