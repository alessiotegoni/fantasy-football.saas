import { db } from "@/drizzle/db";
import { leagueMatchdayCalculations } from "@/drizzle/schema/leagueMatchdayCalculations";
import { createError } from "@/lib/helpers";
import { and, eq } from "drizzle-orm";
import { revalidateLeagueCalculationsCache } from "./cache/calculate-matchday";

enum DB_ERROR_MESSAGES {
  CREATE_CALCULATION = "Errore nel calcolo della giornata",
  UPDATE_CALCULATION = "Errore nell'aggiornamento del calcolo",
}

export async function insertCalculation(
  calculation: typeof leagueMatchdayCalculations.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueMatchdayCalculations)
    .values(calculation)
    .returning({ leagueId: leagueMatchdayCalculations.leagueId });

  if (!res?.leagueId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATE_CALCULATION).message);
  }

  revalidateLeagueCalculationsCache(res.leagueId);
}

export async function updateCalculation(
  { leagueId, matchdayId }: { leagueId: string; matchdayId: number },
  calculation: Partial<typeof leagueMatchdayCalculations.$inferInsert>,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .update(leagueMatchdayCalculations)
    .set(calculation)
    .where(
      and(
        eq(leagueMatchdayCalculations.leagueId, leagueId),
        eq(leagueMatchdayCalculations.matchdayId, matchdayId)
      )
    )
    .returning({ id: leagueMatchdayCalculations.id });

  if (!res?.id) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_CALCULATION).message);
  }

  revalidateLeagueCalculationsCache(leagueId);
}
