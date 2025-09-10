"use server";

import { getSerialIdSchema, validateSchema } from "@/schema/helpers";
import { createSuccess } from "@/utils/helpers";
import { canManageTeam } from "../permissions/team";
import { teamSchema, TeamSchema, updateTeamSchema, UpdateTeamSchema } from "../schema/team";
import {
  insertTeam,
  updateTeam as updateTeamDB,
  deleteTeam as deleteTeamDB,
} from "../db/team";

enum TEAM_MESSAGES {
  ADDED_SUCCESSFULLY = "Team aggiunto con successo!",
  UPDATED_SUCCESSFULLY = "Team aggiornato con successo!",
  DELETED_SUCCESSFULLY = "Team eliminato con successo!",
}

export async function createTeam(values: TeamSchema) {
  const { isValid, data, error } = validateSchema<TeamSchema>(
    teamSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canManageTeam();
  if (permissions.error) return permissions;

  await insertTeam(data);

  return createSuccess(TEAM_MESSAGES.ADDED_SUCCESSFULLY, null);
}

export async function updateTeam(id: number, values: TeamSchema) {
  const { isValid, data, error } = validateSchema<UpdateTeamSchema>(
    updateTeamSchema,
    { id, ...values }
  );
  if (!isValid) return error;

  const permissions = await canManageTeam();
  if (permissions.error) return permissions;

  const { id: teamId, ...team } = data;

  await updateTeamDB(teamId, team);

  return createSuccess(TEAM_MESSAGES.UPDATED_SUCCESSFULLY, null);
}

export async function deleteTeam(teamId: number) {
  const { isValid, error } = validateSchema<number>(
    getSerialIdSchema(),
    teamId
  );
  if (!isValid) return error;

  const permissions = await canManageTeam();
  if (permissions.error) return permissions;

  await deleteTeamDB(teamId);

  return createSuccess(TEAM_MESSAGES.DELETED_SUCCESSFULLY, null);
}
