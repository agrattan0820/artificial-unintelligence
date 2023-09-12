import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@ai/pages/api/auth/[...nextauth]";

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

  try {
    const startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
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
          input: { prompt, num_outputs: 2, width: 512, height: 512 },
        }),
      },
    );

    const startResponseJSON: unknown = await startResponse.json();

    if (
      typeof startResponseJSON !== "object" ||
      !startResponseJSON ||
      !("urls" in startResponseJSON) ||
      typeof startResponseJSON.urls !== "object" ||
      !startResponseJSON.urls ||
      !("get" in startResponseJSON.urls) ||
      typeof startResponseJSON.urls.get !== "string"
    ) {
      throw new Error("Was unable to retrieve Replicate AI endpoint URL");
    }

    const endpointURL = startResponseJSON.urls.get;

    let imageGenerations: string[] | null = null;

    while (!imageGenerations) {
      console.log("polling for result...");
      const finalResponse = await fetch(endpointURL, {
        method: "GET",
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const finalResponseJSON: unknown = await finalResponse.json();

      if (
        typeof finalResponseJSON !== "object" ||
        !finalResponseJSON ||
        !("status" in finalResponseJSON) ||
        !finalResponseJSON.status ||
        typeof finalResponseJSON.status !== "string"
      ) {
        throw new Error("Unable to retrieve Replicate AI status");
      }

      if (
        finalResponseJSON.status === "succeeded" &&
        "output" in finalResponseJSON &&
        typeof finalResponseJSON.output === "object" &&
        Array.isArray(finalResponseJSON.output)
      ) {
        imageGenerations = finalResponseJSON.output;
      } else if (finalResponseJSON.status === "failed") {
        throw new Error(
          `Unable to generate image${
            "error" in finalResponseJSON &&
            typeof finalResponseJSON.error === "string"
              ? `, message: ${finalResponseJSON.error}`
              : ``
          }`,
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (imageGenerations) {
      console.log("Received images:", imageGenerations);
    }

    return NextResponse.json({
      result: imageGenerations ? imageGenerations : "Failed to generate images",
    });
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
