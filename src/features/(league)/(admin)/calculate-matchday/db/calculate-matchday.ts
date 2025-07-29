import { db } from "@/drizzle/db";
import {
  leagueMatchdayCalculations,
  type LeagueMatchdayCalcStatuses,
} from "@/drizzle/schema/leagueMatchdayCalculations";
import { createError } from "@/lib/helpers";
import { and, eq } from "drizzle-orm";
import { revalidateLeagueCalculationsCache } from "./cache/calculate-matchday";

enum DB_ERROR_MESSAGE {
  CREATE_CALCULATION = "Errore nel calcolo della giornata",
  UPDATE_CALCULATION = "Errore nell'aggiornamento del calcolo",
}

export async function createMatchdayCalculation(
  calculation: typeof leagueMatchdayCalculations.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueMatchdayCalculations)
    .values(calculation)
    .returning({ leagueId: leagueMatchdayCalculations.leagueId });

  if (!res?.leagueId) {
    throw new Error(createError(DB_ERROR_MESSAGE.CREATE_CALCULATION).message);
  }

  revalidateLeagueCalculationsCache(res.leagueId);
}

export async function updateMatchdayCalculation(
  leagueId: string,
  matchdayId: number,
  status: LeagueMatchdayCalcStatuses,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .update(leagueMatchdayCalculations)
    .set({ status })
    .where(
      and(
        eq(leagueMatchdayCalculations.leagueId, leagueId),
        eq(leagueMatchdayCalculations.matchdayId, matchdayId)
      )
    )
    .returning({ id: leagueMatchdayCalculations.id });

  if (!res?.id) {
    throw new Error(createError(DB_ERROR_MESSAGE.UPDATE_CALCULATION).message);
  }

  revalidateLeagueCalculationsCache(leagueId);
}
