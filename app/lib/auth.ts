import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const ADMIN_SESSION_COOKIE = "la_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  exp: number;
}

/**
 * Reads the single admin account from the environment.
 *
 * ADMIN_EMAIL / ADMIN_PASSWORD are the primary mechanism. ADMIN_PASSWORD_HASH
 * (a bcrypt hash) is supported as an alternative so the plaintext password
 * never has to live on the server in production.
 */
function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email: email.toLowerCase(), password };
}

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

/** True when the admin login is actually usable in this environment. */
export function isAdminAuthConfigured(): boolean {
  const credentials = getAdminCredentials();
  const secret = getSessionSecret();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  return Boolean((credentials || hash) && secret);
}

/**
 * Verifies an email/password pair against the configured admin account using a
 * constant-time comparison. Always runs bcrypt once so that a wrong email and a
 * wrong password take the same amount of time.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<{ email: string; name: string; role: string } | null> {
  const credentials = getAdminCredentials();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const passwordOk = hash
    ? await bcrypt.compare(password, hash)
    : await bcrypt.compare(
        password,
        await bcrypt.hash(credentials?.password ?? "unconfigured", 10)
      );

  if (!passwordOk || !credentials) return null;

  const emailOk = safeCompareStrings(email.trim().toLowerCase(), credentials.email);
  if (!emailOk) return null;

  return {
    email: credentials.email,
    name: process.env.ADMIN_NAME?.trim() || "Admin",
    role: "admin",
  };
}

function safeCompareStrings(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Builds a signed session token: base64url(payload).hmac */
export function createSessionToken(
  user: { email: string; name: string; role: string }
): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const session: AdminSession = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = base64url(JSON.stringify(session));
  return `${payload}.${sign(payload, secret)}`;
}

/** Verifies a session token's signature and expiry. */
export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload, secret);
  if (!safeCompareStrings(signature, expected)) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as AdminSession;
    if (!session?.email || typeof session.exp !== "number") return null;
    if (session.exp * 1000 <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

/** Reads and verifies the admin session from the request cookies. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Route guard for mutating API handlers. Returns a 401 response when there is
 * no valid admin session, otherwise null.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (session) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const ADMIN_SESSION_MAX_AGE = SESSION_TTL_SECONDS;
