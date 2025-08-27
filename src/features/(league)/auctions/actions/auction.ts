"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import {
  AuctionSchema,
  createAuctionSchema,
  CreateAuctionSchema,
  updateAuctionSchema,
  UpdateAuctionSchema,
  updateAuctionStatusSchema,
  UpdateAuctionStatusSchema,
} from "../schema/auctionSettings";
import {
  canCreateAuction,
  canDeleteAuction,
  canUpdateAuction,
  canUpdateAuctionStatus,
} from "../permissions/auction";
import { createSuccess } from "@/utils/helpers";
import { db } from "@/drizzle/db";
import {
  insertAuction,
  updateAuction as updateAuctionDB,
  deleteAuction as deleteAuctionDB,
} from "../db/auction";
import {
  insertAuctionSettings,
  updateAuctionSettings,
} from "../db/auctionSettings";
import { redirect } from "next/navigation";
import { updateLeagueSettings } from "../../settings/db/setting";
import { getLeagueVisibility } from "../../leagues/queries/league";
import { updateLeagueTeams } from "../../teams/db/leagueTeam";
import { addTeamsCredits } from "../../(admin)/handle-credits/db/handle-credits";
import { getGeneralSettings } from "../../settings/queries/setting";
import { getAuctionParticipants } from "../queries/auctionParticipant";
import {
  deleteTeamsPlayers,
  insertTeamsPlayers,
} from "../../teamsPlayers/db/teamsPlayer";
import { auctionAcquisitions, auctionParticipants } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

enum AUCTION_MESSAGES {
  AUCTION_CREATED_SUCCESFULLY = "Asta creata con successo",
  AUCTION_UPDATED_SUCCESFULLY = "Asta aggiornata con successo",
  AUCTION_STATUS_UPDATED_SUCCESFULLY = "Stato dell'asta aggiornato con successo",
  AUCTION_DELETED_SUCCESFULLY = "Asta eliminata con successo",
}

export async function createAuction(values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<CreateAuctionSchema>(
    createAuctionSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canCreateAuction(data);
  if (permissions.error) return permissions;

  const { userTeamId, splitId, leagueTeams } = permissions.data;

  await db.transaction(async (tx) => {
    const auctionId = await insertAuction(
      { ...data, createdBy: userTeamId, splitId },
      tx
    );
    await insertAuctionSettings({ auctionId, ...data }, tx);

    const teamsIds = leagueTeams.map((team) => team.id);

    if (data.type === "classic") {
      await createClassicAuction(data, teamsIds, tx);
    }
    if (data.type === "repair" && data.creditsToAdd) {
      await createRepairAuction(data, teamsIds, tx);
    }
  });

  return createSuccess(AUCTION_MESSAGES.AUCTION_CREATED_SUCCESFULLY, null);
}

export async function updateAuction(auctionId: string, values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<UpdateAuctionSchema>(
    updateAuctionSchema,
    { id: auctionId, ...values }
  );
  if (!isValid) return error;

  console.log(data);

  const permissions = await canUpdateAuction(data);
  if (permissions.error) return permissions;

  const {
    auction: { leagueId },
  } = permissions.data;
  const { id, type, ...updatedAuction } = data;

  await db.transaction(async (tx) => {
    await updateAuctionDB(id, updatedAuction, tx);
    await updateAuctionSettings(id, updatedAuction, tx);

    if (type === "classic") {
      const visibility = await getLeagueVisibility(leagueId);
      await updateLeagueSettings(
        { playersPerRole: data.playersPerRole, leagueId },
        visibility,
        tx
      );
    }
  });

  redirect(`/leagues/${leagueId}/premium/auctions/${id}`);
}

export async function updateAuctionStatus(values: UpdateAuctionStatusSchema) {
  const { isValid, data, error } = validateSchema<UpdateAuctionStatusSchema>(
    updateAuctionStatusSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateAuctionStatus(data);
  if (permissions.error) return permissions;

  const { status } = data;
  const { auction } = permissions.data;

  const timestampts: { startedAt: Date | null; endedAt: Date | null } = {
    startedAt: null,
    endedAt: null,
  };
  if (status === "active") timestampts.startedAt = new Date();
  if (status === "ended") timestampts.endedAt = new Date();

  await db.transaction(async (tx) => {
    await updateAuctionDB(auction.id, { status, ...timestampts }, tx);

    if (status === "ended") await importTeamsPlayers(auction, tx);
  });

  return createSuccess(
    AUCTION_MESSAGES.AUCTION_STATUS_UPDATED_SUCCESFULLY,
    null
  );
}

export async function deleteAuction(auctionId: string) {
  const {
    isValid,
    data: id,
    error,
  } = validateSchema<string>(getUUIdSchema(), auctionId);
  if (!isValid) return error;

  const permissions = await canDeleteAuction(id);
  if (permissions.error) return permissions;

  await deleteAuctionDB(id);

  return createSuccess(AUCTION_MESSAGES.AUCTION_DELETED_SUCCESFULLY, null);
}

async function createClassicAuction(
  data: Extract<CreateAuctionSchema, { type: "classic" }>,
  teamsIds: string[],
  tx: Omit<typeof db, "$client"> = db
) {
  const visibility = await getLeagueVisibility(data.leagueId);
  await updateLeagueSettings(data, visibility, tx);

  await updateLeagueTeams(
    teamsIds,
    data.leagueId,
    {
      credits: data.initialCredits,
    },
    tx
  );
}

async function createRepairAuction(
  data: Extract<CreateAuctionSchema, { type: "repair" }>,
  teamsIds: string[],
  tx: Omit<typeof db, "$client"> = db
) {
  const { initialCredits } = await getGeneralSettings(data.leagueId);

  await addTeamsCredits(
    teamsIds,
    data.leagueId,
    data.creditsToAdd,
    initialCredits,
    tx
  );
}

async function importTeamsPlayers(
  auction: { id: string; leagueId: string },
  tx: Omit<typeof db, "$client"> = db
) {
  const auctionParticipants = await getAuctionParticipants(auction.id);

  const teamsIds = auctionParticipants
    .map((p) => p.team?.id)
    .filter((teamId) => teamId !== undefined);
  if (!teamsIds.length) return;

  await deleteTeamsPlayers(auction.leagueId, { membersTeamsIds: teamsIds }, tx);

  const acquisitions = await getAuctionAcquisitions(auction.id);
  if (!acquisitions.length) return;

  const newTeamsPlayers = acquisitions
    .filter((a) => a.teamId !== null)
    .map((a) => ({
      playerId: a.playerId,
      purchaseCost: a.price,
      memberTeamId: a.teamId!,
    }));

  await insertTeamsPlayers(auction.leagueId, newTeamsPlayers, tx);
}

async function getAuctionAcquisitions(auctionId: string) {
  const acquisitions = await db.query.auctionAcquisitions.findMany({
    where: eq(auctionAcquisitions.auctionId, auctionId),
    with: {
      participant: {
        columns: {
          teamId: true,
        },
      },
    },
  });

  return acquisitions.map(({ participant, ...rest }) => ({
    ...rest,
    teamId: participant?.teamId ?? null,
  }));
}
