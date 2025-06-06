import { getTeamsTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getTeams() {
  "use cache";
  cacheTag(getTeamsTag());

  return db.query.teams.findMany();
}
