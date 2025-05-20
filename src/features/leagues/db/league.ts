import { db } from "@/drizzle/db";
import { leagueOptions, leagues } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const getError = (message = "Errore nella creazione della lega") =>
  getErrorObject(message);

export async function insertLeague(
  league: typeof leagues.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagues)
    .values(league)
    .returning({ leagueId: leagues.id });

  if (!res.leagueId) throw new Error(getError().message);

  return res.leagueId;
}

export async function insertLeagueOptions(
  { leagueId }: typeof leagueOptions.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueOptions)
    .values({ leagueId })
    .returning({ leagueId: leagueOptions.leagueId });

  if (!res.leagueId) throw new Error(getError().message);
}

export async function updateLeague(
  leagueId: string,
  league: Partial<typeof leagues.$inferInsert>
) {
  const [res] = await db
    .update(leagues)
    .set(league)
    .where(eq(leagues.id, leagueId))
    .returning({ leagueId: leagues.id });

  if (!res.leagueId) {
    throw new Error(getError("Erorre nell'aggiornamento della lega").message);
  }
}
