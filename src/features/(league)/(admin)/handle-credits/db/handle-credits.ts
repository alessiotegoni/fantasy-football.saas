import { db } from "@/drizzle/db";
import { leagueMemberTeams } from "@/drizzle/schema";
import { revalidateLeagueTeamsCache } from "@/features/(league)/teams/db/cache/leagueTeam";
import { createError } from "@/lib/helpers";
import { and, eq, inArray, sql } from "drizzle-orm";

enum DB_ERROR_MESSAGES {
  ADD_CREDITS = "Errore nell'aggiunta dei crediti alle squadre",
}

export async function addTeamsCredits(
  teamsIds: string[],
  leagueId: string,
  creditsToAdd: number,
  tx: Omit<typeof db, "$client"> = db
) {
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
    throw new Error(createError(DB_ERROR_MESSAGES.ADD_CREDITS).message);
  }

  revalidateLeagueTeamsCache({ leagueId, teamsIds });
}
