import { getIdTag } from "@/cache/helpers";
import { getPlayerIdTag } from "@/features/dashboard/admin/players/db/cache/player";
import { getSplitMatchdaysIdTag } from "@/features/dashboard/admin/splits/db/cache/split";
import { revalidateTag } from "next/cache";

export type MATCHDAY_VOTE_TAG = "matchday-votes" | "player-matchday-vote";

export const getMatchdayVotesTag = (matchdayId: number) =>
  getIdTag("matchday-votes", matchdayId.toString());

export const getPlayerMatchdayVoteTag = (
  playerId: number,
  matchdayId: number
) => {
  const playerIdTag = getPlayerIdTag(playerId);
  const matchdayIdTag = getSplitMatchdaysIdTag(matchdayId);

  return getIdTag("player-matchday-vote", `${playerIdTag}-${matchdayIdTag}`);
};

export const revalidateMatchdayVotesCache = (
  matchdayId: number
) => {
  revalidateTag(getMatchdayVotesTag(matchdayId));
};

export const revalidatePlayerMatchdayVoteCache = (
  playersIds: number[],
  matchdayId: number
) => {
  playersIds.forEach((playerId) =>
    revalidateTag(getPlayerMatchdayVoteTag(playerId, matchdayId))
  );
};
