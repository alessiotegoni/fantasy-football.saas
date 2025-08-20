"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/lib/helpers";
import {
  canJoinAuction,
  canUpdateParticipantsOrder,
  participantActionPermissions,
} from "../permissions/auctionParticipant";
import {
  insertAuctionParticipant,
  deleteAuctionParticipant as deleteAuctionParticipantDB,
  setAuctionTurn as setAuctionTurnDB,
  updateParticipantsOrder as updateParticipantsOrderDB,
} from "../db/auctionParticipant";
import { redirect } from "next/navigation";
import {
  auctionParticipantSchema,
  AuctionParticipantSchema,
  UpdateParticipantsOrderSchema,
  updateParticipantsOrderSchema,
} from "../schema/auctionParticipant";

enum AUCTION_PARTICIPANT_MESSAGES {
  TURN_SET_SUCCESSFULLY = "Turno impostato con successo",
  ORDER_UPDATED_SUCCESSFULLY = "Ordine aggiornato con successo",
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

export async function updateParticipantsOrder(
  values: UpdateParticipantsOrderSchema
) {
  const { isValid, data, error } =
    validateSchema<UpdateParticipantsOrderSchema>(
      updateParticipantsOrderSchema,
      values
    );
  if (!isValid) return error;

  const permissions = await canUpdateParticipantsOrder(data.auctionId);
  if (permissions.error) return permissions;

  await updateParticipantsOrderDB(data.auctionId, data.participantsIds);

  return createSuccess(
    AUCTION_PARTICIPANT_MESSAGES.ORDER_UPDATED_SUCCESSFULLY,
    null
  );
}

export async function setAuctionTurn(values: AuctionParticipantSchema) {
  const { isValid, data, error } = validateSchema<AuctionParticipantSchema>(
    auctionParticipantSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await participantActionPermissions(data);
  if (permissions.error) return permissions;

  await setAuctionTurnDB(
    permissions.data.participant.auctionId,
    permissions.data.participant.id
  );

  return createSuccess(
    AUCTION_PARTICIPANT_MESSAGES.TURN_SET_SUCCESSFULLY,
    null
  );
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
