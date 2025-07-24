"use server";

import { createSuccess } from "@/lib/helpers";
import { matchLineupSchema, MatchLineupSchema } from "../schema/match";

export async function saveLineup(values: MatchLineupSchema) {
  const { success, data } = await matchLineupSchema.safeParseAsync(values)
    console.log(data);
    return createSuccess("", null)
}
