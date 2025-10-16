import { getIdTag } from "@/cache/helpers";
import { getPlayerIdTag } from "@/features/dashboard/admin/players/db/cache/player";
import { getSplitMatchdaysIdTag } from "@/features/dashboard/admin/splits/db/cache/split";
import { updateTag } from "next/cache";

export type MATCHDAY_VOTE_TAG =
  | "redaction-matchdays-votes"
  | "player-matchday-vote";

export const getRedactionMatchdaysVotesTag = (redactionId: string) =>
  getIdTag("redaction-matchdays-votes", redactionId);

export const getPlayerMatchdayVoteTag = (
  playerId: number,
  matchdayId: number
) => {
  const playerIdTag = getPlayerIdTag(playerId);
  const matchdayIdTag = getSplitMatchdaysIdTag(matchdayId);

  return getIdTag("player-matchday-vote", `${playerIdTag}-${matchdayIdTag}`);
};

export const revalidateRedactionMatchdaysVotesCache = (redactionId: string) => {
  updateTag(getRedactionMatchdaysVotesTag(redactionId));
};

export const revalidatePlayerMatchdayVoteCache = (
  playersIds: number[],
  matchdayId: number
) => {
  playersIds.forEach((playerId) =>
    updateTag(getPlayerMatchdayVoteTag(playerId, matchdayId))
  );
};
