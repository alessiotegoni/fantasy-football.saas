import { db } from "@/drizzle/db";
import { leagueMemberTeams } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeagueTeamsCache } from "./cache/leagueTeam";
import { eq } from "drizzle-orm";

export const getError = (message = "Errore nella creazione del team") =>
  getErrorObject(message);

export async function insertLeagueTeam(
  team: typeof leagueMemberTeams.$inferInsert
) {
  const [res] = await db
    .insert(leagueMemberTeams)
    .values(team)
    .returning({ teamId: leagueMemberTeams.id });

  if (!res.teamId) throw new Error(getError().message);

  revalidateLeagueTeamsCache({ leagueId: team.leagueId, teamId: res.teamId });

  return res.teamId;
}

export async function updateLeagueTeam(
  teamId: string,
  leagueId: string,
  team: Partial<
    Omit<
      typeof leagueMemberTeams.$inferInsert,
      "id" | "leagueMemberId" | "leagueId"
    >
  >
) {
  const [res] = await db
    .update(leagueMemberTeams)
    .set(team)
    .where(eq(leagueMemberTeams.id, teamId))
    .returning({ teamId: leagueMemberTeams.id });

  if (!res.teamId)
    throw new Error(
      getError("Errore nell'aggiornamento della squadra").message
    );

  revalidateLeagueTeamsCache({ leagueId, teamId: res.teamId });

  return res.teamId;
}
