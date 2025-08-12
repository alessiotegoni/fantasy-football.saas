import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getAuctionSettingTag } from "../db/cache/auction";
import { db } from "@/drizzle/db";
import { auctionSettings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAuctionSettings(auctionId: string) {
  "use cache";
  cacheTag(getAuctionSettingTag(auctionId));

  const [result] = await db
    .select()
    .from(auctionSettings)
    .where(eq(auctionSettings.auctionId, auctionId));

  return result;
}
