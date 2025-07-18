import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { splitMatchdays, splits } from "@/drizzle/schema";
import { getSplitsMatchdaysTag, getSplitsTag } from "@/cache/global";
import { asc, eq } from "drizzle-orm";

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

export async function getSplitMatchdays(splitId: number) {
  "use cache";
  cacheTag(getSplitsMatchdaysTag());

  return db
    .select()
    .from(splitMatchdays)
    .where(eq(splitMatchdays.splitId, splitId))
    .orderBy(asc(splitMatchdays.number));
}

export type SplitMatchday = Awaited<
  ReturnType<typeof getSplitMatchdays>
>[number];

export async function getCurrentMatchday(splitId: number) {
  const matchdays = await getSplitMatchdays(splitId);
  const liveMatchday = matchdays.find((matchday) => matchday.status === "live");

  return liveMatchday || getNextMatchday(matchdays);
}

async function getNextMatchday(matchdays: SplitMatchday[]) {
  const lastEndedMatchday = matchdays.findLastIndex(
    (matchday) => matchday.status === "ended"
  );

  if (lastEndedMatchday === -1) return matchdays[0];
  if (lastEndedMatchday === matchdays.length - 1) return undefined;

  return matchdays[lastEndedMatchday + 1];
}
