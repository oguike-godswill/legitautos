import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Minimal fixed-window rate limiter for in-memory state.
 *
 * This lives in module scope, so it is per server instance. That is enough to
 * blunt scripted abuse of the public write endpoints, but a multi-instance or
 * serverless deployment should swap the Map for a shared store (Redis/Upstash)
 * before relying on it as a hard guarantee.
 */
const buckets = new Map<string, Bucket>();

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  /** Namespace so different endpoints do not share a counter. */
  name: string;
  /** Maximum requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Returns a 429 response when the caller has exceeded the limit, otherwise null.
 * Remember to also check this in tests with a fresh process.
 */
export function rateLimit(
  request: NextRequest,
  { name, limit, windowMs }: RateLimitOptions
): NextResponse | null {
  const now = Date.now();
  if (buckets.size > 5000) pruneExpired(now);

  const key = `${name}:${getClientIp(request)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (bucket.count < limit) {
    bucket.count += 1;
    return null;
  }

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": limit.toString(),
      },
    }
  );
}
