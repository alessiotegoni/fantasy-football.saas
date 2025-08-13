import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getLeagueAdmin, getLeaguePremium } from "../../leagues/queries/league";
import {
  CreateAuctionSchema,
  UpdateAuctionSchema,
} from "../schema/auctionSettings";
import { getSplits } from "@/features/splits/queries/split";
import { getLeagueTeams } from "../../teams/queries/leagueTeam";
import { getAuction } from "../queries/auction";

enum AUCTION_ERRORS {
  PREMIUM_NOT_UNLOCKED = "Per gestire le aste almeno un membro della lega deve avere il premium",
  ADMIN_REQUIRED = "Per gestire le aste devi essere admin della lega",
  INVALID_TEAMS_LENGTH = "Per creare un'asta la lega deve avere almeno 4 squadre",
  AUCTION_TYPE = "Non puoi modificare il tipo dell'asta",
  CLASSIC_AUCTION = "Puoi creare un'asta classica solamente quando lo split verra annunciato",
  REPAIR_AUCTION = "Puoi creare un'asta di riparazione solamente dopo l'inizio dello split",
  AUCTION_NOT_FOUND = "Asta non trovata",
  INVALID_AUCTION = "Asta non valida",
  PASSED_AUCTION = "Non puoi modificare aste degli split passati",
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

  return createSuccess("", null);
}

export async function canCreateAuction({
  leagueId,
  type,
}: CreateAuctionSchema) {
  const permissions = await basePermissions(leagueId);
  if (permissions.error) return permissions;

  const [leagueTeams, splits] = await Promise.all([
    getLeagueTeams(leagueId),
    getSplits(),
  ]);

  if (leagueTeams.length < 4) {
    return createError(AUCTION_ERRORS.INVALID_TEAMS_LENGTH);
  }

  const hasLiveSplit = splits.some((split) => split.status === "live");
  const hasUpcomingSplit = splits.some((split) => split.status === "upcoming");

  if (type === "classic" && !hasUpcomingSplit) {
    return createError(AUCTION_ERRORS.CLASSIC_AUCTION);
  }
  if (type === "repair" && !hasLiveSplit) {
    return createError(AUCTION_ERRORS.REPAIR_AUCTION);
  }

  return createSuccess("", null);
}

export async function canUpdateAuction({ id, type }: UpdateAuctionSchema) {
  const auction = await getAuction(id);
  if (!auction) {
    return createError(AUCTION_ERRORS.AUCTION_NOT_FOUND);
  }

  if (auction.type !== type) {
    return createError(AUCTION_ERRORS.AUCTION_TYPE);
  }

  const permissions = await basePermissions(auction.leagueId);
  if (permissions.error) return permissions;

  const splits = await getSplits();
  const auctionSplit = splits.find((split) => split.id === auction.splitId);

  if (!auctionSplit) {
    return createError(AUCTION_ERRORS.INVALID_AUCTION);
  }

  const isAuctionSplitLive = auctionSplit.status === "live";
  const isAuctionSplitUpcoming = auctionSplit.status === "upcoming";

  if (
    (type === "classic" && !isAuctionSplitUpcoming) ||
    (type === "repair" && !isAuctionSplitLive)
  ) {
    return createError(AUCTION_ERRORS.PASSED_AUCTION);
  }

  return createSuccess("", null);
}
