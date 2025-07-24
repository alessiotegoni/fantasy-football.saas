import { db } from "@/drizzle/db";
import {
  leagueMatchLineupPlayers,
  leagueMatchTeamLineup,
} from "@/drizzle/schema";
import { createError } from "@/lib/helpers";
import { revalidateMatchLinuepsCache } from "./cache/match";

enum DB_ERROR_MESSAGE {
  INSERT_LINEUP = "Errore nella creazione della formazione",
  INSERT_LINEUP_PLAYERS = "Errore nel salvataggio dei giocatori della formazione",
}

export async function insertLineup(
  lineup: typeof leagueMatchTeamLineup.$inferInsert
) {
  const [res] = await db
    .insert(leagueMatchTeamLineup)
    .values(lineup)
    .returning({ lineupId: leagueMatchTeamLineup.id });

  if (!res.lineupId) {
    throw new Error(createError(DB_ERROR_MESSAGE.INSERT_LINEUP).message);
  }

  revalidateMatchLinuepsCache(lineup.matchId);

  return res.lineupId;
}

export async function insertLineupPlayers(
  matchId: string,
  lineupPlayers: (typeof leagueMatchLineupPlayers.$inferInsert)[]
) {
  const [res] = await db
    .insert(leagueMatchLineupPlayers)
    .values(lineupPlayers)
    .returning({ lineupId: leagueMatchLineupPlayers.id });

  if (!res.lineupId) {
    throw new Error(createError(DB_ERROR_MESSAGE.INSERT_LINEUP).message);
  }

  revalidateMatchLinuepsCache(matchId);

  return res.lineupId;
}
