import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getLeagueAdmin, getLeaguePremium } from "../../leagues/queries/league";
import {
  CreateAuctionSchema,
  UpdateAuctionSchema,
  UpdateAuctionStatusSchema,
} from "../schema/auctionSettings";
import { getSplits } from "@/features/splits/queries/split";
import { getLeagueTeams } from "../../teams/queries/leagueTeam";
import { getAuctionWithSettings } from "../queries/auction";
import { getUserTeamId } from "@/features/users/queries/user";

enum AUCTION_ERRORS {
  PREMIUM_NOT_UNLOCKED = "Per gestire le aste almeno un membro della lega deve avere il premium",
  ADMIN_REQUIRED = "Per gestire le aste devi essere admin della lega",
  USER_TEAM_NOT_FOUND = "Prima gestore le aste devi prima creare una squadra",
  INVALID_TEAMS_LENGTH = "Per creare un'asta la lega deve avere almeno 4 squadre",
  AUCTION_TYPE = "Non puoi modificare il tipo dell'asta",
  CREATE_CLASSIC_AUCTION = "Puoi creare un'asta classica solamente quando lo split verra annunciato",
  REPAIR_AUCTION = "Puoi creare un'asta di riparazione solamente dopo l'inizio dello split",
  AUCTION_NOT_FOUND = "Asta non trovata",
  INVALID_AUCTION = "Asta non valida",
  PASSED_AUCTION = "Non puoi modificare aste degli split passati",
  AUCTION_SPLIT_ENDED = "Non puoi modificare lo stato di un'asta di uno split concluso",
  AUCTION_STATUS = "Stato dell'asta gia modificato",
  ENDED_AUCTION = "Non puoi modificare lo stato di un'asta gia conclusa",
}

export async function basePermissions(leagueId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const [isPremiumUnlocked, isLeagueAdmin, userTeamId] = await Promise.all([
    getLeaguePremium(leagueId),
    getLeagueAdmin(userId, leagueId),
    getUserTeamId(userId, leagueId),
  ]);

  if (!isPremiumUnlocked) {
    return createError(AUCTION_ERRORS.PREMIUM_NOT_UNLOCKED);
  }

  if (!isLeagueAdmin) {
    return createError(AUCTION_ERRORS.ADMIN_REQUIRED);
  }

  if (!userTeamId) {
    return createError(AUCTION_ERRORS.USER_TEAM_NOT_FOUND);
  }

  return createSuccess("", { userTeamId });
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
    return createError(AUCTION_ERRORS.CREATE_CLASSIC_AUCTION);
  }
  if (type === "repair" && !hasLiveSplit) {
    return createError(AUCTION_ERRORS.REPAIR_AUCTION);
  }

  return createSuccess("", {
    ...permissions.data,
    splitId: splits.at(-1)!.id,
    leagueTeams,
  });
}

export async function canUpdateAuction({ id, type }: UpdateAuctionSchema) {
  const auction = await getAuctionWithSettings(id);
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

  return createSuccess("", { auction });
}

export async function canUpdateAuctionStatus({
  id,
  status,
}: UpdateAuctionStatusSchema) {
  const auction = await getAuctionWithSettings(id);
  if (!auction) {
    return createError(AUCTION_ERRORS.AUCTION_NOT_FOUND);
  }

  if (auction.status === status) {
    return createError(AUCTION_ERRORS.AUCTION_STATUS);
  }

  if (auction.status === "ended") {
    return createError(AUCTION_ERRORS.ENDED_AUCTION);
  }

  const permissions = await basePermissions(auction.leagueId);
  if (permissions.error) return permissions;

  const splits = await getSplits();
  const auctionSplit = splits.find((split) => split.id === auction.splitId);

  if (!auctionSplit) {
    return createError(AUCTION_ERRORS.INVALID_AUCTION);
  }

  if (auctionSplit.status === "ended") {
    return createError(AUCTION_ERRORS.AUCTION_SPLIT_ENDED);
  }

  return createSuccess("", { auction });
}

export async function canDeleteAuction(id: string) {
  const auction = await getAuctionWithSettings(id);
  if (!auction) {
    return createError(AUCTION_ERRORS.AUCTION_NOT_FOUND);
  }

  const permissions = await basePermissions(auction.leagueId);
  if (permissions.error) return permissions;

  return createSuccess("", null);
}
