import { getPlayersTag } from "@/cache/global";
import { getIdTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export const getPlayersIdTag = (playerId: string) =>
  getIdTag("players", playerId);

export const revalidatePlayers = () => revalidateTag(getPlayersTag());

export const revalidatePlayer = (playerId: string) =>
  revalidateTag(getPlayersIdTag(playerId));
