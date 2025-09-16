"use server";

import { validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/utils/helpers";
import {
  canCreateVotes,
  canDeleteVote,
  canUpdateVote,
} from "../permissions/vote";
import {
  createVotesSchema,
  CreateVotesSchema,
  deleteVoteSchema,
  DeleteVoteSchema,
  editVoteSchema,
  EditVoteSchema,
} from "../schema/vote";
import {
  insertVotes,
  updateVote as updateVoteDB,
  deleteVote as deleteVoteDB,
} from "../db/vote";

enum VOTE_MESSAGES {
  ADDED_SUCCESSFULLY = "Voti assegnati con successo!",
  UPDATED_SUCCESSFULLY = "Voto aggiornato con successo!",
  DELETED_SUCCESSFULLY = "Voto eliminato con successo!",
}

export async function createVotes(values: CreateVotesSchema) {
  const { isValid, data, error } = validateSchema<CreateVotesSchema>(
    createVotesSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canCreateVotes(data.votes);
  if (permissions.error) return permissions;

  const { userRedaction } = permissions.data;

  await insertVotes(
    data.votes.map((vote) => ({
      ...vote,
      redactionId: userRedaction.id,
      vote: vote.vote.toString(),
    }))
  );

  return createSuccess(VOTE_MESSAGES.ADDED_SUCCESSFULLY, null);
}

export async function updateVote(values: EditVoteSchema) {
  const { isValid, data, error } = validateSchema<EditVoteSchema>(
    editVoteSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateVote(data);
  if (permissions.error) return permissions;

  const { id, vote } = data;

  await updateVoteDB(id, { vote: vote.toString() });

  return createSuccess(VOTE_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteVote(values: DeleteVoteSchema) {
  const { isValid, data, error } = validateSchema<DeleteVoteSchema>(
    deleteVoteSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canDeleteVote(data);
  if (permissions.error) return permissions;

  await deleteVoteDB(data.voteId);

  return createSuccess(VOTE_MESSAGES.DELETED_SUCCESSFULLY, null);
}
