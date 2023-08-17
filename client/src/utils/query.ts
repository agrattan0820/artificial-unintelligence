import type { ImagesResponseDataInner } from "openai-edge";
import * as Sentry from "@sentry/nextjs";

// generate an AI image
export const generateOpenAIImage = async (prompt: string) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: { result: ImagesResponseDataInner[] } = await response.json();

    return data.result.map((image) => image.url);
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const generateSDXLImage = async (prompt: string) => {
  try {
    const response = await fetch("/api/replicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: { result: string[] } = await response.json();

    return data.result;
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
