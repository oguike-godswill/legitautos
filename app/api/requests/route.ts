import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { CarRequest } from "@/app/models/CarRequest";
import { requireAdmin } from "@/app/lib/auth";
import { rateLimit } from "@/app/lib/rateLimit";
import { z } from "zod";

const toOptionalNum = z.preprocess(
  (v) => (v === "" || v === undefined || v === null) ? undefined : Number(v),
  z.number().optional()
);

const CreateRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10).max(20),
  whatsapp: z.string().optional().or(z.literal("")),
  preferredContact: z.enum(["phone", "whatsapp", "email"]).default("whatsapp"),
  brand: z.string().min(1),
  model: z.string().optional().or(z.literal("")),
  yearFrom: toOptionalNum,
  yearTo: toOptionalNum,
  transmission: z.enum(["automatic", "manual", "cvt", "any"]).default("any"),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "any"]).default("any"),
  budgetFrom: toOptionalNum,
  budgetTo: toOptionalNum,
  condition: z.enum(["new", "used", "certified", "any"]).default("any"),
  color: z.string().optional().or(z.literal("")),
  mileageMax: toOptionalNum,
  description: z.string().max(500).optional().or(z.literal("")),
  urgency: z.enum(["asap", "1week", "1month", "flexible"]).default("flexible"),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, {
    name: "requests",
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    await dbConnect();

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = CreateRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;

    // Clean up empty strings to undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === "" ? undefined : v])
    );

    const carRequest = await CarRequest.create(cleanData);

    return NextResponse.json(
      { request: { ...carRequest.toObject(), _id: carRequest._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/requests error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      CarRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CarRequest.countDocuments(filter),
    ]);

    return NextResponse.json({
      requests: requests.map((r) => ({ ...r, _id: r._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
