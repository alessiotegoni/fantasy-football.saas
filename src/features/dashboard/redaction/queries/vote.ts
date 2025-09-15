import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getMatchdayVotesTag, getPlayerMatchdayVoteTag } from "../votes/db/cache/vote";
import { getPlayerIdTag } from "../../admin/players/db/cache/player";
import { and, eq, inArray } from "drizzle-orm";
import { matchdayVotes } from "@/drizzle/schema";

export async function getMatchdaysVotes(matchdaysIds: number[]) {
  "use cache";
  cacheTag(...matchdaysIds.map(getMatchdayVotesTag));

  const results = await db.query.matchdayVotes.findMany({
    columns: {
      id: true,
      vote: true,
      matchdayId: true,
    },
    with: {
      player: {
        columns: {
          id: true,
          displayName: true,
        },
      },
    },
    where: (votes, { inArray }) => inArray(votes.matchdayId, matchdaysIds),
    orderBy: (votes, { asc, desc }) => [asc(votes.playerId), desc(votes.vote)],
  });

  cacheTag(...results.map((res) => getPlayerIdTag(res.player.id)));

  return results;
}

export type MatchdayVote = Awaited<ReturnType<typeof getMatchdaysVotes>>[number];

export async function getPlayersMatchdayVotes({
  matchdayId,
  playersIds,
}: {
  matchdayId: number;
  playersIds: number[];
}) {
  "use cache";

  if (!playersIds.length) return [];

  const results = await db
    .select({
      playerId: matchdayVotes.playerId,
    })
    .from(matchdayVotes)
    .where(
      and(
        eq(matchdayVotes.matchdayId, matchdayId),
        inArray(matchdayVotes.playerId, playersIds)
      )
    );

  cacheTag(
    ...results.map((result) =>
      getPlayerMatchdayVoteTag(result.playerId, matchdayId)
    )
  );

  return results;
}
