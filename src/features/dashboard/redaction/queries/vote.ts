import { db } from "@/drizzle/db";
import { bonusMalusTypes, matchdayBonusMalus } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getBonusMalusTag } from "@/cache/global";
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
    orderBy: (votes, { asc, desc }) => [asc(votes.playerId), desc(votes.vote)],
  });

  cacheTag(...results.map((res) => getPlayerIdTag(res.player.id)));

  return results;
}

export type MatchdayVote = Awaited<
  ReturnType<typeof getMatchdaysVotes>
>[number];

// export async function getPlayersMatchdayBonusMaluses({
//   matchdayId,
//   playersIds,
// }: {
//   matchdayId: number;
//   playersIds: number[];
// }) {
//   "use cache";

//   if (!playersIds.length) return [];

//   const results = await db
//     .select({
//       playerId: matchdayBonusMalus.playerId,
//       id: matchdayBonusMalus.bonusMalusTypeId,
//       count: matchdayBonusMalus.count,
//       imageUrl: bonusMalusTypes.imageUrl,
//     })
//     .from(matchdayBonusMalus)
//     .innerJoin(
//       bonusMalusTypes,
//       eq(bonusMalusTypes.id, matchdayBonusMalus.bonusMalusTypeId)
//     )
//     .where(
//       and(
//         eq(matchdayBonusMalus.matchdayId, matchdayId),
//         inArray(matchdayBonusMalus.playerId, playersIds)
//       )
//     );

//   cacheTag(
//     getBonusMalusTag(),
//     ...results.map((result) =>
//       getPlayerMatchdayBonusMalusTag(result.playerId, matchdayId)
//     )
//   );

//   return results;
// }

// export type PlayerBonusMalus = Awaited<
//   ReturnType<typeof getPlayersMatchdayBonusMaluses>
// >[number];
