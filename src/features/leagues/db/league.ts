import { db } from "@/drizzle/db";
import { leagues } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidateLeagueProfileCache } from "./cache/league";

const leagueInfo = { leagueId: leagues.id, visibility: leagues.visibility };

export const getError = (message = "Errore nella creazione della lega") =>
  getErrorObject(message);

export async function insertLeague(
  league: typeof leagues.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx.insert(leagues).values(league).returning(leagueInfo);

  if (!res.leagueId) throw new Error(getError().message);

  revalidateLeagueProfileCache({
    leagueId: res.leagueId,
    visibility: res.visibility,
  });

  return res.leagueId;
}

export async function updateLeague(
  leagueId: string,
  league: Partial<typeof leagues.$inferInsert>
) {
  const [res] = await db
    .update(leagues)
    .set(league)
    .where(eq(leagues.id, leagueId))
    .returning(leagueInfo);

  if (!res.leagueId) {
    throw new Error(getError("Erorre nell'aggiornamento della lega").message);
  }

  revalidateLeagueProfileCache({ leagueId, visibility: res.visibility });

  return res.leagueId;
}
