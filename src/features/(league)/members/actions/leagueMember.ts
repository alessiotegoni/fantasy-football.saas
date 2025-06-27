"use server";

import {
  joinPrivateLeagueSchema,
  JoinPrivateLeagueSchema,
} from "@/features/(league)/leagues/schema/privateLeague";
import { insertLeagueMember } from "../db/leagueMember";
import { addUserLeaguesMetadata, getUser } from "@/features/users/utils/user";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";
import { canJoinLeague } from "@/features/(league)/leagues/permissions/league";
import {
  getUUIdSchema,
  validateSchema,
  VALIDATION_ERROR,
} from "@/schema/helpers";
import { createError } from "@/lib/helpers";

enum LEAGUE_MEMBER_MESSAGES {
  LEAGUE_CODE_ERROR = "Codice o password della lega errati",
}

export async function joinPrivateLeague(values: JoinPrivateLeagueSchema) {
  const schemaValidation = validateSchema<JoinPrivateLeagueSchema>(
    joinPrivateLeagueSchema,
    values
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  const league = await getLeagueFromCode(schemaValidation.data);
  if (!league) return createError(LEAGUE_MEMBER_MESSAGES.LEAGUE_CODE_ERROR);

  return await joinMemberToLeague(league.id);
}

export async function joinPublicLeague(leagueId: string) {
  if (!getUUIdSchema().safeParse(leagueId).success) {
    return createError(VALIDATION_ERROR);
  }

  return await joinMemberToLeague(leagueId);
}

async function joinMemberToLeague(leagueId: string) {
  const user = await getUser();
  if (!user) return createError(VALIDATION_ERROR);

  const { error, message } = await canJoinLeague(user.id, leagueId);
  if (error) return createError(message);

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
