import { db } from "@/drizzle/db";
import { leagueMembers, leagueOptions, leagues, userSubscriptions } from "@/drizzle/schema";
import { isLeagueMember, isMemberOfALeague } from "@/features/leagueMembers/permissions/leagueMember";
import { isUserBanned, isValidSubscription, userHasPremium } from "@/features/users/permissions/user";
import { and, count, eq } from "drizzle-orm";

export async function canCreateLeague(userId: string) {
  const [hasPremium, isLeagueMember] = await Promise.all([
    userHasPremium(userId),
    isMemberOfALeague(userId),
  ]);

  return hasPremium ? true : !isLeagueMember;
}

export async function canJoinLeague(userId: string, leagueId: string) {
  const [canCreate, isFull, isAlreadyMember, isBanned] = await Promise.all([
    canCreateLeague(userId),
    isLeagueFull(leagueId),
    isLeagueMember(userId, leagueId),
    isUserBanned(userId, leagueId),
  ]);

  if (!canCreate) {
    return {
      canJoin: false,
      message: "Per entrare in più di una lega devi avere il premium.",
    };
  }

  if (isFull) {
    return {
      canJoin: false,
      message: "La lega è piena.",
    };
  }

  if (isAlreadyMember) {
    return {
      canJoin: false,
      message: "Sei già un membro di questa lega.",
    };
  }

  if (isBanned) {
    return {
      canJoin: false,
      message: "Sei stato bannato da questa lega.",
    };
  }

  return {
    canJoin: true,
  };
}

export async function isPremiumUnlocked(leagueId: string) {
  const [res] = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .innerJoin(
      leagueMembers,
      eq(leagueMembers.userId, userSubscriptions.userId)
    )
    .innerJoin(leagues, eq(leagues.id, leagueMembers.leagueId))
    .where(and(eq(leagues.id, leagueId), isValidSubscription));

  return res.count > 0;
}

async function isLeagueFull(leagueId: string) {
  const [res] = await db
    .select({
      leagueMembersCount: count(leagueMembers),
      maxMembers: leagueOptions.maxMembers,
    })
    .from(leagues)
    .innerJoin(leagueOptions, eq(leagueOptions.leagueId, leagues.id))
    .innerJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .where(eq(leagues.id, leagueId))
    .groupBy(leagueOptions.maxMembers);

  return res.leagueMembersCount === res.maxMembers;
}
