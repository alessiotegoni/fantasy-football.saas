import { db } from "@/drizzle/db";
import { LeagueMemberRoleType, leagueMembers } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeagueMembersCache } from "./cache/leagueMember";
import { and, eq } from "drizzle-orm";

export const getError = (
  message = "Impossibile entrare nella lega, riprovare"
) => getErrorObject(message);

export async function insertLeagueMember(
  memberId: string,
  leagueId: string,
  role: LeagueMemberRoleType = "member"
) {
  const [res] = await db
    .insert(leagueMembers)
    .values({ userId: memberId, leagueId, role })
    .returning({ memberId: leagueMembers.id });

  if (!res.memberId)
    throw new Error(
      getError("Errore nell'inserimento del membro nella lega").message
    );

  revalidateLeagueMembersCache({ leagueId, userId: memberId });

  return res.memberId;
}

export async function updateLeagueMember(
  memberId: string,
  member: Omit<typeof leagueMembers.$inferInsert, "leagueId" | "userId">
) {
  const [res] = await db
    .update(leagueMembers)
    .set(member)
    .where(eq(leagueMembers.id, memberId))
    .returning({
      userId: leagueMembers.userId,
      leagueId: leagueMembers.leagueId,
    });

  if (!res.userId)
    throw new Error(
      getError("Errore nell'aggiornamento del membro nella lega").message
    );

  revalidateLeagueMembersCache(res);

  return res.userId;
}

export async function deleteLeagueMember(
  memberId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueMembers)
    .where(eq(leagueMembers.id, memberId))
    .returning({
      userId: leagueMembers.userId,
      leagueId: leagueMembers.leagueId,
    });

  if (!res.userId)
    throw new Error(
      getError("Errore nell'eliminazione del membro nella lega").message
    );

  revalidateLeagueMembersCache(res);

  return res.userId;
}
