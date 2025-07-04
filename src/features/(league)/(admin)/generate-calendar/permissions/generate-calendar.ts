import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { getUpcomingSplit } from "@/features/splits/queries/split";
import { createError, createSuccess } from "@/lib/helpers";

enum GENERATE_CALENDAR_MESSAGES {
  SPLIT_NOT_UNCOMING = "Puoi generare il calendario solo quando lo split non e' ancora iniziato",
  INVALID_TEAMS_LENGTH = "Per generare il calendario la lega deve avere almeno 4 squadre",
}

export async function canGenerateCalendar(leagueId: string) {
  const [upcomingSplit, leagueTeams] = await Promise.all([
    getUpcomingSplit(),
    getLeagueTeams(leagueId),
  ]);

  if (!upcomingSplit) {
    return createError(GENERATE_CALENDAR_MESSAGES.SPLIT_NOT_UNCOMING);
  }

  if (leagueTeams.length < 4) {
    return createError(GENERATE_CALENDAR_MESSAGES.INVALID_TEAMS_LENGTH);
  }

  return createSuccess("", null);
}
