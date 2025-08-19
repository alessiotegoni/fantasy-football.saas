"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/lib/helpers";
import {
  canJoinAuction,
  participantActionPermissions,
} from "../permissions/auctionParticipant";
import {
  insertAuctionParticipant,
  updateAuctionParticipant as updateAuctionParticipantDB,
  deleteAuctionParticipant as deleteAuctionParticipantDB,
} from "../db/auctionParticipant";
import { redirect } from "next/navigation";
import {
  auctionParticipantSchema,
  AuctionParticipantSchema,
  UpdateAuctionParticipantSchema,
} from "../schema/auctionParticipant";

enum AUCTION_PARTICIPANT_MESSAGES {
  UPDATED_SUCCESSFULLY = "Partecipante aggiornato con successo",
  DELETED_SUCCESSFULLY = "Partecipante eliminato con successo",
}

export async function joinAuction(auctionId: string) {
  const { isValid, data, error } = validateSchema<string>(
    getUUIdSchema(),
    auctionId
  );
  if (!isValid) return error;

  const permissions = await canJoinAuction(data);
  if (permissions.error) return permissions;

  const {
    auction: { id, leagueId },
    userTeamId,
    isAlreadyParticipant,
  } = permissions.data;

  if (!isAlreadyParticipant) {
    await insertAuctionParticipant({
      auctionId,
      teamId: userTeamId,
    });
  }

  redirect(`/leagues/${leagueId}/premium/auctions/${id}`);
}

export async function updateAuctionParticipant(
  values: UpdateAuctionParticipantSchema
) {
  const { isValid, data, error } =
    validateSchema<UpdateAuctionParticipantSchema>(
      updateAuctionParticipantSchema,
      values
    );
  if (!isValid) return error;

  const permissions = await participantActionPermissions(data);
  if (permissions.error) return permissions;

  await updateAuctionParticipantDB(permissions.data.participant.id, data);

  return createSuccess(AUCTION_PARTICIPANT_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteAuctionParticipant(
  values: AuctionParticipantSchema
) {
  const { isValid, data, error } = validateSchema<AuctionParticipantSchema>(
    auctionParticipantSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await participantActionPermissions(data);
  if (permissions.error) return permissions;

  await deleteAuctionParticipantDB(permissions.data.participant.id);

  return createSuccess(AUCTION_PARTICIPANT_MESSAGES.DELETED_SUCCESSFULLY, null);
}
