import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { getGeneralSettings } from "@/features/(league)/settings/queries/setting";
import { AddCreditsSchema } from "../schema/handle-credits";

enum ERROR_MESSAGES {
  NOT_ADMIN = "Per aggiornare i crediti delle squadre devi essere un admin della lega",
  CREDITS_OVERFLOW = "L'aggiunta di crediti farebbe superare i crediti iniziali.",
}

export async function canUpdateCredits(leagueId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (!(await getLeagueAdmin(userId, leagueId))) {
    return createError(ERROR_MESSAGES.NOT_ADMIN);
  }

  return createSuccess("", null);
}

export async function canAddCredits(data: AddCreditsSchema) {
  const permissions = await canUpdateCredits(data.leagueId);
  if (permissions.error) return permissions;

  const [leagueTeams, { initialCredits }] = await Promise.all([
    getLeagueTeams(data.leagueId),
    getGeneralSettings(data.leagueId),
  ]);

  if (checkCreditsOverflow(leagueTeams, data.creditsToAdd, initialCredits)) {
    return createError(ERROR_MESSAGES.CREDITS_OVERFLOW);
  }

  return createSuccess("", { teamsIds: leagueTeams.map((team) => team.id) });
}

export function checkCreditsOverflow(
  leagueTeams: { credits: number }[],
  creditsToAdd: number,
  initialCredits: number
) {
  return leagueTeams.some(
    (team) => team.credits + creditsToAdd > initialCredits
  );
}
