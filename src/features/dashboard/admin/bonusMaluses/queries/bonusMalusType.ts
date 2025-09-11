import { getBonusMalusTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { bonusMalusTypes } from "@/drizzle/schema";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getBonusMalusTypes() {
  "use cache";
  cacheTag(getBonusMalusTag());

  return db.select().from(bonusMalusTypes);
}

export type BonusMalusType = typeof bonusMalusTypes.$inferSelect;
