import { db } from "@/drizzle/db";
import { leagueMemberTeams } from "@/drizzle/schema";
import { revalidateLeagueTeamsCache } from "./cache/leagueTeam";
import { eq, inArray } from "drizzle-orm";
import { revalidateUserTeam } from "@/features/users/db/cache/user";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione della squadra",
  UPDATE_FAILED = "Errore nell'aggiornamento della squadra",
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

export async function updateLeagueTeam(
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
    .where(inArray(leagueMemberTeams.id, teamsIds))
    .returning({ teamId: leagueMemberTeams.id });

  if (!res.teamId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }

  revalidateLeagueTeamsCache({ leagueId, teamsIds });

  return res.teamId;
}
