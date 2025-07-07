import { db } from "@/drizzle/db";
import { leagueMatches } from "@/drizzle/schema";
import { createError } from "@/lib/helpers";

enum DB_ERRORS {
  INSERT_ERROR = "Errore nella creazione del calendario",
}

export async function insertCalendar(
  data: (typeof leagueMatches.$inferInsert)[]
) {
  const [res] = await db
    .insert(leagueMatches)
    .values(data)
    .returning({ calendarId: leagueMatches.id });

  if (!res.calendarId) {
    throw new Error(createError(DB_ERRORS.INSERT_ERROR).message);
  }

  revalidateCalend
}
