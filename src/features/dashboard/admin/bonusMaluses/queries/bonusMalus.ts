import { db } from "@/drizzle/db";
import { bonusMalusTypes, matchdayBonusMalus } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getMatchdayBonusMalusesTag,
  getPlayerMatchdayBonusMalusTag,
} from "../db/cache/bonusMalus";
import { getBonusMalusTag } from "@/cache/global";
import { getPlayerIdTag } from "../../players/db/cache/player";

export async function getBonusMaluses() {
  "use cache";
  cacheTag(getBonusMalusTag());

  return db.query.bonusMalusTypes.findMany();
}

export type BonusMalus = typeof bonusMalusTypes.$inferSelect;

export async function getMatchdaysbonusMaluses(matchdaysIds: number[]) {
  "use cache";
  cacheTag(getBonusMalusTag(), ...matchdaysIds.map(getMatchdayBonusMalusesTag));

  const results = await db.query.matchdayBonusMalus.findMany({
    columns: {
      id: true,
      count: true,
      matchdayId: true,
    },
    with: {
      bonusMalusType: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      player: {
        columns: {
          id: true,
          displayName: true,
        },
      },
    },
    where: (matchdayBonus, { inArray }) =>
      inArray(matchdayBonus.matchdayId, matchdaysIds),
  });

  cacheTag(...results.map((res) => getPlayerIdTag(res.player.id)));

  return results;
}

export async function getPlayersMatchdayBonusMaluses({
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
        inArray(matchdayBonusMalus.playerId, playersIds)
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
