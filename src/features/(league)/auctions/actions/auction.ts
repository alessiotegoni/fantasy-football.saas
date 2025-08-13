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
import { createSuccess } from "@/lib/helpers";
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

enum AUCTION_MESSAGES {
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

  const { userTeamId, splitId, teamsIds } = permissions.data;

  await db.transaction(async (tx) => {
    const auctionId = await insertAuction(
      { ...data, createdBy: userTeamId, splitId },
      tx
    );
    await insertAuctionSettings({ auctionId, ...data }, tx);

    if (data.type === "classic") {
      const visibility = await getLeagueVisibility(data.leagueId);
      await updateLeagueSettings(data, visibility, tx);

      await updateLeagueTeams(teamsIds, data.leagueId, {
        credits: data.initialCredits,
      });
    }

    if (data.type === "repair") {
      // TODO: scegliere come aggiungere i crediti (creditsToAdd) a tutti i team
    }
  });

  redirect(`/leagues/${data.leagueId}/premium/auctions`);
}

export async function updateAuction(auctionId: string, values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<UpdateAuctionSchema>(
    updateAuctionSchema,
    { auctionId, ...values }
  );
  if (!isValid) return error;

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

  return createSuccess(AUCTION_MESSAGES.AUCTION_UPDATED_SUCCESFULLY, null);
}

export async function updateAuctionStatus(values: UpdateAuctionStatusSchema) {
  const { isValid, data, error } = validateSchema<UpdateAuctionStatusSchema>(
    updateAuctionStatusSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateAuctionStatus(data);
  if (permissions.error) return permissions;

  const { id, status } = data;
  await updateAuctionDB(id, { status });

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
