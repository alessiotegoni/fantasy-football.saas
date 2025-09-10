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
import {
  insertSplit,
  updateSplit as updateSplitDB,
  deleteSplit as deleteSplitDB,
} from "../db/split";
import { redirect } from "next/navigation";

enum SPLIT_MESSAGES {
  ADDED_SUCCESSFULLY = "Split aggiunto con successo!",
  UPDATED_SUCCESSFULLY = "Split aggiornato con successo!",
  DELETED_SUCCESSFULLY = "Split eliminato con successo!",
}

export async function createSplit(values: SplitSchema) {
  const { isValid, data, error } = validateSchema<SplitSchema>(
    splitSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canManageSplit();
  if (permissions.error) return permissions;

  const newSplit = {
    ...data,
    startDate: data.startDate.toDateString(),
    endDate: data.endDate.toDateString(),
  };

  await insertSplit(newSplit);

  return createSuccess(SPLIT_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function updateSplit(id: number, values: SplitSchema) {
  const { isValid, data, error } = validateSchema<UpdateSplitSchema>(
    updateSplitSchema,
    { id, values }
  );
  if (!isValid) return error;

  const permissions = await canManageSplit();
  if (permissions.error) return permissions;

  const { id: splitId, ...split } = data;

  const updatedSplit = {
    ...split,
    startDate: data.startDate.toDateString(),
    endDate: data.endDate.toDateString(),
  };

  await updateSplitDB(splitId, updatedSplit);

  return createSuccess(SPLIT_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteSplit(splitId: number) {
  const { isValid, error } = validateSchema<number>(
    getSerialIdSchema(),
    splitId
  );
  if (!isValid) return error;

  const permissions = await canManageSplit();
  if (permissions.error) return permissions;

  await deleteSplitDB(splitId);

  return createSuccess(SPLIT_MESSAGES.DELETED_SUCCESSFULLY, null);
}
