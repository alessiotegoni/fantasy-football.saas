import { db } from "@/drizzle/db";
import { leagueMatchResults } from "@/drizzle/schema";
import { createError } from "@/lib/helpers";
import { inArray } from "drizzle-orm";
import { revalidateMatchResultsCache } from "./cache/match";

enum DB_ERROR_MESSAGES {
  ADD_MATCHES_RESULTS = "Errore nell'aggiunta dei risultati dei match",
  DELETE_MATCHES_RESULTS = "Errore nella cancellazione dei risultati dei match",
}

export async function insertMatchesResults(
  leagueId: string,
  results: (typeof leagueMatchResults.$inferInsert)[],
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueMatchResults)
    .values(results)
    .returning({ matchId: leagueMatchResults.leagueMatchId });

  if (!res?.matchId) {
    throw new Error(createError(DB_ERROR_MESSAGES.ADD_MATCHES_RESULTS).message);
  }

  const matchesIds = results.map((result) => result.leagueMatchId);
  revalidateMatchResultsCache(leagueId, matchesIds);
}
