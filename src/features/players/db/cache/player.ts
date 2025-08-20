import { getPlayersTag } from "@/cache/global";
import { getIdTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export const getPlayerIdTag = (playerId: number) =>
  getIdTag("players", playerId.toString());

export const revalidatePlayers = (playerId: number) => {
  revalidateTag(getPlayersTag());
  revalidateTag(getPlayerIdTag(playerId));
}
