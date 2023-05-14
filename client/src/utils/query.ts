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

    const data: { result: string | undefined } = await response.json();
    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    console.log(data);

    return data.result;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};
