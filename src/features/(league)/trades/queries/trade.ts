import { db } from "@/drizzle/db";
import { leagueTradeProposals } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getTradeStatus(tradeId: string) {
  return db
    .select({ status: leagueTradeProposals.status })
    .from(leagueTradeProposals)
    .where(eq(leagueTradeProposals.id, tradeId))
    .then(([trade]) => trade.status);
}
