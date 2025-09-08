import { getIdTag } from "@/cache/helpers";
import { getPlayerIdTag } from "@/features/dashboard/admin/players/db/cache/player";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";
import { revalidateTag } from "next/cache";

export type MATCHDAY_BONUS_MALUS_TAG = "player-matchday-bonus-malus";

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

export const revalidatePlayerMatchdayBonusMalusCache = (
  playersIds: number[],
  matchdayId: number
) => {
  playersIds.forEach((playerId) =>
    revalidateTag(getPlayerMatchdayBonusMalusTag(playerId, matchdayId))
  );
};
