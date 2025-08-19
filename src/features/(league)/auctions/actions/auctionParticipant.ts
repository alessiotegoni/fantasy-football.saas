"use server";

import { validateSchema } from "@/schema/helpers";
import {
  joinAuctionSchema,
  JoinAuctionSchema,
  updateAuctionParticipantSchema,
  UpdateAuctionParticipantSchema,
  deleteAuctionParticipantSchema,
  DeleteAuctionParticipantSchema,
} from "../schema/auctionParticipant";
import {
  canJoinAuction,
  canUpdateAuctionParticipant,
  canDeleteAuctionParticipant,
} from "../permissions/auctionParticipant";
import { createSuccess } from "@/lib/helpers";
import {
  insertAuctionParticipant,
  updateAuctionParticipant as updateAuctionParticipantDB,
  deleteAuctionParticipant as deleteAuctionParticipantDB,
} from "../db/auctionParticipants";

enum AUCTION_PARTICIPANT_MESSAGES {
  JOINED_SUCCESSFULLY = "Ti sei unito all'asta con successo",
  UPDATED_SUCCESSFULLY = "Partecipante aggiornato con successo",
  DELETED_SUCCESSFULLY = "Partecipante eliminato con successo",
}

export async function joinAuction(values: JoinAuctionSchema) {
  const { isValid, data, error } = validateSchema<JoinAuctionSchema>(
    joinAuctionSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canJoinAuction(data);
  if (permissions.error) return permissions;

  const { userTeamId } = permissions.data;

  await insertAuctionParticipant({
    ...data,
    teamId: userTeamId,
  });

  return createSuccess(AUCTION_PARTICIPANT_MESSAGES.JOINED_SUCCESSFULLY, null);
}

export async function updateAuctionParticipant(
  values: UpdateAuctionParticipantSchema
) {
  const { isValid, data, error } = validateSchema<UpdateAuctionParticipantSchema>(
    updateAuctionParticipantSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateAuctionParticipant(data);
  if (permissions.error) return permissions;

  const { participantId, ...updateData } = data;

  await updateAuctionParticipantDB(participantId, updateData);

  return createSuccess(AUCTION_PARTICIPANT_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteAuctionParticipant(
  values: DeleteAuctionParticipantSchema
) {
  const { isValid, data, error } = validateSchema<DeleteAuctionParticipantSchema>(
    deleteAuctionParticipantSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canDeleteAuctionParticipant(data);
  if (permissions.error) return permissions;

  await deleteAuctionParticipantDB(data.participantId);

  return createSuccess(AUCTION_PARTICIPANT_MESSAGES.DELETED_SUCCESSFULLY, null);
}
