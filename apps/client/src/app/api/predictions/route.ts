import { getServerSession } from "next-auth";
import { authOptions } from "@ai/pages/api/auth/[...nextauth]";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions(req));

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const body = await req.json();

  const prompt = body.prompt || "";
  if (prompt.trim().length === 0) {
    return new Response("Please enter a valid prompt", {
      status: 400,
    });
  }

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/sdxl
      version:
        "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt },
    }),
  });

  const data: unknown = await response.json();

  if (response.status !== 201) {
    return new Response(
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "An error occured",
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(data);
}
