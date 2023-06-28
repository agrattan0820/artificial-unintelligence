import { db } from "../../db/db";
import { votes } from "../../db/schema";

export async function createVote({
  userId,
  generationId,
}: {
  userId: number;
  generationId: number;
}) {
  const newVote = await db
    .insert(votes)
    .values({ userId, generationId })
    .returning();
  return newVote[0];
}
