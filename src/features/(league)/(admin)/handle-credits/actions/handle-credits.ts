"use server";

import { validateSchema } from "@/schema/helpers";
import {
  resetCreditsSchema,
  ResetCreditsSchema,
  setCreditsSchema,
  SetCreditsSchema,
} from "../schema/handle-credits";
import { canUpdateCredits } from "../permissions/handle-credits";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { updateLeagueTeam } from "@/features/(league)/teams/db/leagueTeam";
import { createSuccess } from "@/lib/helpers";

enum HANDLE_CREDITS_MESSAGES {
  RESET_SUCCESS = "Crediti resettati con successo",
  SET_CREDITS_SUCCESS = "Crediti settati con successo",
}

export async function resetCredits(values: ResetCreditsSchema) {
  const { isValid, error, data } = validateSchema<ResetCreditsSchema>(
    resetCreditsSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateCredits(data.leagueId);
  if (permissions.error) return permissions.error;

  const leagueTeams = await getLeagueTeams(data.leagueId);
  const leagueTeamsIds = leagueTeams.map((team) => team.id);

  await updateLeagueTeam(leagueTeamsIds, data.leagueId, {
    credits: data.credits,
  });

  return createSuccess(HANDLE_CREDITS_MESSAGES.RESET_SUCCESS, null);
}

export async function setTeamsCredits(values: SetCreditsSchema) {
  const { isValid, error, data } = validateSchema<SetCreditsSchema>(
    setCreditsSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateCredits(data.leagueId);
  if (permissions.error) return permissions.error;

  const updateCreditsPromise = data.updatedTeamsCredits.map(
    ({ teamId, credits }) =>
      updateLeagueTeam([teamId], data.leagueId, { credits })
  );

  await Promise.all(updateCreditsPromise);

  return createSuccess(HANDLE_CREDITS_MESSAGES.SET_CREDITS_SUCCESS, null);
}
