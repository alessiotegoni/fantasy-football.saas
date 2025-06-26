import { getPlayersTag } from "@/cache/global";
import { getIdTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export const getPlayersIdTag = (playerId: number) =>
  getIdTag("players", playerId.toString());

export const revalidatePlayer = (playerId: number) => {
  revalidateTag(getPlayersTag());
  revalidateTag(getPlayersIdTag(playerId));
}
