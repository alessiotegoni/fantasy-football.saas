"use server";

import { validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/utils/helpers";
import {
  canCreateBonusMaluses,
  canDeleteBonusMalus,
  canUpdateBonusMalus,
} from "../permissions/BonusMalus";
import {
  createBonusMalusSchema,
  CreateBonusMalusSchema,
  deleteBonusMalusSchema,
  DeleteBonusMalusSchema,
  editBonusMalusSchema,
  EditBonusMalusSchema,
} from "../schema/bonusMalus";
import {
  insertBonusMalus,
  updateBonusMalus as updateBonusMalusDB,
  deleteBonusMalus as deleteBonusMalusDB,
} from "../db/bonusMalus";

enum BONUS_MALUS_MESSAGES {
  ADDED_SUCCESSFULLY = "Bonus/malus assegnati con successo!",
  UPDATED_SUCCESSFULLY = "Bonus/malus aggiornato con successo!",
  DELETED_SUCCESSFULLY = "Bonus/malus eliminato con successo!",
}

export async function createBonusMaluses(values: CreateBonusMalusSchema) {
  const { isValid, data, error } = validateSchema<CreateBonusMalusSchema>(
    createBonusMalusSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canCreateBonusMaluses(data.bonusMaluses);
  if (permissions.error) return permissions;

  await insertBonusMalus(data.bonusMaluses);

  return createSuccess(BONUS_MALUS_MESSAGES.ADDED_SUCCESSFULLY, null);
}

export async function updateBonusMalus(values: EditBonusMalusSchema) {
  const { isValid, data, error } = validateSchema<EditBonusMalusSchema>(
    editBonusMalusSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateBonusMalus(data);
  if (permissions.error) return permissions;

  const { id, bonusMalusTypeId, count } = data;

  await updateBonusMalusDB(id, { bonusMalusTypeId, count });

  return createSuccess(BONUS_MALUS_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteBonusMalus(values: DeleteBonusMalusSchema) {
  const { isValid, data, error } = validateSchema<DeleteBonusMalusSchema>(
    deleteBonusMalusSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canDeleteBonusMalus(data);
  if (permissions.error) return permissions;

  await deleteBonusMalusDB(data.bonusMalusId);

  return createSuccess(BONUS_MALUS_MESSAGES.DELETED_SUCCESSFULLY, null);
}
