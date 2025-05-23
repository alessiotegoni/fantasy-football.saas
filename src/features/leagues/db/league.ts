import { db } from "@/drizzle/db";
import {
  LeagueMemberRoleType,
  leagueMembers,
  leagueOptions,
  leagues,
} from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { eq } from "drizzle-orm";
import {
  revalidateLeagueInfoCache,
  revalidateLeagueMembersCache,
} from "./cache/league";

const leagueInfo = { leagueId: leagues.id, visibility: leagues.visibility };

export const getError = (message = "Errore nella creazione della lega") =>
  getErrorObject(message);

export async function insertLeague(
  league: typeof leagues.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx.insert(leagues).values(league).returning(leagueInfo);

  if (!res.leagueId) throw new Error(getError().message);

  revalidateLeagueInfoCache({
    leagueId: res.leagueId,
    visibility: res.visibility,
  });

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

export async function insertLeagueMember(
  userId: string,
  leagueId: string,
  role: LeagueMemberRoleType = "member"
) {
  const [res] = await db
    .insert(leagueMembers)
    .values({ userId, leagueId, role })
    .returning({ memberId: leagueMembers.id });

  if (!res.memberId)
    throw new Error(
      getError("Errore nella creazione del membro delal lega").message
    );

  revalidateLeagueMembersCache({ leagueId, userId });

  return res.memberId;
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

  revalidateLeagueInfoCache({ leagueId, visibility: res.visibility });
}
