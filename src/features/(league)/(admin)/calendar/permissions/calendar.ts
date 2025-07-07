import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { getUpcomingSplit } from "@/features/splits/queries/split";
import { createError, createSuccess } from "@/lib/helpers";

enum GENERATE_CALENDAR_MESSAGES {
  REQUIRE_ADMIN = "Per gestire il calendario devi essere un admin della lega",
  SPLIT_NOT_UNCOMING = "Puoi gestire il calendario solo quando lo split non e' ancora iniziato",
  INVALID_TEAMS_LENGTH = "Per generare il calendario la lega deve avere almeno 4 squadre",
}

export async function validateBaseRequirements(
  userId: string,
  leagueId: string
) {
  const isAdmin = await getLeagueAdmin(userId, leagueId);

  if (!isAdmin) return createError(GENERATE_CALENDAR_MESSAGES.REQUIRE_ADMIN);

  return createSuccess("", null);
}

export async function canGenerateCalendar(userId: string, leagueId: string) {
  const [baseValidation, upcomingSplit, leagueTeams] = await Promise.all([
    validateBaseRequirements(userId, leagueId),
    getUpcomingSplit(),
    getLeagueTeams(leagueId),
  ]);

  if (baseValidation.error) return baseValidation;

  if (!upcomingSplit) {
    return createError(GENERATE_CALENDAR_MESSAGES.SPLIT_NOT_UNCOMING);
  }

  if (leagueTeams.length < 4) {
    return createError(GENERATE_CALENDAR_MESSAGES.INVALID_TEAMS_LENGTH);
  }

  return createSuccess("", null);
}

export async function canDeleteCalendar(userId: string, leagueId: string) {
  const [baseValidation, upcomingSplit] = await Promise.all([
    validateBaseRequirements(userId, leagueId),
    getUpcomingSplit(),
  ]);

  if (baseValidation.error) return baseValidation;

  if (!upcomingSplit) {
    return createError(GENERATE_CALENDAR_MESSAGES.SPLIT_NOT_UNCOMING);
  }

  return createSuccess("", null);
}
