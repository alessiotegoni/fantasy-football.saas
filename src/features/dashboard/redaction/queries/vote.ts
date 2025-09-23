import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getRedactionMatchdaysVotesTag } from "../votes/db/cache/vote";
import { getPlayerIdTag } from "../../admin/players/db/cache/player";

export async function getRedactionMatchdaysVotes(
  redactionId: string,
  matchdaysIds: number[]
) {
  "use cache";
  cacheTag(getRedactionMatchdaysVotesTag(redactionId));

  const results = await db.query.matchdayVotes.findMany({
    columns: {
      id: true,
      vote: true,
      matchdayId: true,
    },
    with: {
      player: {
        columns: {
          roleId: false,
          teamId: false,
        },
        with: {
          team: true,
          role: true,
        },
      },
    },
    where: (votes, { eq, and, inArray }) =>
      and(
        eq(votes.redactionId, redactionId),
        inArray(votes.matchdayId, matchdaysIds)
      ),
    orderBy: (votes, { desc }) => desc(votes.vote),
  });

  cacheTag(...results.map((res) => getPlayerIdTag(res.player.id)));

  return results;
}

export type MatchdayVote = Awaited<
  ReturnType<typeof getRedactionMatchdaysVotes>
>[number];
