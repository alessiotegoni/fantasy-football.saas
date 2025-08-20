import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getAuctionParticipant } from "../queries/auctionParticipant";
import { CreateBidSchema } from "../schema/auctionBid";
import { getNomination } from "../queries/auctionNomination";
import { getAuction } from "../queries/auction";
import { getUserTeamId } from "@/features/users/queries/user";
import { getAuctionSettings } from "../queries/auctionSettings";
import { db } from "@/drizzle/db";
import { auctionAcquisitions } from "@/drizzle/schema/auctionAcquisitions";
import { and, count, desc, eq } from "drizzle-orm";
import { players } from "@/drizzle/schema/players";
import { getPlayer } from "@/features/players/queries/player";
import {
  checkMaxPlayersPerRole,
  getRemainingSlots,
  validateBidCredits,
} from "../utils/auctionParticipant";
import { getHighestBid } from "../queries/auctionBid";
import { auctionBids } from "@/drizzle/schema";

enum BID_ERRORS {
  INSUFFICENT_CREDITS = "Non hai abbastanza crediti",
  NOT_A_PARTICIPANT = "Non sei un partecipante di questa asta",
  NOMINATION_NOT_FOUND = "Nomina non trovata",
  AUCTION_NOT_FOUND = "Asta non trovata",
  USER_TEAM_NOT_FOUND = "Squadra utente non trovata",
  BID_TOO_LOW = "La tua offerta è troppo bassa",
  MAX_PLAYERS_REACHED = "Hai già raggiunto il numero massimo di giocatori per questo ruolo",
  PLAYER_NOT_FOUND = "Giocatore non trovato",
}

export async function canCreateBid({ nominationId, amount }: CreateBidSchema) {
  const nomination = await getNomination(nominationId);
  if (!nomination) {
    return createError(BID_ERRORS.NOMINATION_NOT_FOUND);
  }

  const permissions = await basePermissions(nomination.auctionId);
  if (permissions.error) return permissions;

  const { participant, auction } = permissions.data;

  const highestBid = await getHighestBid(nominationId);
  const minBid = highestBid ? highestBid.amount + 1 : nomination.initialPrice;

  if (amount < minBid) {
    return createError(BID_ERRORS.BID_TOO_LOW);
  }

  const [player, { playersPerRole }, playerCounts] = await Promise.all([
    getPlayer(nomination.playerId),
    getAuctionSettings(auction.id),
    getParticipantPlayersCountByRole(auction.id, participant.id),
  ]);

  if (!player) {
    return createError(BID_ERRORS.PLAYER_NOT_FOUND);
  }

  if (!checkMaxPlayersPerRole(playerCounts, playersPerRole, player.role.id)) {
    return createError(BID_ERRORS.MAX_PLAYERS_REACHED);
  }

  const { isValid, reason } = validateBidCredits({
    currentCredits: participant.credits,
    bidAmount: amount,
    slotsRemaining: getRemainingSlots(playerCounts, playersPerRole),
  });

  if (!isValid) return createError(reason);

  return createSuccess("", { participant });
}

async function getParticipantPlayersCountByRole(
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

async function basePermissions(auctionId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const auction = await getAuction(auctionId);
  if (!auction) {
    return createError(BID_ERRORS.AUCTION_NOT_FOUND);
  }

  const userTeamId = await getUserTeamId(userId, auction.leagueId);
  if (!userTeamId) {
    return createError(BID_ERRORS.USER_TEAM_NOT_FOUND);
  }

  const participant = await getAuctionParticipant(auctionId, userTeamId);
  if (!participant) {
    return createError(BID_ERRORS.NOT_A_PARTICIPANT);
  }

  return createSuccess("", { participant, auction, userId, userTeamId });
}

async function getHighestBid(nominationId: string) {
  const [highestBid] = await db
    .select()
    .from(auctionBids)
    .where(eq(auctionBids.nominationId, nominationId))
    .orderBy(desc(auctionBids.amount))
    .limit(1);

  return highestBid;
}
