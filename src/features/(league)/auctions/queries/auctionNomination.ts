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

export async function getCurrentNomination(auctionId: string) {
  const [nomination] = await db.query.auctionNominations.findMany({
    with: {
      player: {
        columns: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
        with: {
          team: true,
          role: true,
        },
      },
    },
    where: (nomination, { and, eq }) =>
      and(
        eq(nomination.status, "bidding"),
        eq(nomination.auctionId, auctionId)
      ),
    orderBy: (nomination, { asc }) => asc(nomination.expiresAt),
    limit: 1,
  });

  return nomination;
}

export type CurrentNomination = Awaited<
  ReturnType<typeof getCurrentNomination>
> | null;
