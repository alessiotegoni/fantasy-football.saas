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
import { deleteCalendar, insertCalendar } from "../db/calendar";
import { redirect } from "next/navigation";

export async function generateCalendar(leagueId: string) {
  const { error, message, data } = await calendarValidation(leagueId);
  if (error) return createError(message);

  const permissions = await canGenerateCalendar(data.userId, leagueId);
  if (permissions.error) return permissions;

  const [leagueTeams, splitMatchdays] = await Promise.all([
    getLeagueTeams(leagueId),
    getSplitMatchdays(permissions.data.upcomingSplitId),
  ]);

  const calendar = buildCalendar(leagueTeams, splitMatchdays, leagueId);

  await insertCalendar(calendar);

  redirect(`/leagues/${leagueId}/calendar`);
}

export async function regenerateCalendar(leagueId: string) {
  const { error, message } = await calendarValidation(leagueId);
  if (error) return createError(message);

  await deleteCalendar(leagueId);
  await generateCalendar(leagueId);

  redirect(`/leagues/${leagueId}/calendar`);
}

async function calendarValidation(values: string) {
  const validation = validateSchema<string>(getUUIdSchema(), values);
  if (!validation.isValid) return validation.error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  return createSuccess("", { leagueId: validation.data, userId });
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

type ScheduledMatch = {
  splitMatchdayId: number;
  leagueId: string;
  isBye: boolean;
} & Match;

function buildCalendar(teams: Team[], matchdays: Matchday[], leagueId: string) {
  const homeRounds = getHomeRounds(teams);

  const allRounds = [...homeRounds, ...getAwayRounds(homeRounds)];

  const repeatedRounds: Match[][] = [];

  while (repeatedRounds.length < matchdays.length) {
    repeatedRounds.push(...allRounds);
  }

  const scheduledMatches: ScheduledMatch[] = [];

  for (let i = 0; i < matchdays.length; i++) {
    const day = matchdays[i];
    const matches = repeatedRounds[i] || [];

    matches.forEach((match) => {
      scheduledMatches.push({
        splitMatchdayId: day.id,
        leagueId,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        isBye: !match.homeTeamId || !match.awayTeamId,
      });
    });
  }

  return scheduledMatches.slice(
    0,
    matchdays.length * Math.ceil(teams.length / 2)
  );
}

function getHomeRounds(teams: Team[]) {
  const teamList = shuffle(teams);
  const isOdd = teamList.length % 2 !== 0;

  if (isOdd) teamList.push({ id: null });

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

    rounds.push(roundMatches);
  }

  return rounds;
}

function getAwayRounds(rounds: Match[][]): Match[][] {
  return rounds.map((matches) =>
    matches.map(({ homeTeamId, awayTeamId }) => ({
      homeTeamId: awayTeamId,
      awayTeamId: homeTeamId,
    }))
  );
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
