"use server";

import { createSuccess } from "@/utils/helpers";
import { validateSchema } from "@/schema/helpers";
import { insertBid } from "../db/auctionBid";
import { canCreateBid } from "../permissions/auctionBid";
import { CreateBidSchema, createBidSchema } from "../schema/auctionBid";
import { getAuctionSettings } from "../queries/auctionSettings";
import { getNomination } from "../queries/auctionNomination";
import { cancelExpiryJob, scheduleExpiryJob } from "../utils/pg-boss";
import { db } from "@/drizzle/db";
import { updateNomination } from "../db/auctionNomination";

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

  const { nomination, othersCallsTime } = permissions.data;

  await db.transaction(async (tx) => {
    await insertBid(data, tx);

    const newExpiresAt = new Date();
    newExpiresAt.setSeconds(
      newExpiresAt.getSeconds() + othersCallsTime
    );

    await updateNomination(
      data.nominationId,
      {
        expiresAt: newExpiresAt,
      },
      tx
    );

    await cancelExpiryJob(data.nominationId);
    await scheduleExpiryJob(nomination.id, newExpiresAt);
  });

  return createSuccess(AUCTION_BID_MESSAGES.BID_CREATED_SUCCESSFULLY, null);
}
