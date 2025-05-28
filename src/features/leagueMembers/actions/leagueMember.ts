"use server";

import {
  joinPrivateLeagueSchema,
  JoinPrivateLeagueSchema,
} from "@/features/leagues/schema/privateLeague";
import { getError, insertLeagueMember } from "../db/leagueMember";
import { addUserLeaguesMetadata, getUser } from "@/features/users/utils/user";
import { canJoinLeague } from "../permissions/leagueMember";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";

export async function joinPrivateLeague(values: JoinPrivateLeagueSchema) {
  const { success, data } = joinPrivateLeagueSchema.safeParse(values);
  if (!success) return getError();

  const league = await db.query.leagues.findFirst({
    columns: {
      id: true,
    },
    where: ({ joinCode, password }, { and, eq }) =>
      and(eq(joinCode, data.joinCode), eq(password, data.password)),
  });

  if (!league) return getError("Codice o password della lega errati");

  return await joinMemberToLeague(league.id);
}

// FIXME: check if user is already in league and if is banned, and if is

async function joinMemberToLeague(leagueId: string) {
  const user = await getUser();

  if (!user || !(await canJoinLeague(user.id)))
    return getError("Per entrare in piu di una lega devi avere il premium");

  await Promise.all([
    insertLeagueMember(user.id, leagueId),
    addUserLeaguesMetadata(user, leagueId),
  ]);

  redirect(`/leagues/${leagueId}`);
}
