import { db } from "@/drizzle/db";
import {
  leagueMembers,
  leagueSettings,
  leagueUserBans,
  leagues,
  userSubscriptions,
} from "@/drizzle/schema";
import {
  isValidSubscription,
  userHasPremium,
} from "@/features/dashboard/user/permissions/user";
import { and, count, eq, ilike } from "drizzle-orm";
import {
  isLeagueMember,
  isMemberOfALeague,
} from "../../members/permissions/leagueMember";
import { createError, createSuccess } from "@/utils/helpers";
import { getLiveSplit } from "@/features/dashboard/admin/splits/queries/split";

enum JOIN_LEAGUE_MESSAGES {
  PREMIUM_REQUIRED = "Per entrare in più di una lega devi avere il premium.",
  NAME_EXISTS = "Il nome della lega esiste già, utilizzane un altro",
  LEAGUE_FULL = "La lega è piena.",
  ALREADY_MEMBER = "Sei già un membro di questa lega.",
  USER_BANNED = "Sei stato bannato da questa lega, contatta gli admin per sapere la motivazione.",
  SPLIT_ALREADY_LIVE = "Lo split è gia iniziato e la lega è chiusa",
}

async function validateBaseRequirements(userId: string) {
  const [hasPremium, isLeagueMember] = await Promise.all([
    userHasPremium(userId),
    isMemberOfALeague(userId),
  ]);

  if (!hasPremium && isLeagueMember) {
    return createError(JOIN_LEAGUE_MESSAGES.PREMIUM_REQUIRED);
  }

  return createSuccess("", null);
}

export async function canCreateLeague(userId: string, leagueName: string) {
  const baseValidation = await validateBaseRequirements(userId);
  if (baseValidation.error) return baseValidation;

  if (!(await isUniqueName(leagueName))) {
    return createError(JOIN_LEAGUE_MESSAGES.NAME_EXISTS);
  }

  return createSuccess("", null);
}

export async function canJoinLeague(userId: string, leagueId: string) {
  const [baseValidation, isFull, isAlreadyMember, isBanned, liveSplit] =
    await Promise.all([
      validateBaseRequirements(userId),
      isLeagueFull(leagueId),
      isLeagueMember(userId, leagueId),
      isUserBanned(userId, leagueId),
      getLiveSplit(),
    ]);

  if (baseValidation.error) return baseValidation;

  if (isFull) {
    return createError(JOIN_LEAGUE_MESSAGES.LEAGUE_FULL);
  }

  if (isAlreadyMember) {
    return createError(JOIN_LEAGUE_MESSAGES.ALREADY_MEMBER);
  }

  if (isBanned) {
    return createError(JOIN_LEAGUE_MESSAGES.USER_BANNED);
  }

  if (liveSplit) {
    return createError(JOIN_LEAGUE_MESSAGES.SPLIT_ALREADY_LIVE);
  }

  return createSuccess("", null);
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

async function isUserBanned(userId: string, leagueId: string) {
  const [res] = await db
    .select({ count: count() })
    .from(leagueUserBans)
    .where(
      and(
        eq(leagueUserBans.userId, userId),
        eq(leagueUserBans.leagueId, leagueId)
      )
    );

  return res.count > 0;
}

async function isUniqueName(leagueName: string) {
  const [result] = await db
    .select({ count: count() })
    .from(leagues)
    .where(ilike(leagues.name, leagueName));

  return result.count === 0;
}

async function isLeagueFull(leagueId: string) {
  const [result] = await db
    .select({
      leagueMembersCount: count(leagueMembers),
      maxMembers: leagueSettings.maxMembers,
    })
    .from(leagues)
    .innerJoin(leagueSettings, eq(leagueSettings.leagueId, leagues.id))
    .innerJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .where(eq(leagues.id, leagueId))
    .groupBy(leagueSettings.maxMembers);

  return result.leagueMembersCount === result.maxMembers;
}
