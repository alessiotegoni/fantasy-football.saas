import { db } from "@/drizzle/db";
import { auctionAcquisitions } from "@/drizzle/schema/auctionAcquisitions";
import { players } from "@/drizzle/schema/players";
import { getAuction } from "../queries/auction";
import { getAuctionParticipant } from "../queries/auctionParticipant";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { and, count, eq } from "drizzle-orm";
import { getPlayer } from "@/features/players/queries/player";
import { getAuctionSettings } from "../queries/auctionSettings";
import {
  getRemainingSlots,
  isRoleFull,
  validateBidCredits,
} from "../utils/auctionParticipant";

export enum AUCTION_PERMISSION_ERRORS {
  NOT_A_PARTICIPANT = "Non sei un partecipante di questa asta",
  AUCTION_NOT_FOUND = "Asta non trovata",
  AUCTION_NOT_ACTIVE = "Puoi fare offerte solamente nelle aste in corso",
  USER_TEAM_NOT_FOUND = "Squadra utente non trovata",
  INSUFFICENT_CREDITS = "Non hai abbastanza crediti",
  MAX_PLAYERS_REACHED = "Hai già raggiunto il numero massimo di giocatori per questo ruolo",
  PLAYER_NOT_FOUND = "Giocatore non trovato",
}

export async function getParticipantPlayersCountByRole(
  auctionId: string,
  participantId: string
) {
  const playerCounts = await db
    .select({
      roleId: players.roleId,
      count: count(players.id),
    })
    .from(auctionAcquisitions)
    .innerJoin(players, eq(auctionAcquisitions.playerId, players.id))
    .where(
      and(
        eq(auctionAcquisitions.auctionId, auctionId),
        eq(auctionAcquisitions.participantId, participantId)
      )
    )
    .groupBy(players.roleId);

  return playerCounts.reduce(
    (acc: Record<number, number>, { roleId, count }) => {
      acc[roleId] = count;
      return acc;
    },
    {}
  );
}

export async function baseAuctionPermissions(auctionId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const auction = await getAuction(auctionId);
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
  currentCredits,
}: {
  playerId: number;
  auctionId: string;
  participantId: string;
  bidAmount: number;
  currentCredits: number;
}) {
  const [player, { playersPerRole }, playerCounts] = await Promise.all([
    getPlayer(playerId),
    getAuctionSettings(auctionId),
    getParticipantPlayersCountByRole(auctionId, participantId),
  ]);

  if (!player) {
    return createError(AUCTION_PERMISSION_ERRORS.PLAYER_NOT_FOUND);
  }

  if (isRoleFull(playerCounts, playersPerRole, player.role.id)) {
    return createError(AUCTION_PERMISSION_ERRORS.MAX_PLAYERS_REACHED);
  }

  const { isValid, reason } = validateBidCredits({
    currentCredits: currentCredits,
    bidAmount: bidAmount,
    slotsRemaining: getRemainingSlots(playerCounts, playersPerRole),
  });

  if (!isValid) return createError(reason);

  return createSuccess("", { player, playersPerRole, playerCounts });
}
