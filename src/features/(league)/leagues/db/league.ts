import { db } from "@/drizzle/db";
import { leagues, leagueUserBans } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createError } from "@/lib/helpers";
import { revalidateLeagueProfileCache } from "./cache/league";
import { revalidateLeagueMembersCache } from "../../members/db/cache/leagueMember";

enum DB_ERROR_MESSAGES {
  LEAGUE_CREATION_FAILED = "Errore nella creazione della lega",
  LEAGUE_UPDATE_FAILED = "Errore nell'aggiornamento della lega",
  BAN_CREATION_FAILED = "Errore nel ban dell'utente",
  BAN_DELETION_FAILED = "Errore nello sban dell'utente",
}

const leagueInfo = {
  leagueId: leagues.id,
  visibility: leagues.visibility,
};

export async function insertLeague(
  league: typeof leagues.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
): Promise<string> {
  const [result] = await tx
    .insert(leagues)
    .values(league)
    .returning(leagueInfo);

  if (!result?.leagueId) {
    throw new Error(
      createError(DB_ERROR_MESSAGES.LEAGUE_CREATION_FAILED).message
    );
  }

  revalidateLeagueProfileCache({
    leagueId: result.leagueId,
    visibility: result.visibility,
  });

  return result.leagueId;
}

export async function updateLeague(
  leagueId: string,
  league: Partial<typeof leagues.$inferInsert>
): Promise<string> {
  const [result] = await db
    .update(leagues)
    .set(league)
    .where(eq(leagues.id, leagueId))
    .returning(leagueInfo);

  if (!result?.leagueId) {
    throw new Error(
      createError(DB_ERROR_MESSAGES.LEAGUE_UPDATE_FAILED).message
    );
  }

  revalidateLeagueProfileCache({
    leagueId,
    visibility: result.visibility,
  });

  return result.leagueId;
}

export async function insertLeagueBan(
  { leagueId, userId, reason }: typeof leagueUserBans.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
): Promise<string> {
  const [result] = await tx
    .insert(leagueUserBans)
    .values({ leagueId, userId, reason })
    .returning({ banId: leagueUserBans.id });

  if (!result?.banId) {
    throw new Error(createError(DB_ERROR_MESSAGES.BAN_CREATION_FAILED).message);
  }

  revalidateLeagueMembersCache({
    leagueId,
    userId,
  });

  return result.banId;
}

export async function deleteLeagueBan(
  banId: string,
  tx: Omit<typeof db, "$client"> = db
): Promise<string> {
  const [result] = await tx
    .delete(leagueUserBans)
    .where(eq(leagueUserBans.id, banId))
    .returning({
      leagueId: leagueUserBans.leagueId,
      userId: leagueUserBans.userId,
    });

  if (!result?.userId) {
    throw new Error(createError(DB_ERROR_MESSAGES.BAN_DELETION_FAILED).message);
  }

  revalidateLeagueMembersCache(result);

  return result.userId;
}
