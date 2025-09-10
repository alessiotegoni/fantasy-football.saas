import { getIdTag } from "@/cache/helpers";
import { getPlayerIdTag } from "@/features/dashboard/admin/players/db/cache/player";
import { revalidateTag } from "next/cache";
import { getSplitMatchdaysIdTag } from "../../../splits/db/cache/split";

export type MATCHDAY_BONUS_MALUS_TAG =
  | "matchday-bonus-maluses"
  | "player-matchday-bonus-malus";

export const getMatchdayBonusMalusesTag = (matchdayId: number) =>
  getIdTag("matchday-bonus-maluses", matchdayId.toString());

export const getPlayerMatchdayBonusMalusTag = (
  playerId: number,
  matchdayId: number
) => {
  const playerIdTag = getPlayerIdTag(playerId);
  const matchdayIdTag = getSplitMatchdaysIdTag(matchdayId);

  return getIdTag(
    "player-matchday-bonus-malus",
    `${playerIdTag}-${matchdayIdTag}`
  );
};

export const revalidateSplitMatchdaysBonusMalusesCache = (
  matchdayId: number
) => {
  revalidateTag(getMatchdayBonusMalusesTag(matchdayId));
};

export const revalidatePlayerMatchdayBonusMalusCache = (
  playersIds: number[],
  matchdayId: number
) => {
  playersIds.forEach((playerId) =>
    revalidateTag(getPlayerMatchdayBonusMalusTag(playerId, matchdayId))
  );
};
