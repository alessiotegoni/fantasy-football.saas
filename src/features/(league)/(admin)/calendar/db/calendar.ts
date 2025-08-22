import { db } from "@/drizzle/db";
import { leagueMatches } from "@/drizzle/schema";
import { createError } from "@/utils/helpers";
import { revalidateLeagueCalendarsCache } from "./cache/calendar";
import { and, eq, inArray } from "drizzle-orm";

enum DB_ERRORS {
  INSERT_ERROR = "Errore nella creazione del calendario",
  DELETE_ERROR = "Errore nell'eliminazione del calendario",
}

export async function insertCalendar(
  data: (typeof leagueMatches.$inferInsert)[],
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueMatches)
    .values(data)
    .returning({ calendarId: leagueMatches.id });

  if (!res.calendarId) {
    throw new Error(createError(DB_ERRORS.INSERT_ERROR).message);
  }

  revalidateLeagueCalendarsCache(data[0].leagueId);
}

export async function deleteCalendar(
  leagueId: string,
  matchdaysIds: number[],
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueMatches)
    .where(
      and(
        eq(leagueMatches.leagueId, leagueId),
        inArray(leagueMatches.splitMatchdayId, matchdaysIds)
      )
    )
    .returning({ calendarId: leagueMatches.id });

  if (!res.calendarId) {
    throw new Error(createError(DB_ERRORS.DELETE_ERROR).message);
  }

  revalidateLeagueCalendarsCache(leagueId);
}
