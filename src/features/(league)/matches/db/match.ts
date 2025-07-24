import { db } from "@/drizzle/db";
import {
  leagueMatchLineupPlayers,
  leagueMatchTeamLineup,
} from "@/drizzle/schema";
import { createError } from "@/lib/helpers";
import { revalidateMatchLinuepsCache } from "./cache/match";
import { eq } from "drizzle-orm";

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
  lineupPlayers: (typeof leagueMatchLineupPlayers.$inferInsert)[],
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueMatchLineupPlayers)
    .values(lineupPlayers)
    .returning({ playerLineupId: leagueMatchLineupPlayers.id });

  if (!res.playerLineupId) {
    throw new Error(
      createError(DB_ERROR_MESSAGE.INSERT_LINEUP_PLAYERS).message
    );
  }

  revalidateMatchLinuepsCache(matchId);
}

export async function deleteLineupPlayers(
  lineupId: string,
  matchId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueMatchLineupPlayers)
    .where(eq(leagueMatchLineupPlayers.lineupId, lineupId))
    .returning({ playerLineupId: leagueMatchLineupPlayers.id });

  if (!res.playerLineupId) {
    throw new Error(
      createError(DB_ERROR_MESSAGE.INSERT_LINEUP_PLAYERS).message
    );
  }

  revalidateMatchLinuepsCache(matchId);
}
