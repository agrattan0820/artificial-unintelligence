import { Configuration, OpenAIApi } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function GET(req: Request) {
  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    temperature: 0.6,
    prompt: `Generate a comma-separated list of 10 funny prompts for a game. For the game, players will respond to the prompt with AI generated images. Two players will respond to the prompt while the rest of the players vote on their favorite response/image. The targeted audience is between 15 and 30. The prompts should relate to pop culture, historical events, celebrities, brands, and dark humor.

    The uninvited wedding guest, The new challenger in Super Smash Bros, The newly discovered animal in Australia, The new British Museum exhibit, The creature hidden in IKEA, A unique vacation spot, A cancelled children's toy, The new Olympic sport, The celebrity that nobody remembers, `,
  });

  return NextResponse.json({ result: response.data.choices });
  // Convert the response into a friendly text-stream
  // const stream = OpenAIStream(response);
  // Respond with the stream
  // return new StreamingTextResponse(stream);
}
