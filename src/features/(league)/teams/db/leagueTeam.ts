import { db } from "@/drizzle/db";
import { leagueMemberTeams } from "@/drizzle/schema";
import { revalidateLeagueTeamsCache } from "./cache/leagueTeam";
import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidateUserTeam } from "@/features/users/db/cache/user";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione della squadra",
  UPDATE_FAILED = "Errore nell'aggiornamento della squadra",
  CREDITS_UPDATE_FAILED = "Errore nell'aggiornamento dei crediti delle squadre",
}

export async function insertLeagueTeam(
  team: typeof leagueMemberTeams.$inferInsert,
  userId: string
) {
  const [res] = await db
    .insert(leagueMemberTeams)
    .values(team)
    .returning({ teamId: leagueMemberTeams.id });

  if (!res.teamId)
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);

  revalidateLeagueTeamsCache({
    leagueId: team.leagueId,
    teamsIds: [res.teamId],
  });
  revalidateUserTeam(userId);

  return res.teamId;
}

export async function updateLeagueTeams(
  teamsIds: string[],
  leagueId: string,
  team: Partial<
    Omit<
      typeof leagueMemberTeams.$inferInsert,
      "id" | "leagueMemberId" | "leagueId"
    >
  >,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .update(leagueMemberTeams)
    .set(team)
    .where(
      and(
        eq(leagueMemberTeams.leagueId, leagueId),
        inArray(leagueMemberTeams.id, teamsIds)
      )
    )
    .returning({ teamId: leagueMemberTeams.id });

  if (!res.teamId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }

  revalidateLeagueTeamsCache({ leagueId, teamsIds });

  return res.teamId;
}

export async function addCreditsToLeagueTeams(
  teamsIds: string[],
  leagueId: string,
  creditsToAdd: number,
  tx: Omit<typeof db, "$client"> = db
) {
  if (!creditsToAdd) return;

  const updatedTeams = await tx
    .update(leagueMemberTeams)
    .set({
      credits: sql`${leagueMemberTeams.credits} + ${creditsToAdd}`,
    })
    .where(
      and(
        eq(leagueMemberTeams.leagueId, leagueId),
        inArray(leagueMemberTeams.id, teamsIds)
      )
    )
    .returning({ teamId: leagueMemberTeams.id });

  if (!updatedTeams.length) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }

  revalidateLeagueTeamsCache({ leagueId, teamsIds });
}
