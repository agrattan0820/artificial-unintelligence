import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions(req));

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
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
      size: "512x512",
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
