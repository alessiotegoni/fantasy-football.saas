import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getPlayerIdTag } from "../db/cache/player";
import { db } from "@/drizzle/db";
import { getPlayersTag } from "@/cache/global";

export async function getPlayers() {
  "use cache"
  cacheTag(getPlayersTag())

  return db.query.players.findMany({
    columns: {
      teamId: false,
      roleId: false,
    },
    with: {
      role: true,
      team: true,
    },
  });
}

export async function getPlayer(playerId: number) {
  "use cache";
  cacheTag(getPlayerIdTag(playerId));

  const player = await db.query.players.findFirst({
    columns: {
      teamId: false,
      roleId: false,
    },
    with: {
      role: true,
      team: true,
    },
    where: (player, { eq }) => eq(player.id, playerId),
  });

  return player;
}

export type Player = NonNullable<Awaited<ReturnType<typeof getPlayer>>>;
