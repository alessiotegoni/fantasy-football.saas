import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getLeagueAdmin } from "../../leagues/queries/league";
import { AUCTION_PERMISSION_ERRORS, validatePlayerAndCredits } from "./shared";
import { AddAcquisitionPlayerSchema } from "../schema/auctionAcquisition";
import { db } from "@/drizzle/db";
import { auctionParticipants } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getAuctionWithSettings } from "../queries/auction";
import { getAcquisition, getAcquisitionByPlayer } from "../queries/auctionAcquisition";

enum ACQUISITION_ERRORS {
  ACQUISITION_NOT_FOUND = "Acquisizione non trovata",
  ADMIN_REQUIRED = "Solo un admin può eseguire questa azione",
  INVALID_PARTICIPANT = "Partecipante non valido per questa asta",
  PLAYER_ALREADY_ACQUIRED = "Questo giocatore è già stato acquistato",
}

export async function canAddAcquisitionPlayer(
  data: AddAcquisitionPlayerSchema
) {
  const adminPermissions = await basePermissions(data.auctionId);
  if (adminPermissions.error) return adminPermissions;

  const participant = await getAuctionParticipantById(data.participantId);
  if (!participant || participant.auctionId !== data.auctionId) {
    return createError(ACQUISITION_ERRORS.INVALID_PARTICIPANT);
  }

  const existingAcquisition = await getAcquisitionByPlayer(
    data.auctionId,
    data.playerId
  );
  if (existingAcquisition) {
    return createError(ACQUISITION_ERRORS.PLAYER_ALREADY_ACQUIRED);
  }

  const playerAndCreditValidation = await validatePlayerAndCredits({
    playerId: data.playerId,
    auctionId: data.auctionId,
    participantId: data.participantId,
    bidAmount: data.price,
    teamCredits: participant.credits,
  });

  if (playerAndCreditValidation.error) return playerAndCreditValidation;

  return createSuccess("", { participant });
}

export async function canRemoveAcquiredPlayer(acquisitionId: string) {
  const acquisition = await getAcquisition(acquisitionId);
  if (!acquisition) {
    return createError(ACQUISITION_ERRORS.ACQUISITION_NOT_FOUND);
  }

  const adminPermissions = await basePermissions(acquisition.auctionId);
  if (adminPermissions.error) return adminPermissions;

  return createSuccess("", { acquisition });
}

async function basePermissions(auctionId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const auction = await getAuctionWithSettings(auctionId);
  if (!auction) {
    return createError(AUCTION_PERMISSION_ERRORS.AUCTION_NOT_FOUND);
  }

  const isLeagueAdmin = await getLeagueAdmin(userId, auction.leagueId);
  if (!isLeagueAdmin) {
    return createError(ACQUISITION_ERRORS.ADMIN_REQUIRED);
  }

  return createSuccess("", { auction, userId });
}

async function getAuctionParticipantById(participantId: string) {
  const [participant] = await db
    .select()
    .from(auctionParticipants)
    .where(eq(auctionParticipants.id, participantId));

  return participant;
}
