"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/drizzle/db";
import { count, ilike } from "drizzle-orm";
import { leagues } from "@/drizzle/schema";
import { uploadImage } from "@/services/supabase/storage/supabase";
import { createError, createSuccess } from "@/lib/helpers";
import { insertLeague, updateLeague } from "../db/league";
import { canCreateLeague } from "../permissions/league";
import { addUserLeaguesMetadata, getUser } from "@/features/users/utils/user";
import { insertLeagueOptions } from "@/features/(league)/options/db/leagueOptions";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";
import { insertLeagueMember } from "../../members/db/leagueMember";
import { createLeagueSchema, CreateLeagueSchema } from "../schema/createLeague";
import {
  leagueProfileSchema,
  LeagueProfileSchema,
} from "../schema/leagueProfile";
import { validateSchema } from "@/schema/helpers";

enum LEAGUE_MESSAGES {
  PREMIUM_REQUIRED = "Per essere membro di 2 o più leghe devi avere il premium",
  ADMIN_REQUIRED = "Per aggiornare il profilo della lega devi essere admin",
  NAME_EXISTS = "Il nome della lega esiste già, utilizzane un altro",
  PROFILE_UPDATED = "Profilo aggiornato con successo",
}

interface LeagueCreationContext {
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
  league: CreateLeagueSchema;
  leagueId: string;
}

export async function createLeague(values: CreateLeagueSchema) {
  const user = await validateUserForLeagueCreation();
  if (!user.isValid) return user.error;

  const league = validateLeagueSchema(values);
  if (!league.isValid) return league.error;

  const uniqueNameCheck = await validateUniqueName(league.data.name);
  if (!uniqueNameCheck.isValid) return uniqueNameCheck.error;

  const leagueId = await executeLeagueCreation({
    user: user.data,
    league: league.data,
  });

  await schedulePostCreationTasks({
    user: user.data,
    league: league.data,
    leagueId,
  });

  redirectToLeagueSetup(leagueId);
}

export async function updateLeagueProfile(
  values: LeagueProfileSchema,
  leagueId: string
) {
  const user = await validateUserForLeagueUpdate(leagueId);
  if (!user.isValid) return user.error;

  const profile = validateProfileSchema(values);
  if (!profile.isValid) return profile.error;

  await executeLeagueUpdate(leagueId, profile.data);

  return createSuccess(LEAGUE_MESSAGES.PROFILE_UPDATED);
}

async function validateUserForLeagueCreation() {
  const user = await getUser();

  if (!user) {
    return {
      isValid: false as const,
      error: createError(LEAGUE_MESSAGES.PREMIUM_REQUIRED),
    };
  }

  const canCreate = await canCreateLeague(user.id);
  if (!canCreate) {
    return {
      isValid: false as const,
      error: createError(LEAGUE_MESSAGES.PREMIUM_REQUIRED),
    };
  }

  return { isValid: true as const, data: user };
}

async function validateUserForLeagueUpdate(leagueId: string) {
  const user = await getUser();

  if (!user) {
    return {
      isValid: false as const,
      error: createError(LEAGUE_MESSAGES.ADMIN_REQUIRED),
    };
  }

  const isAdmin = await isLeagueAdmin(user.id, leagueId);
  if (!isAdmin) {
    return {
      isValid: false as const,
      error: createError(LEAGUE_MESSAGES.ADMIN_REQUIRED),
    };
  }

  return { isValid: true as const, data: user };
}

function validateLeagueSchema(values: CreateLeagueSchema) {
  return validateSchema<CreateLeagueSchema>(createLeagueSchema, values);
}

function validateProfileSchema(values: LeagueProfileSchema) {
  return validateSchema<LeagueProfileSchema>(leagueProfileSchema, values);
}

async function validateUniqueName(name: string) {
  const isUnique = await isUniqueName(name);

  if (!isUnique) {
    return {
      isValid: false as const,
      error: createError(LEAGUE_MESSAGES.NAME_EXISTS),
    };
  }

  return { isValid: true as const, data: true };
}

async function executeLeagueCreation(
  context: Omit<LeagueCreationContext, "leagueId">
) {
  return await db.transaction(async (tx) => {
    const leagueId = await insertLeague(
      { ownerId: context.user.id, ...context.league },
      tx
    );
    await insertLeagueOptions({ leagueId }, tx);
    return leagueId;
  });
}

async function schedulePostCreationTasks(context: LeagueCreationContext) {
  after(async () => {
    await Promise.all([
      addUserLeaguesMetadata(context.user, context.leagueId),
      insertLeagueMember(context.user.id, context.leagueId, "admin"),
    ]);

    if (context.league.image) {
      await updateLeagueImage(context.leagueId, context.league.image);
    }
  });
}

async function executeLeagueUpdate(
  leagueId: string,
  data: LeagueProfileSchema
) {
  if (data.image) {
    after(() => updateLeagueImage(leagueId, data.image!));
  }

  await updateLeague(leagueId, data);
}

async function updateLeagueImage(leagueId: string, file: File) {
  const imageUrl = await uploadImage({
    file,
    folder: "leagues-logos",
    name: leagueId,
  });

  if (imageUrl) {
    await updateLeague(leagueId, { imageUrl });
  }
}

async function isUniqueName(leagueName: string) {
  const [result] = await db
    .select({ count: count() })
    .from(leagues)
    .where(ilike(leagues.name, leagueName));

  return result.count === 0;
}

function redirectToLeagueSetup(leagueId: string) {
  const leagueUrl = `/leagues/${leagueId}`;
  redirect(
    `${leagueUrl}/teams/create?redirectUrl=${leagueUrl}/options/general`
  );
}
