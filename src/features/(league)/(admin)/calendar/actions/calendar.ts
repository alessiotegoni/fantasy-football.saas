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
import { insertCalendar } from "../db/calendar";

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

  const calendar = buildCalendar(leagueTeams, splitMatchdays, leagueId);

  await insertCalendar(calendar)

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

function buildCalendar(teams: Team[], matchdays: Matchday[], leagueId: string) {
  const homeRounds = generateRoundRobin(teams);
  const allRounds = [...homeRounds, ...getAwayRounds(homeRounds)];

  const repeatedRounds: Match[][] = [];
  const totalDays = matchdays.length;

  while (
    repeatedRounds.flat().length <
    totalDays * Math.ceil(teams.length / 2)
  ) {
    repeatedRounds.push(...allRounds);
  }

  const scheduledMatches: (Match & {
    splitMatchdayId: number;
    leagueId: string;
  })[] = [];

  for (let i = 0; i < matchdays.length; i++) {
    const day = matchdays[i];
    const matches = repeatedRounds[i] || [];

    matches.forEach((match) => {
      scheduledMatches.push({
        splitMatchdayId: day.id,
        leagueId,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
      });
    });
  }

  return scheduledMatches.slice(0, totalDays * Math.ceil(teams.length / 2));
}

function getAwayRounds(rounds: Match[][]): Match[][] {
  return rounds.map((matches) =>
    matches.map((match) => ({
      ...match,
      homeTeamId: match.awayTeamId,
      awayTeamId: match.homeTeamId,
    }))
  );
}
