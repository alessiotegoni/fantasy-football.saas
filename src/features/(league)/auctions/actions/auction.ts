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
import { insertAuction } from "../db/auctions";
import { insertAuctionSettings } from "../db/auctionSettings";
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

  const { userId, splitId, teamsIds } = permissions.data;

  await db.transaction(async (tx) => {
    const auctionId = await insertAuction(
      { ...data, createdBy: userId, splitId },
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

export async function updateAuction(id: string, values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<UpdateAuctionSchema>(
    updateAuctionSchema,
    { id, ...values }
  );
  if (!isValid) return error;

  const permissions = await canUpdateAuction(data);

  return createSuccess(AUCTION_MESSAGES.AUCTION_UPDATED_SUCCESFULLY, null);
}
