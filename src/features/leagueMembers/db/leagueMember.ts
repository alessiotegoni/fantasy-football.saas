import { db } from "@/drizzle/db";
import { LeagueMemberRoleType, leagueMembers } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeagueMembersCache } from "./cache/leagueMember";
import { and, eq } from "drizzle-orm";

export const getError = (
  message = "Impossibile entrare nella lega, riprovare"
) => getErrorObject(message);

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
      getError("Errore nell'inserimento del membro nella lega").message
    );

  revalidateLeagueMembersCache({ leagueId, userId });

  return res.memberId;
}

export async function deleteLeagueMember(memberId: string, leagueId: string) {
  const [res] = await db
    .delete(leagueMembers)
    .where(
      and(eq(leagueMembers.id, memberId), eq(leagueMembers.leagueId, leagueId))
    )
    .returning({ userId: leagueMembers.userId });

  if (!res.userId)
    throw new Error(
      getError("Errore nell'eliminazione del membro nella lega").message
    );

  revalidateLeagueMembersCache({ leagueId, userId: res.userId });

  return res.userId;
}
