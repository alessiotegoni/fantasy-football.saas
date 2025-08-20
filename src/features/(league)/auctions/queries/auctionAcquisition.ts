import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { auctionAcquisitions } from "@/drizzle/schema";

export async function getParticipantAcquisitions(
  auctionId: string,
  participantId: string
) {
  const acquisitions = await db.query.auctionAcquisitions.findMany({
    where: and(
      eq(auctionAcquisitions.auctionId, auctionId),
      eq(auctionAcquisitions.participantId, participantId)
    ),
    with: {
      player: {
        with: {
          role: true,
        },
      },
    },
  });

  return acquisitions;
}

export type ParticipantAcquisition = Awaited<
  ReturnType<typeof getParticipantAcquisitions>
>[number];

export async function getAcquisition(id: string) {
  const [acquisition] = await db.query.auctionAcquisitions.findMany({
    where: eq(auctionAcquisitions.id, id),
    limit: 1,
  });
  return acquisition;
}

export async function getAcquisitionByPlayer(
  auctionId: string,
  playerId: number
) {
  const [acquisition] = await db.query.auctionAcquisitions.findMany({
    where: and(
      eq(auctionAcquisitions.auctionId, auctionId),
      eq(auctionAcquisitions.playerId, playerId)
    ),
    limit: 1,
  });
  return acquisition;
}
