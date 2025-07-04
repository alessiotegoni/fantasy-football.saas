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
import { validateSchema, VALIDATION_ERROR } from "@/schema/helpers";

enum LEAGUE_MESSAGES {
  ADMIN_REQUIRED = "Per aggiornare il profilo della lega devi essere admin",
  PROFILE_UPDATED = "Profilo aggiornato con successo",
}

interface LeagueCreationContext {
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
  league: CreateLeagueSchema;
  leagueId: string;
}

export async function createLeague(values: CreateLeagueSchema) {
  const { isValid, error, data } = validateSchema<CreateLeagueSchema>(
    createLeagueSchema,
    values
  );
  if (!isValid) return error;

  const user = await getUser();
  if (!user) return createError(VALIDATION_ERROR);

  const permissions = await canCreateLeague(user.id, data.name);
  if (permissions.error) return permissions;

  const leagueId = await executeLeagueCreation({
    user,
    league: data,
  });

  await schedulePostCreationTasks({
    user,
    league: data,
    leagueId,
  });

  redirectToLeagueSetup(leagueId);
}

export async function updateLeagueProfile(
  values: LeagueProfileSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<LeagueProfileSchema>(
    leagueProfileSchema,
    values
  );
  if (!isValid) return error;

  const user = await getUser();
  if (!user) return createError(VALIDATION_ERROR);

  if (!(await isLeagueAdmin(user.id, leagueId))) {
    return createError(LEAGUE_MESSAGES.ADMIN_REQUIRED);
  }

  await executeLeagueUpdate(leagueId, data);

  return createSuccess(LEAGUE_MESSAGES.PROFILE_UPDATED, null);
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

function redirectToLeagueSetup(leagueId: string) {
  const leagueUrl = `/leagues/${leagueId}`;
  redirect(
    `${leagueUrl}/teams/create?redirectUrl=${leagueUrl}/options/general`
  );
}
