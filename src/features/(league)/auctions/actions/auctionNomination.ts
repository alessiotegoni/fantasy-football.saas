"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import {
  createNominationSchema,
  CreateNominationSchema,
} from "../schema/auctionNomination";
import {
  canCreateNomination,
  canDeleteNomination,
} from "../permissions/auctionNomination";
import { createSuccess } from "@/lib/helpers";
import {
  insertNomination,
  deleteNomination as deleteNominationDB,
} from "../db/auctionNomination";

enum AUCTION_NOMINATION_MESSAGES {
  NOMINATION_CREATED_SUCCESSFULLY = "Nomina creata con successo",
  NOMINATION_DELETED_SUCCESSFULLY = "Nomina eliminata con successo",
}

export async function createNomination(values: CreateNominationSchema) {
  const { isValid, data, error } = validateSchema<CreateNominationSchema>(
    createNominationSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canCreateNomination(data);
  if (permissions.error) return permissions;

  const { participant } = permissions.data;

  await insertNomination({
    ...data,
    nominatedBy: participant.id,
  });

  return createSuccess(
    AUCTION_NOMINATION_MESSAGES.NOMINATION_CREATED_SUCCESSFULLY,
    null
  );
}

export async function deleteNomination(nominationId: string) {
  const { isValid, data, error } = validateSchema<string>(
    getUUIdSchema(),
    nominationId
  );
  if (!isValid) return error;

  const permissions = await canDeleteNomination(data);
  if (permissions.error) return permissions;

  await deleteNominationDB(data);

  return createSuccess(
    AUCTION_NOMINATION_MESSAGES.NOMINATION_DELETED_SUCCESSFULLY,
    null
  );
}
