import { getIdTag } from "@/cache/helpers";
import { getPlayersIdTag } from "@/features/players/db/cache/player";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";
import { revalidateTag } from "next/cache";

export type MATCHDAY_VOTE_TAG = "player-matchday-vote";

export const getPlayerMatchdayVoteTag = (
  playerId: number,
  matchdayId: number
) => {
  const playerIdTag = getPlayersIdTag(playerId);
  const matchdayIdTag = getSplitMatchdaysIdTag(matchdayId);

  return getIdTag("player-matchday-vote", `${playerIdTag}-${matchdayIdTag}`);
};

export const revalidatePlayerMatchdayVoteCache = (
  playersIds: number[],
  matchdayId: number
) => {
  playersIds.forEach((playerId) =>
    revalidateTag(getPlayerMatchdayVoteTag(playerId, matchdayId))
  );
};
