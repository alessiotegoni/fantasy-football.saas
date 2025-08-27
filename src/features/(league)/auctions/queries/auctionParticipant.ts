import { db } from "@/drizzle/db";
import {
  auctionAcquisitions,
  auctionParticipants,
  players,
} from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import {
  getAuctionParticipantsTag,
  getParticipantsAcquisitionsTag,
} from "../db/cache/auction";
import { getPlayerIdTag } from "@/features/players/db/cache/player";

export async function getParticipantsWithAcquisitions(auctionId: string) {
  "use cache";
  cacheTag(
    getAuctionParticipantsTag(auctionId),
    getParticipantsAcquisitionsTag(auctionId)
  );

  const participants = await db.query.auctionParticipants.findMany({
    columns: {
      teamId: false,
      auctionId: false,
    },
    with: {
      team: {
        columns: {
          id: true,
          name: true,
        },
      },
      acquisitions: {
        columns: {
          auctionId: false,
          playerId: false,
          participantId: false,
        },
        with: {
          player: {
            columns: {
              id: true,
              displayName: true,
              roleId: true,
            },
            with: {
              team: {
                columns: {
                  displayName: true,
                },
              },
            },
          },
        },
        orderBy: (acquisitions, { desc }) => desc(acquisitions.acquiredAt),
      },
    },
    where: (participant, { eq }) => eq(participant.auctionId, auctionId),
    orderBy: (participant, { asc }) => asc(participant.order),
  });

  cacheTag(...getParticipantsWithAcquisitionsCacheTags(participants));

  return participants;
}

export type AuctionParticipantWithAcquisitions = Awaited<
  ReturnType<typeof getParticipantsWithAcquisitions>
>[number];

export async function getAuctionParticipants(auctionId: string) {
  return db.query.auctionParticipants.findMany({
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

function getParticipantsWithAcquisitionsCacheTags(
  participants: AuctionParticipantWithAcquisitions[]
) {
  const teamsIds = participants
    .map((p) => p.team?.id)
    .filter((id) => id !== undefined);

  const playersIds = participants.flatMap((p) =>
    p.acquisitions.map((a) => a.player.id)
  );

  return [...teamsIds.map(getTeamIdTag), ...playersIds.map(getPlayerIdTag)];
}
