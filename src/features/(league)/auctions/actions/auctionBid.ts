"use server";

import { createSuccess } from "@/lib/helpers";
import { validateSchema } from "@/schema/helpers";
import { insertBid } from "../db/auctionBid";
import { canCreateBid } from "../permissions/auctionBid";
import { CreateBidSchema, createBidSchema } from "../schema/auctionBid";

enum AUCTION_BID_MESSAGES {
  BID_CREATED_SUCCESSFULLY = "Offerta piazzata con successo",
}

export async function createBid(values: CreateBidSchema) {
  const { isValid, data, error } = validateSchema<CreateBidSchema>(
    createBidSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canCreateBid(data);
  if (permissions.error) return permissions;

  await insertBid(data);

  return createSuccess(AUCTION_BID_MESSAGES.BID_CREATED_SUCCESSFULLY, null);
}
