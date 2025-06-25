import { leagueTradeProposals } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";

export const getError = (message = "Errore nella creazione dello scamnio") =>
  getErrorObject(message);

export async function insertTrade(trade: typeof leagueTradeProposals.$inferInsert) {
    
}

export async function insertTradePlayers() {

}
