import { getPlayersTag } from "@/cache/global";
import { getIdTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export const getPlayerIdTag = (playerId: number) =>
  getIdTag("players", playerId.toString());

export const revalidatePlayers = (playerId?: number) => {
  updateTag(getPlayersTag());
  if (playerId) updateTag(getPlayerIdTag(playerId));
};
