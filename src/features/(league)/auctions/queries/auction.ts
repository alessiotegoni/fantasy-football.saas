import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getAuctionSettingTag } from "../db/cache/auction"

export async function getAuctionsSettings(auctionId: string) {
    "use cache"
    cacheTag(getAuctionSettingTag(auctionId))


}
