import type {
  CreateCompletionResponseChoicesInner,
  ImagesResponseDataInner,
} from "openai-edge";

// generate an AI image
export const generateImage = async (prompt: string) => {
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

    return data.result;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const generatePrompt = async () => {
  try {
    const response = await fetch("/api/completion");

    const data: { result: CreateCompletionResponseChoicesInner[] } =
      await response.json();
    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return data.result;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
