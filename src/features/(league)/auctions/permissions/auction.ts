import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getLeagueAdmin, getLeaguePremium } from "../../leagues/queries/league";
import { CreateAuctionSchema, UpdateAuctionSchema } from "../schema/auctionSettings";

enum AUCTION_ERRORS {
  PREMIUM_NOT_UNLOCKED = "Per gestire le aste almeno un membro della lega deve avere il premium",
  ADMIN_REQUIRED = "Per gestire le aste devi essere admin della lega",
  INVALID_TEAM = "Non partecipa a questa partita",
  INVALID_PLAYERS = "Alcuni giocatori scelti nella formazione non fanno parte della tua squadra",
}

export async function basePermissions(leagueId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const [isPremiumUnlocked, isLeagueAdmin] = await Promise.all([
    getLeaguePremium(leagueId),
    getLeagueAdmin(userId, leagueId),
  ]);

  if (!isPremiumUnlocked) {
    return createError(AUCTION_ERRORS.PREMIUM_NOT_UNLOCKED);
  }

  if (!isLeagueAdmin) {
    return createError(AUCTION_ERRORS.ADMIN_REQUIRED);
  }

  return createSuccess("", null)
}

export async function canCreateAuction(data: CreateAuctionSchema) {

}

export async function canUpdateAuction(data: UpdateAuctionSchema) {
  
}
