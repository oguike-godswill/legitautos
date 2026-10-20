import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from "@/app/lib/auth";
import { rateLimit } from "@/app/lib/rateLimit";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, {
    name: "admin-login",
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (limited) return limited;

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured on this environment." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const result = LoginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = await verifyAdminCredentials(
    result.data.email,
    result.data.password
  );
  if (!user) {
    // Deliberately vague so the response cannot be used to enumerate accounts.
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = createSessionToken(user);
  if (!token) {
    return NextResponse.json(
      { error: "Admin sessions are not configured on this environment." },
      { status: 503 }
    );
  }

  const response = NextResponse.json({
    user: { email: user.email, name: user.name, role: user.role },
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
