import { db } from "@/drizzle/db";
import { leagueMemberTeams } from "@/drizzle/schema";
import { revalidateLeagueTeamsCache } from "@/features/(league)/teams/db/cache/leagueTeam";
import { createError } from "@/utils/helpers";
import { and, eq, inArray, sql, SQL } from "drizzle-orm";

enum DB_ERROR_MESSAGES {
  ADD_CREDITS = "Errore nell'aggiunta dei crediti alle squadre",
  UPDATE_CREDITS = "Errore nell'aggiornamento dei crediti delle squadre",
}

export async function addTeamsCredits(
  teamsIds: string[],
  leagueId: string,
  creditsToAdd: number,
  initialCredits: number,
  tx: Omit<typeof db, "$client"> = db
) {
  const updatedTeams = await tx
    .update(leagueMemberTeams)
    .set({
      credits: sql`
      CASE
        WHEN ${leagueMemberTeams.credits} + ${creditsToAdd} > ${initialCredits}
        THEN ${initialCredits}
        ELSE ${leagueMemberTeams.credits} + ${creditsToAdd}
      END
    `,
    })
    .where(
      and(
        eq(leagueMemberTeams.leagueId, leagueId),
        inArray(leagueMemberTeams.id, teamsIds)
      )
    )
    .returning({ teamId: leagueMemberTeams.id });

  if (!updatedTeams.length) {
    throw new Error(createError(DB_ERROR_MESSAGES.ADD_CREDITS).message);
  }

  revalidateLeagueTeamsCache({ leagueId, teamsIds });
}

export async function subtractTeamsCredits(
  leagueId: string,
  teamsCreditsSpent: { teamId: string; credits: number }[],
  tx: Omit<typeof db, "$client"> = db
) {
  const teamIds: string[] = [];
  const sqlChunks: SQL[] = [];

  teamsCreditsSpent.forEach(({ teamId, credits }) => {
    sqlChunks.push(
      sql`when ${leagueMemberTeams.id} = ${teamId} then ${credits}`
    );
    teamIds.push(teamId);
  });

  const whenClauses = sql.join(sqlChunks, sql.raw(" "));
  const creditsToSubtract = sql`(case ${whenClauses} end)::smallint`;

  const updatedTeams = await tx
    .update(leagueMemberTeams)
    .set({ credits: sql`${leagueMemberTeams.credits} - ${creditsToSubtract}` })
    .where(
      and(
        eq(leagueMemberTeams.leagueId, leagueId),
        inArray(leagueMemberTeams.id, teamIds)
      )
    )
    .returning({ teamId: leagueMemberTeams.id });

  if (!updatedTeams.length) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_CREDITS).message);
  }

  revalidateLeagueTeamsCache({
    leagueId,
    teamsIds: teamsCreditsSpent.map(({ teamId }) => teamId),
  });
}
