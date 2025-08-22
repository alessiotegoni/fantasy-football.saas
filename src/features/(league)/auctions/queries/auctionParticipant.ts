import { db } from "@/drizzle/db";
import {
  auctionAcquisitions,
  auctionParticipants,
  players,
} from "@/drizzle/schema";
import { and, asc, count, eq } from "drizzle-orm";

export async function getAuctionParticipants(auctionId: string) {
  return db
    .select()
    .from(auctionParticipants)
    .where(eq(auctionParticipants.auctionId, auctionId))
    .orderBy(asc(auctionParticipants.order));
}

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

export async function getParticipantPlayersCountByRole(
  auctionId: string,
  participantId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const playerCounts = await tx
    .select({
      roleId: players.roleId,
      count: count(players.id),
    })
    .from(auctionAcquisitions)
    .innerJoin(players, eq(auctionAcquisitions.playerId, players.id))
    .where(
      and(
        eq(auctionAcquisitions.auctionId, auctionId),
        eq(auctionAcquisitions.participantId, participantId)
      )
    )
    .groupBy(players.roleId);

  return playerCounts.reduce(
    (acc: Record<number, number>, { roleId, count }) => {
      acc[roleId] = count;
      return acc;
    },
    {}
  );
}
