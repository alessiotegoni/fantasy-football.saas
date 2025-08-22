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
import { createSuccess } from "@/utils/helpers";
import {
  insertNomination,
  deleteNomination as deleteNominationDB,
} from "../db/auctionNomination";
import {
  cancelExpiryJob,
  scheduleExpiryJob,
} from "../tasks/jobs/auctionNomination";

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

  // expiresAt e' calcolato automaticamente in base ai settaggi dell'asta
  // tramite un trigger chiamato prima dell'inserimento della nomination

  const nomination = await insertNomination({
    ...data,
    nominatedBy: participant.id,
  });

  await scheduleExpiryJob(nomination.id, nomination.expiresAt);

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
  await cancelExpiryJob(data);

  return createSuccess(
    AUCTION_NOMINATION_MESSAGES.NOMINATION_DELETED_SUCCESSFULLY,
    null
  );
}
