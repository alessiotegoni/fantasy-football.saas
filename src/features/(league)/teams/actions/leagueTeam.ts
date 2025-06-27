"use server";

import { db } from "@/drizzle/db";
import {
  insertLeagueTeam,
  updateLeagueTeam as updateLeagueTeamDb,
} from "../db/leagueTeam";
import { leagueTeamSchema, LeagueTeamSchema } from "../schema/leagueTeam";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getUserId } from "@/features/users/utils/user";
import { memberHasTeam } from "../permissions/leagueTeam";
import { after } from "next/server";
import { uploadImage } from "@/services/supabase/storage/supabase";
import { redirect } from "next/navigation";
import { createError } from "@/lib/helpers";
import { validateSchema, VALIDATION_ERROR } from "@/schema/helpers";

enum TEAM_ERROR_MESSAGES {
  NOT_MEMBER = "Non sei membro di questa lega",
  TEAM_EXISTS = "Hai già creato una squadra in questa lega",
  NOT_TEAM_OWNER = "Non puoi modificare le squadre di altri membri",
}

export async function createLeagueTeam(
  leagueId: string,
  values: LeagueTeamSchema
) {
  const schemaValidation = validateSchema<LeagueTeamSchema>(
    leagueTeamSchema,
    values
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const leagueMemberId = await getMemberId(userId, leagueId);
  if (!leagueMemberId) return createError(TEAM_ERROR_MESSAGES.NOT_MEMBER);

  if (await memberHasTeam(leagueMemberId))
    return createError(TEAM_ERROR_MESSAGES.TEAM_EXISTS);

  const { data } = schemaValidation;

  const teamId = await insertLeagueTeam(
    {
      ...data,
      leagueId,
      leagueMemberId,
    },
    userId
  );

  if (data.image) {
    after(updateTeamImage.bind(null, teamId, leagueId, data.image));
  }

  redirect(`/leagues/${leagueId}/teams`);
}

export async function updateLeagueTeam(
  teamId: string,
  leagueId: string,
  values: LeagueTeamSchema
) {
  const schemaValidation = validateSchema<LeagueTeamSchema>(
    leagueTeamSchema,
    values
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const [memberId, teamMemberId] = await Promise.all([
    getMemberId(userId, leagueId),
    getTeamMemberId(teamId),
  ]);

  if (!memberId || teamMemberId !== memberId) {
    return createError(TEAM_ERROR_MESSAGES.NOT_TEAM_OWNER);
  }

  const { data } = schemaValidation;

  await updateLeagueTeamDb(teamId, leagueId, data);

  if (data.image) {
    after(updateTeamImage.bind(null, teamId, leagueId, data.image));
  }

  redirect(`/leagues/${leagueId}/teams`);
}

async function updateTeamImage(teamId: string, leagueId: string, file: File) {
  const imageUrl = await uploadImage({
    file,
    folder: "teams-logos",
    name: teamId,
  });

  if (imageUrl) await updateLeagueTeamDb(teamId, leagueId, { imageUrl });
}

function getTeamMemberId(teamId: string) {
  return db
    .select({ id: leagueMemberTeams.leagueMemberId })
    .from(leagueMemberTeams)
    .where(eq(leagueMemberTeams.id, teamId))
    .then((res) => res[0].id);
}

function getMemberId(userId: string, leagueId: string) {
  return db
    .select({ id: leagueMembers.id })
    .from(leagueMembers)
    .where(
      and(
        eq(leagueMembers.leagueId, leagueId),
        eq(leagueMembers.userId, userId)
      )
    )
    .then((res) => res[0].id);
}
