import type { NextResponse } from "next/server";
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  const body = await req.json();

  if (!configuration.apiKey) {
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
    const imagesResponse = await openai.createImage({
      prompt,
      n: 2,
      size: "1024x1024",
    });

    const images: ResponseTypes["createImage"] = await imagesResponse.json();

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
