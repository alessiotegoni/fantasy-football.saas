import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { splits } from "@/drizzle/schema";
import { getSplitsTag } from "@/cache/global";

export async function getSplits() {
  "use cache";
  cacheTag(getSplitsTag());

  return db.select().from(splits);
}

export type Split = typeof splits.$inferSelect;

export async function getLastSplit() {
  const splits = await getSplits();

  return splits.at(-1);
}

export async function getUpcomingSplit() {
  const splits = await getSplits();

  return splits.find((split) => split.status === "upcoming");
}

export async function getLiveSplit() {
  const splits = await getSplits();

  return splits.find((split) => split.status === "live");
}
