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

enum AUCTION_MESSAGES {
  AUCTION_CREATED_SUCCESFULLY = "Profilo aggiornato con successo",
  AUCTION_UPDATED_SUCCESFULLY = "Profilo aggiornato con successo",
}

export async function createAuction(values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<CreateAuctionSchema>(
    createAuctionSchema,
    values
  );
  if (!isValid) return error;

  console.log(data);

  const permissions = await canCreateAuction(data);
  if (permissions.error) return permissions

  

  return createSuccess(AUCTION_MESSAGES.AUCTION_CREATED_SUCCESFULLY, null);
}

export async function updateAuction(id: string, values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<UpdateAuctionSchema>(
    updateAuctionSchema,
    { id, ...values }
  );
  if (!isValid) return error;

  console.log(data);

  const permissions = await canUpdateAuction(data);

  return createSuccess(AUCTION_MESSAGES.AUCTION_UPDATED_SUCCESFULLY, null);
}
