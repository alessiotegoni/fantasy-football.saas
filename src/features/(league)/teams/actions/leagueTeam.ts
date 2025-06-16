"use server";

import { db } from "@/drizzle/db";
import {
  getError,
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

export async function createLeagueTeam(
  leagueId: string,
  values: LeagueTeamSchema
) {
  const { success, data } = leagueTeamSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();
  if (!userId) return getError();

  const leagueMemberId = await getMemberId(userId, leagueId);
  if (!leagueMemberId) return getError("Non sei membro di questa lega");

  if (await memberHasTeam(leagueMemberId))
    return getError("Hai gia creato una squadra in questa lega");

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
  const { success, data } = leagueTeamSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();
  if (!userId) return getError();

  const [memberId, teamMemberId] = await Promise.all([
    getMemberId(userId, leagueId),
    getTeamMemberId(teamId),
  ]);

  if (!memberId || teamMemberId !== memberId) {
    return getError("Non puoi modificare le squadre di altri membri");
  }

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
