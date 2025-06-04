import { db } from "@/drizzle/db";
import { leagueMembers, leagues } from "@/drizzle/schema";
import { getUserId } from "@/features/users/utils/user";
import { count, and, eq } from "drizzle-orm";
import { MemberActionArgs } from "../actions/memberActions";

export async function isLeagueAdmin(userId: string, leagueId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(
      and(
        eq(leagueMembers.leagueId, leagueId),
        eq(leagueMembers.userId, userId),
        eq(leagueMembers.role, "admin")
      )
    );

  return res[0].count === 1;
}

export async function isLeagueOwner(userId: string, leagueId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagues)
    .where(and(eq(leagues.id, leagueId), eq(leagues.ownerId, userId)));

  return res[0].count === 1;
}

export async function isLeagueMember(userId: string, leagueId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(
      and(
        eq(leagueMembers.leagueId, leagueId),
        eq(leagueMembers.userId, userId)
      )
    );

  return res[0].count === 1;
}

export async function isMemberOfALeague(userId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(eq(leagueMembers.userId, userId));

  return res[0].count >= 1;
}

export async function canPerformMemberAction({
  leagueId,
  userId: userMemberId,
}: Omit<MemberActionArgs, "memberId">) {
  const userId = await getUserId();
  if (!userId) return false;

  const [isUserAdmin, isUserMemberOwner] = await Promise.all([
    isLeagueAdmin(userId, leagueId),
    isLeagueOwner(userMemberId, leagueId),
  ]);

  if (!isUserAdmin || isUserMemberOwner || userId === userMemberId) {
    return false;
  }

  return true;
}
