import { db } from "@/drizzle/db";
import { LeagueMemberRoleType, leagueMembers } from "@/drizzle/schema";
import { revalidateLeagueMembersCache } from "./cache/leagueMember";
import { eq } from "drizzle-orm";
import { createError } from "@/utils/helpers";

enum DB_ERROR_MESSAGES {
  INSERT = "Errore nell'inserimento del membro nella lega",
  UPDATE = "Errore nell'aggiornamento del membro nella lega",
  DELETE = "Errore nell'eliminazione del membro nella lega",
}

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
    throw new Error(createError(DB_ERROR_MESSAGES.INSERT).message);

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
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE).message);

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
    throw new Error(createError(DB_ERROR_MESSAGES.DELETE).message);

  revalidateLeagueMembersCache(res);

  return res.userId;
}
