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
  canAcquirePlayer,
  canDeleteAcquisition,
} from "../permissions/auctionAcquisition";
import { getHighestBid } from "../queries/auctionBid";
import {
  AcquirePlayerSchema,
  acquirePlayerSchema,
} from "../schema/auctionAcquisition";
import {
  deleteNomination,
  updateNominationStatus,
} from "../db/auctionNomination";
import { getNominationByPlayer } from "../queries/auctionNomination";

enum ACQUISITION_MESSAGES {
  PLAYER_ACQUIRED_SUCCESSFULLY = "Giocatore acquistato con successo",
  ACQUISITION_DELETED_SUCCESSFULLY = "Acquisto eliminato con successo",
}

export async function acquirePlayer(values: AcquirePlayerSchema) {
  const { isValid, data, error } = validateSchema<AcquirePlayerSchema>(
    acquirePlayerSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canAcquirePlayer(data.nominationId);
  if (permissions.error) return permissions;

  const { nomination } = permissions.data;

  const result = await db.transaction(async (tx) => {
    const highestBid = await getHighestBid(nomination.id);

    let winnerId: string;
    let price: number;

    if (highestBid) {
      winnerId = highestBid.participantId;
      price = highestBid.amount;
    } else {
      winnerId = nomination.nominatedBy;
      price = nomination.initialPrice;
    }

    await insertAcquisition(
      {
        auctionId: nomination.auctionId,
        participantId: winnerId,
        playerId: nomination.playerId,
        price: price,
      },
      tx
    );

    await updateParticipantCredits(winnerId, -price, tx);

    await updateNominationStatus(nomination.id, "sold", tx);

    return { winnerId, price };
  });

  return createSuccess(
    ACQUISITION_MESSAGES.PLAYER_ACQUIRED_SUCCESSFULLY,
    result
  );
}

export async function deleteAcquisition(acquisitionId: string) {
  const { isValid, error } = validateSchema<string>(
    getUUIdSchema(),
    acquisitionId
  );
  if (!isValid) return error;

  const permissions = await canDeleteAcquisition(acquisitionId);
  if (permissions.error) return permissions;

  const { acquisition } = permissions.data;

  await db.transaction(async (tx) => {
    await deleteAcquisitionDB(acquisition.id, tx);

    await updateParticipantCredits(
      acquisition.participantId,
      acquisition.price,
      tx
    );

    const nomination = await getNominationByPlayer(
      acquisition.auctionId,
      acquisition.playerId
    );
    if (nomination) await deleteNomination(nomination.id, tx);
  });

  return createSuccess(
    ACQUISITION_MESSAGES.ACQUISITION_DELETED_SUCCESSFULLY,
    null
  );
}
