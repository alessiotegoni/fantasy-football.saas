import { getAuctionWithSettings } from "../queries/auction";
import { getAuctionParticipant, getParticipantPlayersCountByRole } from "../queries/auctionParticipant";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getPlayer } from "@/features/players/queries/player";
import { getAuctionSettings } from "../queries/auctionSettings";
import { getRemainingSlots, isRoleFull } from "../utils/auctionParticipant";
import { validateBidCredits } from "../utils/auctionBid";

export enum AUCTION_PERMISSION_ERRORS {
  NOT_A_PARTICIPANT = "Non sei un partecipante di questa asta",
  AUCTION_NOT_FOUND = "Asta non trovata",
  AUCTION_NOT_ACTIVE = "Puoi fare offerte solamente nelle aste in corso",
  USER_TEAM_NOT_FOUND = "Squadra utente non trovata",
  INSUFFICENT_CREDITS = "Non hai abbastanza crediti",
  MAX_PLAYERS_REACHED = "Hai già raggiunto il numero massimo di giocatori per questo ruolo",
  PLAYER_NOT_FOUND = "Giocatore non trovato",
}

export async function baseAuctionPermissions(auctionId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const auction = await getAuctionWithSettings(auctionId);
  if (!auction) {
    return createError(AUCTION_PERMISSION_ERRORS.AUCTION_NOT_FOUND);
  }

  if (auction.status !== "active") {
    return createError(AUCTION_PERMISSION_ERRORS.AUCTION_NOT_ACTIVE);
  }

  const userTeamId = await getUserTeamId(userId, auction.leagueId);
  if (!userTeamId) {
    return createError(AUCTION_PERMISSION_ERRORS.USER_TEAM_NOT_FOUND);
  }

  const participant = await getAuctionParticipant(auctionId, userTeamId);
  if (!participant) {
    return createError(AUCTION_PERMISSION_ERRORS.NOT_A_PARTICIPANT);
  }

  return createSuccess("", { participant, auction, userId, userTeamId });
}

export async function validatePlayerAndCredits({
  playerId,
  auctionId,
  participantId,
  bidAmount,
  participantCredits,
}: {
  playerId: number;
  auctionId: string;
  participantId: string;
  bidAmount: number;
  participantCredits: number;
}) {
  const [player, auctionSettings, playerCounts] = await Promise.all([
    getPlayer(playerId),
    getAuctionSettings(auctionId),
    getParticipantPlayersCountByRole(auctionId, participantId),
  ]);

  if (!player) {
    return createError(AUCTION_PERMISSION_ERRORS.PLAYER_NOT_FOUND);
  }

  if (
    isRoleFull(playerCounts, auctionSettings.playersPerRole, player.role.id)
  ) {
    return createError(AUCTION_PERMISSION_ERRORS.MAX_PLAYERS_REACHED);
  }

  const { isValid, reason } = validateBidCredits({
    participantCredits,
    bidAmount: bidAmount,
    slotsRemaining: getRemainingSlots(
      playerCounts,
      auctionSettings.playersPerRole
    ),
  });

  if (!isValid) return createError(reason);

  return createSuccess("", { player, auctionSettings, playerCounts });
}
