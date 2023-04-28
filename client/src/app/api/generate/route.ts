import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  const body = await req.json();

  const { searchParams } = new URL(req.url);

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
    const image = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ result: image.data.data[0].url });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error instanceof AxiosError && error.response) {
      console.error(error.response.status, error.response.data);
      return new Response(error.response.data, {
        status: error.response.status,
      });
    }
    return new Response("An error occured during your request", {
      status: 500,
    });
  }
}
