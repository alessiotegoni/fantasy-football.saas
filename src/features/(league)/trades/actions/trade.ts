"use server"

import { tradeProposalSchema, TradeProposalSchema } from "../schema/trade";

export async function addTrade(values: TradeProposalSchema) {
        const { success, data } = tradeProposalSchema.safeParse(values)

        if (!success)
}
