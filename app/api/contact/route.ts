import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { ContactMessage } from "@/app/models/ContactMessage";
import { rateLimit } from "@/app/lib/rateLimit";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, {
    name: "contact",
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

    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;
    const message = await ContactMessage.create({
      ...data,
      phone: data.phone || undefined,
    });

    return NextResponse.json(
      { message: { ...message.toObject(), _id: message._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
