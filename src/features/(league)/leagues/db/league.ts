import { db } from "@/drizzle/db";
import { leagues } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { leagueUserBans } from "@/drizzle/schema";
import { revalidateLeagueProfileCache } from "./cache/league";
import { revalidateLeagueMembersCache } from "../../members/db/cache/leagueMember";
import { createError } from "@/lib/helpers";

const leagueInfo = { leagueId: leagues.id, visibility: leagues.visibility };

export async function insertLeague(
  league: typeof leagues.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx.insert(leagues).values(league).returning(leagueInfo);

  if (!res.leagueId) throw new Error(createError().message);

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
    throw new Error(createError("Erorre nell'aggiornamento della lega").message);
  }

  revalidateLeagueProfileCache({ leagueId, visibility: res.visibility });

  return res.leagueId;
}

export async function insertLeagueBan(
  { leagueId, userId, reason }: typeof leagueUserBans.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueUserBans)
    .values({ leagueId, userId, reason })
    .returning({
      banId: leagueUserBans.id,
    });

  if (!res.banId)
    throw new Error(createError("Errore nel ban dell'utente").message);

  revalidateLeagueMembersCache({ leagueId, userId });

  return res.banId;
}

export async function deleteLeagueBan(
  banId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueUserBans)
    .where(eq(leagueUserBans.id, banId))
    .returning({
      leagueId: leagueUserBans.leagueId,
      userId: leagueUserBans.userId,
    });

  if (!res.userId)
    throw new Error(createError("Errore nello sban dell'utente").message);

  revalidateLeagueMembersCache(res);

  return res.userId;
}
