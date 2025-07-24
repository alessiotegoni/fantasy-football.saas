"use server";

import { validateSchema } from "@/schema/helpers";
import { matchLineupSchema, MatchLineupSchema } from "../schema/match";

export async function saveLineup(values: MatchLineupSchema) {
  const { isValid, error, data } = validateSchema<MatchLineupSchema>(
    matchLineupSchema,
    values
  );
  if (!isValid) return error;

  

}
