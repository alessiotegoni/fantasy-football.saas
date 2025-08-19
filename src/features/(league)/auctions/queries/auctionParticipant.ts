import { db } from "@/drizzle/db";
import { auctionParticipants } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getAuctionParticipant(auctionId: string, teamId: string) {
  const [participant] = await db
    .select()
    .from(auctionParticipants)
    .where(
      and(
        eq(auctionParticipants.auctionId, auctionId),
        eq(auctionParticipants.teamId, teamId)
      )
    );

  return participant;
}
