import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getMatchdayVotesTag } from "../votes/db/cache/vote";
import { getPlayerIdTag } from "../../admin/players/db/cache/player";

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
    orderBy: (votes, { desc }) => desc(votes.vote),
  });

  cacheTag(...results.map((res) => getPlayerIdTag(res.player.id)));

  return results;
}

export type MatchdayVote = Awaited<ReturnType<typeof getMatchdaysVotes>>[number];
