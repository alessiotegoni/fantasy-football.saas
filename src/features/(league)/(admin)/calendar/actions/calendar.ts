"use server";

import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import {
  getUUIdSchema,
  validateSchema,
  VALIDATION_ERROR,
} from "@/schema/helpers";
import { canGenerateCalendar } from "../permissions/calendar";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { getSplitMatchdays } from "@/features/splits/queries/split";

// TODO:  regenerate calendar function

enum CALENDAR_MESSAGES {
  GENERATE_SUCCESS = "Calendario generato con successo!",
}

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

  const [leagueTeams, splitMatchdays] = await Promise.all([
    getLeagueTeams(leagueId),
    getSplitMatchdays(permissions.data.upcomingSplitId),
  ]);

  const schedule = buildCalendar(leagueTeams, splitMatchdays, leagueId);

  console.log(schedule);

  return createSuccess(CALENDAR_MESSAGES.GENERATE_SUCCESS, null);
}

type Team = {
  id: string | null;
};

type Matchday = {
  id: number;
};

type Match = {
  homeTeamId: string | null;
  awayTeamId: string | null;
};

function generateRoundRobin(teams: Team[]) {
  const teamList = [...teams];
  const isOdd = teamList.length % 2 !== 0;

  if (isOdd) {
    teamList.push({ id: null });
  }

  const rounds: Match[][] = [];
  const n = teamList.length;

  for (let round = 0; round < n - 1; round++) {
    const roundMatches: Match[] = [];

    for (let i = 0; i < n / 2; i++) {
      const home = teamList[i];
      const away = teamList[n - 1 - i];

      if (!(home.id === null && away.id === null)) {
        roundMatches.push({
          homeTeamId: home.id,
          awayTeamId: away.id,
        });
      }
    }

    const last = teamList.pop();
    if (last) teamList.splice(1, 0, last);
  }

  return rounds;
}

