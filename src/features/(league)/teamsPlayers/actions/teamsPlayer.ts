"use server";

import { getUserId } from "@/features/users/utils/user";
import { deleteTeamPlayer, getError } from "../db/teamsPlayer";
import { canInsertPlayer } from "../permissions/teamsPlayer";
import { insertTeamPlayer } from "../db/teamsPlayer";
import { db } from "@/drizzle/db";
import { updateLeagueTeam } from "../../leagueTeams/db/leagueTeam";
import { eq } from "drizzle-orm";
import { leagueMemberTeams } from "@/drizzle/schema";
import { isLeagueAdmin } from "../../leagueMembers/permissions/leagueMember";
import {
  insertTeamPlayerSchema,
  InsertTeamPlayerSchema,
  removeTeamPlayerSchema,
  RemoveTeamPlayerSchema,
} from "../schema/teamsPlayer";

export async function addTeamPlayer(values: InsertTeamPlayerSchema) {
  const { success, data } = insertTeamPlayerSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();
  if (!userId) return getError();

  const { canCreate, message } = await canInsertPlayer({ ...data, userId });
  if (!canCreate) return getError(message);

  const teamCredits = await getTeamCredits(data.memberTeamId);
  const credits = teamCredits - data.purchaseCost;
  if (credits < 0) {
    return getError(
      `I crediti della squadra selezionata sono insufficenti: ${teamCredits}`
    );
  }

  await db.transaction(async (tx) => {
    await Promise.all([
      insertTeamPlayer(data, tx),
      updateLeagueTeam(data.memberTeamId, data.leagueId, { credits }, tx),
    ]);
  });

  return { error: false, message: "Giocatore aggiunto con successo!" };
}

export async function removeTeamPlayer(values: RemoveTeamPlayerSchema) {
  const { success, data } = removeTeamPlayerSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();
  if (!userId || !(await isLeagueAdmin(userId, data.leagueId))) {
    return getError("Devi essere admin per svincolare il giocatore");
  }

  const teamCredits = await getTeamCredits(data.memberTeamId);
  const credits = teamCredits + data.releaseCost;

  await db.transaction(async (tx) => {
    await Promise.all([
      deleteTeamPlayer(data),
      updateLeagueTeam(data.memberTeamId, data.leagueId, { credits }, tx),
    ]);
  });
}

function getTeamCredits(teamId: string) {
  return db
    .select({ credits: leagueMemberTeams.credits })
    .from(leagueMemberTeams)
    .where(eq(leagueMemberTeams.id, teamId))
    .then(([res]) => res.credits);
}
