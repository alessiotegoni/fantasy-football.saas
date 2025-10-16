"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import { createSuccess, Href } from "@/utils/helpers";
import {
  canJoinAuction,
  canUpdateParticipantsOrder,
  participantActionPermissions,
} from "../permissions/auctionParticipant";
import {
  insertParticipant,
  deleteParticipant as deleteParticipantDB,
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
import { db } from "@/drizzle/db";
import { auctionParticipants } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { getLeagueTeams } from "../../teams/queries/leagueTeam";
import { updateAuctionStatus } from "./auction";
import { updateAuction } from "../db/auction";
import { getTeamsPlayers } from "../../teamsPlayers/queries/teamsPlayer";
import { insertAcquisitions } from "../db/auctionAcquisition";
import { getAuctionParticipant } from "../queries/auctionParticipant";

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
    auction: { id, leagueId, status, type },
    userTeamId,
  } = permissions.data;

  const participant = await getAuctionParticipant(auctionId, userTeamId);

  await db.transaction(async (tx) => {
    let participantId = participant?.id;
    if (!participant) {
      participantId = await insertParticipant(
        {
          auctionId,
          teamId: userTeamId,
        },
        tx
      );
    }

    if (type === "repair") {
      await setParticipantAcquisitions(
        userTeamId,
        auctionId,
        participantId,
        tx
      );
    }

    if (status === "waiting") await setAuctionActive(id, leagueId, tx);
  });

  redirect(`/leagues/${leagueId}/premium/auctions/${id}` as Href);
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

  const { participant } = permissions.data;

  await db.transaction(async (tx) => {
    await setAuctionTurnDB(participant.auctionId, participant.id, tx);
  });

  return createSuccess(
    AUCTION_PARTICIPANT_MESSAGES.TURN_SET_SUCCESSFULLY,
    null
  );
}

export async function deleteParticipant(values: AuctionParticipantSchema) {
  const { isValid, data, error } = validateSchema<AuctionParticipantSchema>(
    auctionParticipantSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await participantActionPermissions(data);
  if (permissions.error) return permissions;

  await deleteParticipantDB(permissions.data.participant.id);

  return createSuccess(AUCTION_PARTICIPANT_MESSAGES.DELETED_SUCCESSFULLY, null);
}

async function setParticipantAcquisitions(
  userTeamId: string,
  auctionId: string,
  participantId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const participantPlayers = await getTeamsPlayers([userTeamId]);
  if (!participantPlayers.length) return;

  const newAcquisitions = participantPlayers.map((player) => ({
    playerId: player.id,
    auctionId,
    participantId,
    price: player.purchaseCost,
  }));

  await insertAcquisitions(newAcquisitions, tx);
}

async function setAuctionActive(
  id: string,
  leagueId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [leagueTeams, participantsCount] = await Promise.all([
    getLeagueTeams(leagueId),
    getParticipantCount(id),
  ]);

  if (leagueTeams.length === participantsCount) {
    await updateAuction(id, { status: "active" }, tx);
  }
}

async function getParticipantCount(auctionId: string) {
  const [res] = await db
    .select({ count: count() })
    .from(auctionParticipants)
    .where(eq(auctionParticipants.auctionId, auctionId));

  return res.count;
}
