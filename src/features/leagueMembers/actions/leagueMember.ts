"use server";

import {
  joinPrivateLeagueSchema,
  JoinPrivateLeagueSchema,
} from "@/features/leagues/schema/privateLeague";
import { getError, insertLeagueMember } from "../db/leagueMember";
import { addUserLeaguesMetadata, getUser } from "@/features/users/utils/user";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";
import { canJoinLeague } from "@/features/leagues/permissions/league";

export async function joinPrivateLeague(values: JoinPrivateLeagueSchema) {
  const { success, data } = joinPrivateLeagueSchema.safeParse(values);
  if (!success) return getError();

  const league = await getLeagueFromCode(data);
  if (!league) return getError("Codice o password della lega errati");

  return await joinMemberToLeague(league.id);
}

export async function joinPublicLeague(leagueId: string) {
  if (typeof leagueId !== "string") return getError();

  return await joinMemberToLeague(leagueId);
}

async function joinMemberToLeague(leagueId: string) {
  const user = await getUser();
  if (!user) return getError();

  const { canJoin, message } = await canJoinLeague(user.id, leagueId);
  if (!canJoin) return getError(message);

  await Promise.all([
    insertLeagueMember(user.id, leagueId),
    addUserLeaguesMetadata(user, leagueId),
  ]);

  redirect(`/leagues/${leagueId}/teams/create`);
}

async function getLeagueFromCode(data: JoinPrivateLeagueSchema) {
  return await db.query.leagues.findFirst({
    columns: {
      id: true,
    },
    where: ({ joinCode, password }, { and, eq }) =>
      and(eq(joinCode, data.joinCode), eq(password, data.password)),
  });
}
