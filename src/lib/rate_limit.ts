import type { NextRequest } from "next/server";

interface BucketEntry {
  timestamps: number[];
}

const globalForRateLimit = globalThis as unknown as {
  __tabeebcareRateLimitStore?: Map<string, BucketEntry>;
};

const store =
  globalForRateLimit.__tabeebcareRateLimitStore ??
  (globalForRateLimit.__tabeebcareRateLimitStore = new Map<string, BucketEntry>());

const MAX_STORE_ENTRIES = 2000;

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/**
 * In-memory sliding-window rate limiter (protects warm serverless instances;
 * for strict global cross-region enforcement at high scale, pair with Vercel WAF or Redis).
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (store.size > MAX_STORE_ENTRIES) {
    for (const [k, entry] of store.entries()) {
      const recent = entry.timestamps.filter((ts) => ts > windowStart);
      if (recent.length === 0) {
        store.delete(k);
      } else {
        entry.timestamps = recent;
      }
    }
  }

  const existing = store.get(key);
  const recentTimestamps = existing
    ? existing.timestamps.filter((ts) => ts > windowStart)
    : [];

  if (recentTimestamps.length >= limit) {
    const oldest = recentTimestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    store.set(key, { timestamps: recentTimestamps });
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  recentTimestamps.push(now);
  store.set(key, { timestamps: recentTimestamps });

  return {
    allowed: true,
    remaining: Math.max(0, limit - recentTimestamps.length),
    retryAfterSeconds: 0,
  };
}
