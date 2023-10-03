import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const config = {
  matcher: ["/api/host", "/api/join"], // all api routes except for auth routes
};

export default async function middleware(request: NextRequest) {
  const ip =
    request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  return success
    ? NextResponse.next()
    : new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
}
