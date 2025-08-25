import { db } from "@/drizzle/db";
import { auctionAcquisitions } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getAcquisition(acquisitionId: string) {
  const [acquisition] = await db
    .select()
    .from(auctionAcquisitions)
    .where(eq(auctionAcquisitions.id, acquisitionId));

  return acquisition;
}

export async function getAcquisitionByPlayer(
  auctionId: string,
  playerId: number
) {
  const [acquisition] = await db
    .select()
    .from(auctionAcquisitions)
    .where(
      and(
        eq(auctionAcquisitions.auctionId, auctionId),
        eq(auctionAcquisitions.playerId, playerId)
      )
    );

  return acquisition;
}