import { createError, createSuccess } from "@/utils/helpers";
import { CreateNominationSchema } from "../schema/auctionNomination";
import { getLeagueAdmin } from "../../leagues/queries/league";
import {
  getNomination,
  getNominationByPlayer,
} from "../queries/auctionNomination";
import { baseAuctionPermissions, validatePlayerAndCredits } from "./shared";

enum NOMINATION_ERRORS {
  INSUFFICENT_CREDITS = "Non hai abbastanza crediti",
  PERMISSION_DENIED = "Non hai i permessi per eseguire questa azione",
  PLAYER_ALREADY_NOMINATED = "Questo giocatore è già stato nominato",
  NOMINATION_NOT_FOUND = "Nomina non trovata",
  ADMIN_REQUIRED = "Solo un admin può eliminare una nomina",
}

export async function canCreateNomination({
  auctionId,
  playerId,
  initialPrice,
}: CreateNominationSchema) {
  const permissions = await baseAuctionPermissions(auctionId);
  if (permissions.error) return permissions;

  const { auction, participant } = permissions.data;

  const existingNomination = await getNominationByPlayer(auctionId, playerId);
  if (existingNomination) {
    return createError(NOMINATION_ERRORS.PLAYER_ALREADY_NOMINATED);
  }

  const playerAndCreditValidation = await validatePlayerAndCredits({
    playerId: playerId,
    auctionId: auctionId,
    participantId: participant.id,
    bidAmount: initialPrice,
    currentCredits: participant.credits,
  });

  if (playerAndCreditValidation.error) return playerAndCreditValidation;

  return createSuccess("", {
    participant: permissions.data.participant,
    auction,
  });
}

export async function canDeleteNomination(nominationId: string) {
  const nomination = await getNomination(nominationId);
  if (!nomination) {
    return createError(NOMINATION_ERRORS.NOMINATION_NOT_FOUND);
  }

  const permissions = await baseAuctionPermissions(nomination.auctionId);
  if (permissions.error) return permissions;

  const { userId, auction } = permissions.data;

  const isLeagueAdmin = await getLeagueAdmin(userId, auction.leagueId);
  if (!isLeagueAdmin) {
    return createError(NOMINATION_ERRORS.ADMIN_REQUIRED);
  }

  return createSuccess("", { nomination });
}
