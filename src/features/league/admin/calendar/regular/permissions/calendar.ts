import { db } from "@/drizzle/db";
import { leagueMatches, splitMatchdays, splits } from "@/drizzle/schema";
import { isLeagueAdmin } from "@/features/league/members/permissions/leagueMember";
import { getLeagueTeams } from "@/features/league/teams/queries/leagueTeam";
import { getUpcomingSplit } from "@/features/dashboard/admin/splits/queries/split";
import { createError, createSuccess } from "@/utils/helpers";
import { and, count, eq } from "drizzle-orm";
import {
  getUUIdSchema,
  validateSchema,
  VALIDATION_ERROR,
} from "@/schema/helpers";
import { getUserId } from "@/features/dashboard/user/utils/user";

enum GENERATE_CALENDAR_MESSAGES {
  ALREADY_GENERATED = "Calendario gia generato",
  REQUIRE_ADMIN = "Per gestire il calendario devi essere un admin della lega",
  SPLIT_NOT_UNCOMING = "Puoi gestire il calendario solo quando lo split non e' ancora iniziato",
  INVALID_TEAMS_LENGTH = "Per generare il calendario la lega deve avere almeno 4 squadre",
}

export async function calendarValidation(leagueId: string) {
  const validation = validateSchema<string>(getUUIdSchema(), leagueId);
  if (!validation.isValid) return validation.error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const permissions = await canGenerateCalendar(userId, leagueId);
  if (permissions.error) return permissions;

  return createSuccess("", {
    leagueId: validation.data,
    userId,
    ...permissions.data,
  });
}

export async function canGenerateCalendar(userId: string, leagueId: string) {
  const [isAdmin, upcomingSplit, leagueTeams] = await Promise.all([
    isLeagueAdmin(userId, leagueId),
    getUpcomingSplit(),
    getLeagueTeams(leagueId),
  ]);

  if (!isAdmin) {
    return createError(GENERATE_CALENDAR_MESSAGES.REQUIRE_ADMIN);
  }

  if (!upcomingSplit) {
    return createError(GENERATE_CALENDAR_MESSAGES.SPLIT_NOT_UNCOMING);
  }

  if (leagueTeams.length < 4) {
    return createError(GENERATE_CALENDAR_MESSAGES.INVALID_TEAMS_LENGTH);
  }

  if (await hasGeneratedCalendar(leagueId, upcomingSplit.id)) {
    return createError(GENERATE_CALENDAR_MESSAGES.ALREADY_GENERATED);
  }

  return createSuccess("", { upcomingSplitId: upcomingSplit.id });
}

export async function hasGeneratedCalendar(leagueId: string, splitId: number) {
  const [result] = await db
    .select({ count: count() })
    .from(leagueMatches)
    .innerJoin(
      splitMatchdays,
      eq(splitMatchdays.id, leagueMatches.splitMatchdayId)
    )
    .innerJoin(splits, eq(splits.id, splitMatchdays.splitId))
    .where(and(eq(splits.id, splitId), eq(leagueMatches.leagueId, leagueId)));

  return result.count > 0;
}
