import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface RateLimitData {
  [endpoint: string]: RateLimitEntry;
}

const rateLimitStore = new Map<string, RateLimitData>();

const RATE_LIMITS: {
  [key: string]: { limit: number; window: number };
} = {
  "/api/send-message": { limit: 300, window: 60000 },
  "/api/suggest-messages": { limit: 150, window: 60000 },
  "/api/sign-up": { limit: 250, window: 60000 },
  "/api/verify-code": { limit: 100, window: 60000 },
};

export function getRealIP(request: NextRequest) {
  const xff = request.headers.get("x-forwarded-for") ?? "";
  const ip =
    (request as { ip?: string }).ip ??
    request.headers.get("x-real-ip") ??
    (xff ? xff.split(",")[0] : undefined) ??
    "127.0.0.1";

  return ip.trim();
}

export function checkRateLimit(request: NextRequest): {
  limited: boolean;
  remaining?: number;
  limit: number;
  resetMs: number;
} {
  const ip = getRealIP(request);
  const endpoint = request.nextUrl.pathname;

  const config = RATE_LIMITS[endpoint];
  if (!config) {
    return { limited: false, limit: 0, resetMs: 0 };
  }

  const now = Date.now();
  const currentWindowStart =
    Math.floor(now / config.window) * config.window;

  let ipData = rateLimitStore.get(ip);
  if (!ipData) {
    ipData = {};
    rateLimitStore.set(ip, ipData);
  }

  let entry = ipData[endpoint];
  if (!entry || entry.windowStart < currentWindowStart) {
    entry = { count: 0, windowStart: currentWindowStart };
    ipData[endpoint] = entry;
  }

  const resetAt = entry.windowStart + config.window;
  const resetMs = Math.max(0, resetAt - now);

  if (entry.count >= config.limit) {
    return {
      limited: true,
      remaining: 0,
      limit: config.limit,
      resetMs,
    };
  }

  entry.count++;
  return {
    limited: false,
    remaining: config.limit - entry.count,
    limit: config.limit,
    resetMs,
  };
}
