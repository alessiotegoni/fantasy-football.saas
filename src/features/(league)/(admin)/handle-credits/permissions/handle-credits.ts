import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";

enum ERROR_MESSAGES {
  NOT_ADMIN = "Per aggiornare i crediti delle squadre devi essere un admin della lega",
}

export async function canUpdateCredits(leagueId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (!(await getLeagueAdmin(userId, leagueId))) {
    return createError(ERROR_MESSAGES.NOT_ADMIN);
  }

  return createSuccess("", null)
}

