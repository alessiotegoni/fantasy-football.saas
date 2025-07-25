import { getIdTag } from "@/cache/helpers";
import { getPlayersIdTag } from "@/features/players/db/cache/player";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";
import { revalidateTag } from "next/cache";

export type MATCHDAY_BONUS_MALUS_TAG = "player-matchday-bonus-malus";

export const getPlayerMatchdayBonusMalusTag = (
  playerId: number,
  matchdayId: number
) => {
  const playerIdTag = getPlayersIdTag(playerId);
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
