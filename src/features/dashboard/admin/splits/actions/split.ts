"use server";

import { getSerialIdSchema, validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/utils/helpers";
import { canManageSplit } from "../permissions/split";
import {
  splitSchema,
  SplitSchema,
  updateSplitSchema,
  UpdateSplitSchema,
} from "../schema/split";
import { deleteSplit, insertSplit, updateSplit } from "../db/split";

enum SPLIT_MESSAGES {
  ADDED_SUCCESSFULLY = "Split aggiunto con successo!",
  UPDATED_SUCCESSFULLY = "Split aggiornato con successo!",
  DELETED_SUCCESSFULLY = "Split eliminato con successo!",
}

export async function addSplit(values: SplitSchema) {
  const { isValid, data, error } = validateSchema<SplitSchema>(
    splitSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canManageSplit();
  if (permissions.error) return permissions;

  await insertSplit(data);

  return createSuccess(SPLIT_MESSAGES.ADDED_SUCCESSFULLY, null);
}

export async function updateCurrentSplit(id: number, values: SplitSchema) {
  const { isValid, data, error } = validateSchema<UpdateSplitSchema>(
    updateSplitSchema,
    { id, values }
  );
  if (!isValid) return error;

  const permissions = await canManageSplit();
  if (permissions.error) return permissions;

  const { id: splitId, ...split } = data

  await updateSplit(splitId, split);

  return createSuccess(SPLIT_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteCurrentSplit(splitId: number) {
  const { isValid, error } = validateSchema<number>(
    getSerialIdSchema(),
    splitId
  );
  if (!isValid) return error;

  const permissions = await canManageSplit();
  if (permissions.error) return permissions;

  await deleteSplit(splitId);

  return createSuccess(SPLIT_MESSAGES.DELETED_SUCCESSFULLY, null);
}
