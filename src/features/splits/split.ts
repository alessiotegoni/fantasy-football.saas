import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { splits } from "@/drizzle/schema";
import { getSplitsTag } from "@/cache/global";

export async function getSplits() {
  "use client";
  cacheTag(getSplitsTag());

  return db.select().from(splits);
}
