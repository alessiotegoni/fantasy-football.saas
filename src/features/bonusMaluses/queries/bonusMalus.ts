import { db } from "@/drizzle/db";
import { bonusMalusTypes, matchdayBonusMalus } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getPlayerMatchdayBonusMalusTag } from "../db/cache/bonusMalus";
import { getBonusMalusTag } from "@/cache/global";

export async function getPlayersMatchdayBonusMaluses({
  matchdayId,
  playerIds,
}: {
  matchdayId: number;
  playerIds: number[];
}) {
  "use cache";

  if (!playerIds.length) return [];

  const results = await db
    .select({
      playerId: matchdayBonusMalus.playerId,
      id: matchdayBonusMalus.bonusMalusTypeId,
      count: matchdayBonusMalus.count,
      imageUrl: bonusMalusTypes.imageUrl,
    })
    .from(matchdayBonusMalus)
    .innerJoin(
      bonusMalusTypes,
      eq(bonusMalusTypes.id, matchdayBonusMalus.bonusMalusTypeId)
    )
    .where(
      and(
        eq(matchdayBonusMalus.matchdayId, matchdayId),
        inArray(matchdayBonusMalus.playerId, playerIds)
      )
    );

  cacheTag(
    getBonusMalusTag(),
    ...results.map((result) =>
      getPlayerMatchdayBonusMalusTag(result.playerId, matchdayId)
    )
  );

  return results;
}

export type PlayerBonusMalus = Awaited<
  ReturnType<typeof getPlayersMatchdayBonusMaluses>
>[number];
