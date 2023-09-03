import { NextResponse } from "next/server";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function POST(req: Request) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      // rate limit to 5 requests per 10 seconds
      limiter: Ratelimit.slidingWindow(5, "10s"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  } else {
    console.log(
      "KV_REST_API_URL and KV_REST_API_TOKEN env vars not found, not rate limiting...",
    );
  }

  const body = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return new Response("API Key is not defined", {
      status: 500,
    });
  }

  const prompt = body.prompt || "";
  if (prompt.trim().length === 0) {
    return new Response("Please enter a valid prompt", {
      status: 400,
    });
  }

  try {
    const images = await openai.images.generate({
      prompt,
      n: 2,
      size: "1024x1024",
    });

    return NextResponse.json({ result: images.data });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return new Response(error.message, {
        status: 500,
      });
    }
    return new Response("An error occured during your request", {
      status: 500,
    });
  }
}
