"use server";

import { validateSchema } from "@/schema/helpers";
import {
  addCreditsSchema,
  AddCreditsSchema,
  resetCreditsSchema,
  ResetCreditsSchema,
  setCreditsSchema,
  SetCreditsSchema,
} from "../schema/handle-credits";
import { canUpdateCredits } from "../permissions/handle-credits";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { updateLeagueTeams } from "@/features/(league)/teams/db/leagueTeam";
import { createSuccess } from "@/lib/helpers";
import { addTeamsCredits as addTeamsCreditsDB } from "../db/handle-credits";

enum HANDLE_CREDITS_MESSAGES {
  RESET_SUCCESS = "Crediti resettati con successo",
  SET_CREDITS_SUCCESS = "Crediti settati con successo",
}

export async function addTeamsCredits(values: AddCreditsSchema) {
  const { isValid, data, error } = validateSchema<AddCreditsSchema>(
    addCreditsSchema,
    values
  );
  if (!isValid) return error;

  // TODO: permissions
  // TODO: da gestire il caso in cui la somma dei crediti da aggiungere e
  // quelli gia presenti nel team superasse gli initialCredits della lega

  // await addTeamsCreditsDB(data.teamsIds, data.leagueId, data.credits);

  return createSuccess("Crediti aggiunti con successo", null);
}

export async function setTeamsCredits(values: SetCreditsSchema) {
  const { isValid, error, data } = validateSchema<SetCreditsSchema>(
    setCreditsSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateCredits(data.leagueId);
  if (permissions.error) return permissions;

  const updateCreditsPromise = data.updatedTeamsCredits.map(
    ({ teamId, credits }) =>
      updateLeagueTeams([teamId], data.leagueId, { credits })
  );

  await Promise.all(updateCreditsPromise);

  return createSuccess(HANDLE_CREDITS_MESSAGES.SET_CREDITS_SUCCESS, null);
}

export async function resetCredits(values: ResetCreditsSchema) {
  const { isValid, error, data } = validateSchema<ResetCreditsSchema>(
    resetCreditsSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateCredits(data.leagueId);
  if (permissions.error) return permissions;

  const leagueTeams = await getLeagueTeams(data.leagueId);
  const leagueTeamsIds = leagueTeams.map((team) => team.id);

  await updateLeagueTeams(leagueTeamsIds, data.leagueId, {
    credits: data.credits,
  });

  return createSuccess(HANDLE_CREDITS_MESSAGES.RESET_SUCCESS, null);
}
