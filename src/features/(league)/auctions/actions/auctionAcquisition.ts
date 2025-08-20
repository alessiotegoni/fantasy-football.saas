"use server";

import { db } from "@/drizzle/db";
import { createSuccess } from "@/lib/helpers";
import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import {
  deleteAcquisition as deleteAcquisitionDB,
  insertAcquisition,
} from "../db/auctionAcquisition";
import { updateParticipantCredits } from "../db/auctionParticipant";
import {
  canAddAcquisitionPlayer,
  canRemoveAcquiredPlayer,
} from "../permissions/auctionAcquisition";
import {
  addAcquisitionPlayerSchema,
  AddAcquisitionPlayerSchema,
} from "../schema/auctionAcquisition";
import { deleteNomination } from "../db/auctionNomination";
import { getNominationByPlayer } from "../queries/auctionNomination";

enum ACQUISITION_MESSAGES {
  PLAYER_ACQUIRED_SUCCESSFULLY = "Giocatore acquisito con successo",
  ACQUISITION_DELETED_SUCCESSFULLY = "Acquisizione eliminata con successo",
}

export async function addAcquisitionPlayer(values: AddAcquisitionPlayerSchema) {
  const { isValid, data, error } = validateSchema<AddAcquisitionPlayerSchema>(
    addAcquisitionPlayerSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canAddAcquisitionPlayer(data);
  if (permissions.error) return permissions;

  const { participant } = permissions.data;

  await db.transaction(async (tx) => {
    await insertAcquisition(data, tx);

    await updateParticipantCredits(participant.id, -data.price, tx);

    await deleteNominationIfExists(data, tx);
  });

  return createSuccess(ACQUISITION_MESSAGES.PLAYER_ACQUIRED_SUCCESSFULLY, null);
}

export async function removeAcquiredPlayer(acquisitionId: string) {
  const { isValid, error } = validateSchema<string>(
    getUUIdSchema(),
    acquisitionId
  );
  if (!isValid) return error;

  const permissions = await canRemoveAcquiredPlayer(acquisitionId);
  if (permissions.error) return permissions;

  const { acquisition } = permissions.data;

  await db.transaction(async (tx) => {
    await deleteAcquisitionDB(acquisition.id, tx);

    await updateParticipantCredits(
      acquisition.participantId,
      acquisition.price,
      tx
    );

    await deleteNominationIfExists(acquisition, tx);
  });

  return createSuccess(
    ACQUISITION_MESSAGES.ACQUISITION_DELETED_SUCCESSFULLY,
    null
  );
}

async function deleteNominationIfExists(
  {
    auctionId,
    playerId,
  }: {
    auctionId: string;
    playerId: number;
  },
  tx: Omit<typeof db, "$client"> = db
) {
  const nomination = await getNominationByPlayer(auctionId, playerId);
  if (nomination) await deleteNomination(nomination.id, tx);
}
