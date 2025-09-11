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
  "/api/send-message": { limit: 3, window: 60000 },
  "/api/suggest-messages": { limit: 15, window: 60000 },
  "/api/sign-up": { limit: 2, window: 60000 },
  "/api/verify-code": { limit: 5, window: 60000 },
};

export function getRealIP(request: NextRequest) {
  const ip = (
    request.headers.get("x-forwarded-for") ?? "127.0.0.1"
  ).split(",")[0];
  return ip;
}

export function checkRateLimit(request: NextRequest): {
  limited: boolean;
  remaining?: number;
} {
  const ip = getRealIP(request);
  const endpoint = request.nextUrl.pathname;

  const config = RATE_LIMITS[endpoint];
  if (!config) {
    return { limited: false };
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

  if (entry.count >= config.limit) {
    return { limited: true, remaining: 0 };
  }

  entry.count++;
  return {
    limited: false,
    remaining: config.limit - entry.count,
  };
}
