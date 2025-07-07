"use server";

import { getUserId } from "@/features/users/utils/user";
import { createError } from "@/lib/helpers";
import {
  getUUIdSchema,
  validateSchema,
  VALIDATION_ERROR,
} from "@/schema/helpers";
import { canGenerateCalendar } from "../permissions/calendar";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";

// TODO:  regenerate calendar function

export async function generateCalendar(leagueId: string) {
  const { isValid, error, data } = validateSchema<string>(
    getUUIdSchema(),
    leagueId
  );
  if (!isValid) return error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const permissions = await canGenerateCalendar(userId, data);
  if (permissions.error) return permissions;

  const [] = await Promise.all([getLeagueTeams(leagueId)])

}
