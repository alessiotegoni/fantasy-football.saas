"use server";

import { createError, createSuccess } from "@/lib/helpers";
import { matchLineupSchema, MatchLineupSchema } from "../schema/match";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getUserId } from "@/features/users/utils/user";
import { canSaveLineup } from "../permissions/match";
import { db } from "@/drizzle/db";
import { deleteLineupPlayers, insertLineup, insertLineupPlayers } from "../db/match";

export async function saveLineup(values: MatchLineupSchema) {
  const { success, data } = await matchLineupSchema.safeParseAsync(values);
  if (!success) return createError(VALIDATION_ERROR);

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const validation = await canSaveLineup({ ...data, userId });
  if (validation.error) return validation;

  console.log(data);
  return createSuccess("", null);
}
