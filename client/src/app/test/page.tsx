"use client";

import { useState } from "react";
import { generateImage } from "../../utils/query";

export default function Test() {
  const [image, setImage] = useState("");

  return (
    <main className="flex min-h-screen w-full flex-col bg-red-200 text-white">
      <button
        className="rounded bg-indigo-600 font-bold text-white"
        onClick={async () => {
          const imageUrl = await generateImage(
            "a LAN party in the middle of the highway"
          );
          imageUrl && setImage(imageUrl);
        }}
      >
        Send Custom Event
      </button>
      {image && <img src={image} alt="OpenAI Image" />}
    </main>
  );
}
