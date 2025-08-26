import { db } from "@/drizzle/db";
import { auctionNominations } from "@/drizzle/schema";
import { Player } from "@/features/players/queries/player";
import { and, asc, eq } from "drizzle-orm";

export async function getNomination(nominationId: string) {
  const [nomination] = await db
    .select()
    .from(auctionNominations)
    .where(eq(auctionNominations.id, nominationId));

  return nomination;
}

export type Nomination = typeof auctionNominations.$inferSelect;

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

export async function getLastNomination(auctionId: string) {
  const [nomination] = await db.query.auctionNominations.findMany({
    with: {
      player: {
        with: {
          role: true,
          team: true,
        },
      },
    },
    where: (nomination, { eq }) => eq(nomination.auctionId, auctionId),
    orderBy: (nomination, { asc }) => asc(nomination.expiresAt),
    limit: 1,
  });

  return nomination;
}

export type NominationWithPlayer = Nomination & { player: Player };
