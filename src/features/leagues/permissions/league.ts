import { db } from "@/drizzle/db";
import { leagueMembers, leagueOptions, leagues } from "@/drizzle/schema";
import {
  isUserBanned,
  userHasPremium,
} from "@/features/users/permissions/user";
import { count, and, eq } from "drizzle-orm";

export async function canCreateLeague(userId: string) {
  const [hasPremium, hasLeague] = await Promise.all([
    userHasPremium(userId),
    ownsLeague(userId),
  ]);

  return hasPremium ? true : !hasLeague;
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

async function ownsLeague(userId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagues)
    .where(eq(leagues.ownerId, userId));

  return res[0].count >= 1;
}
