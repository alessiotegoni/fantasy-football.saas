"use server";

import { db } from "@/drizzle/db";
import { createSuccess } from "@/utils/helpers";
import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import {
  deleteAcquisition as deleteAcquisitionDB,
  insertAcquisitions,
} from "../db/auctionAcquisition";
import {
  setAuctionTurn,
  updateParticipantCredits,
} from "../db/auctionParticipant";
import {
  canAddAcquisitionPlayer,
  canConfirmAcquisition,
  canRemoveAcquiredPlayer,
} from "../permissions/auctionAcquisition";
import {
  addAcquisitionPlayerSchema,
  AddAcquisitionPlayerSchema,
} from "../schema/auctionAcquisition";
import { deleteNomination, updateNomination } from "../db/auctionNomination";
import { getNominationByPlayer } from "../queries/auctionNomination";
import {
  auctionAcquisitions,
  auctionBids,
  auctionNominations,
  PlayersPerRole,
} from "@/drizzle/schema";
import { isRoleFull } from "../utils/auctionParticipant";
import {
  AuctionParticipant,
  getAuctionParticipants,
  getParticipantPlayersCountByRole,
} from "../queries/auctionParticipant";
import { getHighestBid } from "../queries/auctionBid";
import { Player } from "@/features/players/queries/player";

enum ACQUISITION_MESSAGES {
  ACQUISITION_CONFIRMED_SUCCESSFULLY = "Giocatore confermato con successo",
  PLAYER_ACQUIRED_SUCCESSFULLY = "Giocatore acquisito con successo",
  ACQUISITION_DELETED_SUCCESSFULLY = "Acquisizione eliminata con successo",
}

export async function confirmAcquisition(values: AddAcquisitionPlayerSchema) {
  const { isValid, data, error } = validateSchema<AddAcquisitionPlayerSchema>(
    addAcquisitionPlayerSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canConfirmAcquisition(data);
  if (permissions.error) return permissions;

  const {
    participant,
    nomination,
    player,
    auctionSettings: { playersPerRole },
  } = permissions.data;

  const highestBid = await getHighestBid(nomination.id);

  await db.transaction(async (tx) => {
    const acquisitionData = getAcquisitionData(nomination, highestBid);

    await insertAcquisitions([acquisitionData], tx);
    await updateNomination(nomination.id, { status: "sold" }, tx);
    await updateParticipantCredits(participant.id, -data.price, tx);

    const participants = await getAuctionParticipants(nomination.auctionId);
    if (participants.length > 1) {
      await setNextTurn(
        {
          participants,
          player,
          auctionId: nomination.auctionId,
          playersPerRole,
        },
        tx
      );
    }
  });

  return createSuccess(
    ACQUISITION_MESSAGES.ACQUISITION_CONFIRMED_SUCCESSFULLY,
    ""
  );
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
    await insertAcquisitions([data], tx);

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

async function setNextTurn(
  {
    auctionId,
    participants,
    playersPerRole,
    player,
  }: {
    auctionId: string;
    participants: AuctionParticipant[];
    playersPerRole: PlayersPerRole;
    player: Player;
  },
  tx: Omit<typeof db, "$client">
) {
  const currentIndex = participants.findIndex((p) => p.isCurrent);

  const nextParticipant = await findNextParticipant(
    participants,
    currentIndex,
    playersPerRole,
    auctionId,
    player.role.id
  );

  if (nextParticipant) {
    await setAuctionTurn(auctionId, nextParticipant.id, tx);
  }
}

async function findNextParticipant(
  participants: { id: string; isCurrent: boolean }[],
  currentIndex: number,
  playersPerRole: PlayersPerRole,
  auctionId: string,
  playerRoleId: number
) {
  let nextIndex = (currentIndex + 1) % participants.length;

  let attempts = 0;

  while (attempts < participants.length) {
    const nextParticipant = participants[nextIndex];

    const playerCounts = await getParticipantPlayersCountByRole(
      auctionId,
      nextParticipant.id
    );

    console.log(nextParticipant);


    if (!isRoleFull(playerCounts, playersPerRole, playerRoleId)) {
      console.log("roles not full");

      return nextParticipant;
    }

    nextIndex = (nextIndex + 1) % participants.length;
    attempts++;
  }

  return null;
}

function getAcquisitionData(
  nomination: typeof auctionNominations.$inferSelect,
  highestBid: typeof auctionBids.$inferSelect | undefined
): typeof auctionAcquisitions.$inferInsert {
  if (highestBid) {
    return {
      auctionId: nomination.auctionId,
      playerId: nomination.playerId,
      participantId: highestBid.participantId,
      price: highestBid.amount,
    };
  } else {
    return {
      auctionId: nomination.auctionId,
      playerId: nomination.playerId,
      participantId: nomination.nominatedBy,
      price: nomination.initialPrice,
    };
  }
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
