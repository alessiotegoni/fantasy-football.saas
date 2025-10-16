"use server";

import { db } from "@/drizzle/db";
import {
  insertLeagueTeam,
  updateLeagueTeams as updateLeagueTeamsDB,
} from "../db/leagueTeam";
import { leagueTeamSchema, LeagueTeamSchema } from "../schema/leagueTeam";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getUserId } from "@/features/dashboard/user/utils/user";
import { memberHasTeam } from "../permissions/leagueTeam";
import { after } from "next/server";
import { uploadImage } from "@/services/supabase/storage/supabase";
import { redirect } from "next/navigation";
import { createError, Href } from "@/utils/helpers";
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
  const { isValid, error, data } = validateSchema<LeagueTeamSchema>(
    leagueTeamSchema,
    values
  );
  if (!isValid) return error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const leagueMemberId = await getMemberId(userId, leagueId);
  if (!leagueMemberId) return createError(TEAM_ERROR_MESSAGES.NOT_MEMBER);

  if (await memberHasTeam(leagueMemberId)) {
    return createError(TEAM_ERROR_MESSAGES.TEAM_EXISTS);
  }

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

  redirect(`/leagues/${leagueId}/teams` as Href);
}

export async function updateLeagueTeams(
  teamId: string,
  leagueId: string,
  values: LeagueTeamSchema
) {
  const { isValid, error, data } = validateSchema<LeagueTeamSchema>(
    leagueTeamSchema,
    values
  );
  if (!isValid) return error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const [memberId, teamMemberId] = await Promise.all([
    getMemberId(userId, leagueId),
    getTeamMemberId(teamId),
  ]);

  if (!memberId || teamMemberId !== memberId) {
    return createError(TEAM_ERROR_MESSAGES.NOT_TEAM_OWNER);
  }

  await updateLeagueTeamsDB([teamId], leagueId, data);

  if (data.image) {
    after(updateTeamImage.bind(null, teamId, leagueId, data.image));
  }

  redirect(`/leagues/${leagueId}/teams` as Href);
}

async function updateTeamImage(teamId: string, leagueId: string, file: File) {
  const imageUrl = await uploadImage({
    file,
    folder: "teams-logos",
    name: teamId,
  });

  if (imageUrl) await updateLeagueTeamsDB([teamId], leagueId, { imageUrl });
}

async function getTeamMemberId(teamId: string) {
  return db
    .select({ id: leagueMemberTeams.leagueMemberId })
    .from(leagueMemberTeams)
    .where(eq(leagueMemberTeams.id, teamId))
    .then((res) => res[0].id);
}

async function getMemberId(userId: string, leagueId: string) {
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
