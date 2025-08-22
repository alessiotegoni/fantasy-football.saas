import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getLeagueAdmin } from "../../leagues/queries/league";
import { getAuction } from "../queries/auction";
import { getUserTeamId } from "@/features/users/queries/user";
import { getAuctionParticipant } from "../queries/auctionParticipant";

enum AUCTION_PARTICIPANT_ERRORS {
  USER_TEAM_NOT_FOUND = "Devi prima creare una squadra per partecipare all'asta",
  AUCTION_NOT_FOUND = "Asta non trovata",
  AUCTION_ENDED = "Non puoi gestire i partecipanti di un'asta terminata",
  JOIN_INVALID_STATUS = "Puoi entrare solamente in aste in attesa o in corso",
  ADMIN_REQUIRED = "Per gestire i partecipanti della lega devi essere admin",
  ALREADY_PARTICIPANT = "Sei già un partecipante di questa asta",
  NOT_A_PARTICIPANT = "Non sei un partecipante di questa asta",
  PERMISSION_DENIED = "Non hai i permessi per eseguire questa azione",
  PARTICIPANT_NOT_FOUND = "Partecipante non trovato",
}

export async function canJoinAuction(auctionId: string) {
  const permissions = await basePermissions(auctionId);
  if (permissions.error) return permissions;

  const { auction, userTeamId } = permissions.data;

  if (!["waiting", "active"].includes(auction.status)) {
    return createError(AUCTION_PARTICIPANT_ERRORS.JOIN_INVALID_STATUS);
  }

  const existingParticipant = await getAuctionParticipant(
    auctionId,
    userTeamId
  );

  return createSuccess("", {
    ...permissions.data,
    isAlreadyParticipant: !!existingParticipant,
  });
}

export async function participantActionPermissions({
  auctionId,
  teamId,
}: {
  auctionId: string;
  teamId: string;
}) {
  const permissions = await basePermissions(auctionId);
  if (permissions.error) return permissions;

  const { auction, userId } = permissions.data;

  const [isLeagueAdmin, participant] = await Promise.all([
    getLeagueAdmin(userId, auction.leagueId),
    getAuctionParticipant(auctionId, teamId),
  ]);

  if (!isLeagueAdmin) {
    return createError(AUCTION_PARTICIPANT_ERRORS.ADMIN_REQUIRED);
  }

  if (!participant) {
    return createError(AUCTION_PARTICIPANT_ERRORS.PARTICIPANT_NOT_FOUND);
  }

  if (auction.status === "ended") {
    return createError(AUCTION_PARTICIPANT_ERRORS.AUCTION_ENDED);
  }

  return createSuccess("", {
    auction,
    participant,
  });
}

export async function canUpdateParticipantsOrder(auctionId: string) {
  const permissions = await basePermissions(auctionId);
  if (permissions.error) return permissions;

  const { auction, userId } = permissions.data;

  const isLeagueAdmin = await getLeagueAdmin(userId, auction.leagueId);

  if (!isLeagueAdmin) {
    return createError(AUCTION_PARTICIPANT_ERRORS.ADMIN_REQUIRED);
  }

  if (auction.status === "ended") {
    return createError(AUCTION_PARTICIPANT_ERRORS.AUCTION_ENDED);
  }

  return createSuccess("", {
    auction,
  });
}

async function basePermissions(auctionId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const auction = await getAuction(auctionId);
  if (!auction) {
    return createError(AUCTION_PARTICIPANT_ERRORS.AUCTION_NOT_FOUND);
  }

  const userTeamId = await getUserTeamId(userId, auction.leagueId);
  if (!userTeamId) {
    return createError(AUCTION_PARTICIPANT_ERRORS.USER_TEAM_NOT_FOUND);
  }

  return createSuccess("", { userId, auction, userTeamId });
}
