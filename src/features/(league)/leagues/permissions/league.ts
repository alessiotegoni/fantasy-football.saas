import { db } from "@/drizzle/db";
import {
  leagueMembers,
  leagueOptions,
  leagues,
  userSubscriptions,
} from "@/drizzle/schema";
import {
  isUserBanned,
  isValidSubscription,
  userHasPremium,
} from "@/features/users/permissions/user";
import { and, count, eq } from "drizzle-orm";
import {
  isLeagueMember,
  isMemberOfALeague,
} from "../../members/permissions/leagueMember";

const JOIN_LEAGUE_MESSAGES = {
  PREMIUM_REQUIRED: "Per entrare in più di una lega devi avere il premium.",
  LEAGUE_FULL: "La lega è piena.",
  ALREADY_MEMBER: "Sei già un membro di questa lega.",
  USER_BANNED:
    "Sei stato bannato da questa lega, contatta il creatore per sapere la motivazione.",
} as const;

export async function canCreateLeague(userId: string) {
  const [hasPremium, isLeagueMember] = await Promise.all([
    userHasPremium(userId),
    isMemberOfALeague(userId),
  ]);

  return hasPremium || !isLeagueMember;
}

export async function canJoinLeague(userId: string, leagueId: string) {
  const [canCreate, isFull, isAlreadyMember, isBanned] = await Promise.all([
    canCreateLeague(userId),
    isLeagueFull(leagueId),
    isLeagueMember(userId, leagueId),
    isUserBanned(userId, leagueId),
  ]);

  if (!canCreate) {
    return createJoinError(JOIN_LEAGUE_MESSAGES.PREMIUM_REQUIRED);
  }

  if (isFull) {
    return createJoinError(JOIN_LEAGUE_MESSAGES.LEAGUE_FULL);
  }

  if (isAlreadyMember) {
    return createJoinError(JOIN_LEAGUE_MESSAGES.ALREADY_MEMBER);
  }

  if (isBanned) {
    return createJoinError(JOIN_LEAGUE_MESSAGES.USER_BANNED);
  }

  return { canJoin: true, message: "" };
}

export async function isPremiumUnlocked(leagueId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .innerJoin(
      leagueMembers,
      eq(leagueMembers.userId, userSubscriptions.userId)
    )
    .innerJoin(leagues, eq(leagues.id, leagueMembers.leagueId))
    .where(and(eq(leagues.id, leagueId), isValidSubscription));

  return result.count > 0;
}

function createJoinError(message: string) {
  return { canJoin: false, message };
}

async function isLeagueFull(leagueId: string) {
  const [result] = await db
    .select({
      leagueMembersCount: count(leagueMembers),
      maxMembers: leagueOptions.maxMembers,
    })
    .from(leagues)
    .innerJoin(leagueOptions, eq(leagueOptions.leagueId, leagues.id))
    .innerJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .where(eq(leagues.id, leagueId))
    .groupBy(leagueOptions.maxMembers);

  return result.leagueMembersCount === result.maxMembers;
}
