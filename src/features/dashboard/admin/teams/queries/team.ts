import { getTeamsTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { teams } from "@/drizzle/schema";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getTeams() {
  "use cache";
  cacheTag(getTeamsTag());

  return db.query.teams.findMany();
}

export type Team = typeof teams.$inferSelect
