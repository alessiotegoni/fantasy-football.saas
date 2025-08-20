import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getAuctionParticipant } from "../queries/auctionParticipant";
import { CreateNominationSchema } from "../schema/auctionNomination";
import { getLeagueAdmin } from "../../leagues/queries/league";
import { getGeneralSettings } from "../../settings/queries/setting";
import {
  getNomination,
  getNominationByPlayer,
} from "../queries/auctionNomination";
import { getAuction } from "../queries/auction";
import { getUserTeamId } from "@/features/users/queries/user";
import { getAuctionSettings } from "../queries/auctionSettings";
import { db } from "@/drizzle/db";
import { auctionAcquisitions } from "@/drizzle/schema/auctionAcquisitions";
import { and, eq } from "drizzle-orm";
import { players } from "@/drizzle/schema/players";
import { sql } from "drizzle-orm";

enum AUCTION_NOMINATION_ERRORS {
  NOT_A_PARTICIPANT = "Non sei un partecipante di questa asta",
  PERMISSION_DENIED = "Non hai i permessi per eseguire questa azione",
  MAX_PLAYERS_REACHED = "Hai già raggiunto il numero massimo di giocatori per questo ruolo",
  PLAYER_ALREADY_NOMINATED = "Questo giocatore è già stato nominato",
  NOMINATION_NOT_FOUND = "Nomina non trovata",
  ADMIN_REQUIRED = "Solo un admin può eliminare una nomina",
  AUCTION_NOT_FOUND = "Asta non trovata",
  PLAYER_NOT_FOUND = "Giocatore non trovato",
  SETTINGS_NOT_FOUND = "Impostazioni della lega non trovate",
  USER_TEAM_NOT_FOUND = "Squadra utente non trovata",
}

async function basePermissions(auctionId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const auction = await getAuction(auctionId);
  if (!auction) {
    return createError(AUCTION_NOMINATION_ERRORS.AUCTION_NOT_FOUND);
  }

  const userTeamId = await getUserTeamId(userId, auction.leagueId);
  if (!userTeamId) {
    return createError(AUCTION_NOMINATION_ERRORS.USER_TEAM_NOT_FOUND);
  }

  const participant = await getAuctionParticipant(auctionId, userTeamId);
  if (!participant) {
    return createError(AUCTION_NOMINATION_ERRORS.NOT_A_PARTICIPANT);
  }

  return createSuccess("", { participant, auction, userId, userTeamId });
}

export async function getParticipantPlayersCountByRole(
  auctionId: string,
  participantId: string
) {
  const playerCounts = await db
    .select({
      roleId: players.roleId,
      count: sql`count(${players.id})`.mapWith(Number),
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

  return playerCounts.reduce((acc, { roleId, count }) => {
    acc[roleId] = count;
    return acc;
  }, {} as Record<number, number>);
}

export function checkMaxPlayersPerRole(
  playerCounts: Record<number, number>,
  playersPerRole: Record<number, number>,
  playerRoleId: number
) {
  const currentRoleCount = playerCounts[playerRoleId] || 0;
  const maxRoleCount = playersPerRole[playerRoleId] || 0;
  return currentRoleCount < maxRoleCount;
}

export async function canCreateNomination({
  auctionId,
  playerId,
}: CreateNominationSchema) {
  const permissions = await basePermissions(auctionId);
  if (permissions.error) return permissions;

  const { auction, userTeamId } = permissions.data;

  const [{ playersPerRole }] = await Promise.all([
    getAuctionSettings(auctionId),
  ]);

  if (!player) {
    return createError(AUCTION_NOMINATION_ERRORS.PLAYER_NOT_FOUND);
  }
  if (!settings) {
    return createError(AUCTION_NOMINATION_ERRORS.SETTINGS_NOT_FOUND);
  }

  const maxPlayerCheck = await checkMaxPlayersPerRole(
    userTeamId,
    auction.leagueId,
    playerId
  );
  if (maxPlayerCheck.error) return maxPlayerCheck;

  const existingNomination = await getNominationByPlayer(auctionId, playerId);
  if (existingNomination) {
    return createError(AUCTION_NOMINATION_ERRORS.PLAYER_ALREADY_NOMINATED);
  }

  return createSuccess("", {
    participant: permissions.data.participant,
    auction,
  });
}

export async function canDeleteNomination(nominationId: string) {
  const nomination = await getNomination(nominationId);
  if (!nomination) {
    return createError(AUCTION_NOMINATION_ERRORS.NOMINATION_NOT_FOUND);
  }

  const permissions = await basePermissions(nomination.auctionId);
  if (permissions.error) return permissions;

  const { userId, auction } = permissions.data;

  const isLeagueAdmin = await getLeagueAdmin(userId, auction.leagueId);
  if (!isLeagueAdmin) {
    return createError(AUCTION_NOMINATION_ERRORS.ADMIN_REQUIRED);
  }

  return createSuccess("", { nomination });
}
