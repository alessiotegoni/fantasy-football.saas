"use server";

import { validateSchema } from "@/schema/helpers";
import {
  AuctionSchema,
  createAuctionSchema,
  CreateAuctionSchema,
  updateAuctionSchema,
  UpdateAuctionSchema,
} from "../schema/auctionSettings";
import { canCreateAuction, canUpdateAuction } from "../permissions/auction";
import { createSuccess } from "@/lib/helpers";
import { db } from "@/drizzle/db";
import { insertAuction, updateAuction as updateAuctionDB } from "../db/auction";
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
