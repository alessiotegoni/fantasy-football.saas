import { db } from "@/drizzle/db";
import {
  auctionAcquisitions,
  auctionParticipants,
  players,
} from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getAuctionParticipantsTag } from "../db/cache/auction";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";

export async function getAuctionParticipants(auctionId: string) {
  "use cache";
  cacheTag(getAuctionParticipantsTag(auctionId));

  const participants = await db.query.auctionParticipants.findMany({
    columns: {
      teamId: false,
    },
    with: {
      team: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    where: (participant, { eq }) => eq(participant.auctionId, auctionId),
    orderBy: (participant, { asc }) => asc(participant.order),
  });

  const teamsIds = participants
    .map((p) => p.team?.id)
    .filter((id) => id !== undefined);

  cacheTag(...teamsIds.map(getTeamIdTag));

  return participants;
}

export type AuctionParticipant = Awaited<
  ReturnType<typeof getAuctionParticipants>
>[number];

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
  participantId: string
) {
  const playerCounts = await db
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
