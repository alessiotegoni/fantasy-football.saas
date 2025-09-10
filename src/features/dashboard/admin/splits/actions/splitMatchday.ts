"use server";

import { getSerialIdSchema, validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/utils/helpers";
import { canManageSplitMatchday } from "../permissions/splitMatchday";
import {
  splitMatchdaySchema,
  SplitMatchdaySchema,
  updateSplitMatchdaySchema,
  UpdateSplitMatchdaySchema,
} from "../schema/splitMatchday";
import {
  insertSplitMatchday,
  updateSplitMatchday as updateSplitMatchdayDB,
  deleteSplitMatchday as deleteSplitMatchdayDB,
} from "../db/splitMatchday";

enum SPLIT_MATCHDAY_MESSAGES {
  ADDED_SUCCESSFULLY = "Giornata aggiunta con successo!",
  UPDATED_SUCCESSFULLY = "Giornata aggiornata con successo!",
  DELETED_SUCCESSFULLY = "Giornata eliminata con successo!",
}

export async function createSplitMatchday(values: SplitMatchdaySchema) {
  const { isValid, data, error } = validateSchema<SplitMatchdaySchema>(
    splitMatchdaySchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canManageSplitMatchday();
  if (permissions.error) return permissions;

  await insertSplitMatchday(data);

  return createSuccess(SPLIT_MATCHDAY_MESSAGES.ADDED_SUCCESSFULLY, null);
}

export async function updateSplitMatchday(
  id: number,
  values: SplitMatchdaySchema
) {
  const { isValid, data, error } = validateSchema<UpdateSplitMatchdaySchema>(
    updateSplitMatchdaySchema,
    { id, ...values }
  );
  if (!isValid) return error;

  const permissions = await canManageSplitMatchday();
  if (permissions.error) return permissions;

  const { id: splitMatchdayId, ...splitMatchday } = data;

  await updateSplitMatchdayDB(splitMatchdayId, splitMatchday);

  return createSuccess(SPLIT_MATCHDAY_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteSplitMatchday(splitMatchdayId: number) {
  const { isValid, error } = validateSchema<number>(
    getSerialIdSchema(),
    splitMatchdayId
  );
  if (!isValid) return error;

  const permissions = await canManageSplitMatchday();
  if (permissions.error) return permissions;

  await deleteSplitMatchdayDB(splitMatchdayId);

  return createSuccess(SPLIT_MATCHDAY_MESSAGES.DELETED_SUCCESSFULLY, null);
}
