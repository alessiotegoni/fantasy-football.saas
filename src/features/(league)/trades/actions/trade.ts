"use server";

import { getUserId } from "@/features/users/utils/user";
import { getError } from "../db/trade";
import { tradeProposalSchema, TradeProposalSchema } from "../schema/trade";
import { db } from "@/drizzle/db";

export async function addTrade(values: TradeProposalSchema) {
  const { success, data } = tradeProposalSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();

  const [] = await db.transaction(async (tx) => {
    const tradeId = await
  })
}
