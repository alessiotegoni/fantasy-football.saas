"use server";

import { getSerialIdSchema, validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/utils/helpers";
import { canManageSplitMatchday } from "../permissions/splitMatchday";
import {
  createSplitMatchdaysSchema,
  CreateSplitMatchdaysSchema,
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

export async function createSplitMatchdays(values: CreateSplitMatchdaysSchema) {
  const { isValid, data, error } = validateSchema<CreateSplitMatchdaysSchema>(
    createSplitMatchdaysSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canManageSplitMatchday();
  if (permissions.error) return permissions;

  await insertSplitMatchday(data.matchdays);

  return createSuccess(SPLIT_MATCHDAY_MESSAGES.ADDED_SUCCESSFULLY, null);
}

export async function updateSplitMatchday(values: UpdateSplitMatchdaySchema) {
  const { isValid, data, error } = validateSchema<UpdateSplitMatchdaySchema>(
    updateSplitMatchdaySchema,
    values
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
