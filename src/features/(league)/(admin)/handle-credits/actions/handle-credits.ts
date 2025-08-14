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
import { getGeneralSettings } from "@/features/(league)/settings/queries/setting";

enum HANDLE_CREDITS_MESSAGES {
  RESET_SUCCESS = "Crediti resettati con successo",
  SET_SUCCESS = "Crediti settati con successo",
  ADD_SUCCESS = "Crediti aggiunti con successo",
}

export async function addTeamsCredits(values: AddCreditsSchema) {
  const { isValid, data, error } = validateSchema<AddCreditsSchema>(
    addCreditsSchema,
    values
  );
  if (!isValid) return error;

  const { leagueId, creditsToAdd } = data;

  const permissions = await canUpdateCredits(leagueId);
  if (permissions.error) return permissions;

  const [leagueTeams, { initialCredits }] = await Promise.all([
    getLeagueTeams(leagueId),
    getGeneralSettings(leagueId),
  ]);

  await addTeamsCreditsDB(
    leagueTeams.map((team) => team.id),
    leagueId,
    creditsToAdd,
    initialCredits
  );

  return createSuccess(HANDLE_CREDITS_MESSAGES.ADD_SUCCESS, null);
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

  return createSuccess(HANDLE_CREDITS_MESSAGES.SET_SUCCESS, null);
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
