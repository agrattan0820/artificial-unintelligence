"use client";

import { useState } from "react";

export default function Test() {
  const [image, setImage] = useState("");

  return (
    <main className="flex min-h-screen w-full flex-col bg-red-200 text-white">
      <button
        className="rounded bg-indigo-600 font-bold text-white"
        onClick={async () => {
          try {
            const response = await fetch("/api/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ prompt: "a white siamese cat" }),
            });

            const data = await response.json();
            if (response.status !== 200) {
              throw (
                data.error ||
                new Error(`Request failed with status ${response.status}`)
              );
            }

            console.log(data);

            data && setImage(data.result);
          } catch (error) {
            console.error(error);
            if (error instanceof Error) {
              alert(error.message);
            }
          }
        }}
      >
        Send Custom Event
      </button>
      {image && <img src={image} alt="OpenAI Image" />}
    </main>
  );
}
