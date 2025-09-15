"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import { createError, createSuccess } from "@/utils/helpers";
import {
  canCreateBonusMaluses,
  canDeleteBonusMalus,
  canManageBonusMalusForMatchday,
} from "../permissions/BonusMalus";
import {
  createBonusMalusSchema,
  CreateBonusMalusSchema,
  editBonusMalusSchema,
  EditBonusMalusSchema,
} from "../schema/bonusMalus";
import {
  insertBonusMalus,
  updateBonusMalus as updateBonusMalusDB,
  deleteBonusMalus as deleteBonusMalusDB,
} from "../db/bonusMalus";

enum BONUS_MALUS_MESSAGES {
  ADDED_SUCCESSFULLY = "Bonus/malus assegnato con successo!",
  UPDATED_SUCCESSFULLY = "Bonus/malus aggiornato con successo!",
  DELETED_SUCCESSFULLY = "Bonus/malus eliminato con successo!",
}

enum BONUS_MALUS_ERRORS {
  ALREADY_ASSIGNED = "Questo tipo di bonus/malus è già stato assegnato a questo giocatore per questa giornata.",
  NOT_FOUND = "Bonus/malus non trovato.",
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

  const permissions = await canManageBonusMalusForMatchday(data.matchdayId);
  if (permissions.error) return permissions;


  const { id, bonusMalusTypeId, count } = data;

  await updateBonusMalusDB(id, { bonusMalusTypeId, count });

  return createSuccess(BONUS_MALUS_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteBonusMalus(bonusMalusId: string) {
  const { isValid, error } = validateSchema<string>(
    getUUIdSchema(),
    bonusMalusId
  );
  if (!isValid) return error;

  const permissions = await canDeleteBonusMalus(
    bonusMalus.matchdayId
  );
  if (permissions.error) return permissions;

  await deleteBonusMalusDB(bonusMalusId);

  return createSuccess(BONUS_MALUS_MESSAGES.DELETED_SUCCESSFULLY, null);
}
