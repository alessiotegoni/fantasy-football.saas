import { db } from "@/drizzle/db";
import { auctionNominations } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getNomination(nominationId: string) {
  const [nomination] = await db
    .select()
    .from(auctionNominations)
    .where(eq(auctionNominations.id, nominationId));
  return nomination;
}

export async function getNominationByPlayer(
  auctionId: string,
  playerId: number
) {
  const [nomination] = await db
    .select()
    .from(auctionNominations)
    .where(
      and(
        eq(auctionNominations.auctionId, auctionId),
        eq(auctionNominations.playerId, playerId)
      )
    );

  return nomination;
}
