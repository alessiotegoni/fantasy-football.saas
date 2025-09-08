import { getUserId } from "@/features/dashboard/user/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { isLeagueAdmin } from "@/features/(league)/members/permissions/leagueMember";

enum ERROR_MESSAGES {
  NOT_ADMIN = "Per aggiornare i crediti delle squadre devi essere un admin della lega",
}

export async function canUpdateCredits(leagueId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (!(await isLeagueAdmin(userId, leagueId))) {
    return createError(ERROR_MESSAGES.NOT_ADMIN);
  }

  return createSuccess("", null);
}
