"use server";

import { db } from "@/drizzle/db";
import { getUserId } from "@/features/users/utils/user";
import { insertTeamPlayers, deleteTeamsPlayers } from "../db/teamsPlayer";
import { updateLeagueTeams } from "../../teams/db/leagueTeam";
import {
  insertTeamPlayerSchema,
  InsertTeamPlayerSchema,
  releaseTeamPlayerSchema,
  ReleaseTeamPlayerSchema,
} from "../schema/teamsPlayer";
import { canInsertPlayer } from "../permissions/teamsPlayer";
import { getTeamCredits } from "../queries/teamsPlayer";
import { createError, createSuccess } from "@/utils/helpers";
import { validateSchema, VALIDATION_ERROR } from "@/schema/helpers";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";

const TEAM_PLAYERS_MESSAGES = {
  ADMIN_REQUIRED: "Devi essere admin per svincolare il giocatore",
  INSUFFICIENT_CREDITS: (teamCredits: number) =>
    `I crediti della squadra selezionata sono insufficienti: ${teamCredits}`,
  ADDED: "Giocatore aggiunto con successo!",
  RELEASED: "Giocatore svincolato con successo!",
};

export async function addTeamPlayer(values: InsertTeamPlayerSchema) {
  const { isValid, error, data } = validateSchema<InsertTeamPlayerSchema>(
    insertTeamPlayerSchema,
    values
  );
  if (!isValid) return error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const permissions = await canInsertPlayer({ ...data, userId });
  if (permissions.error) return createError(permissions.message);

  const teamCredits = await getTeamCredits(data.memberTeamId);
  const credits = teamCredits - data.purchaseCost;
  if (credits < 0) {
    return createError(TEAM_PLAYERS_MESSAGES.INSUFFICIENT_CREDITS(teamCredits));
  }

  const { leagueId, player, ...restData } = data;

  await db.transaction(async (tx) => {
    await Promise.all([
      insertTeamPlayers(leagueId, [{ playerId: player.id, ...restData }], tx),
      updateLeagueTeams([data.memberTeamId], leagueId, { credits }, tx),
    ]);
  });

  return createSuccess(TEAM_PLAYERS_MESSAGES.ADDED, null);
}

export async function releaseTeamPlayer(values: ReleaseTeamPlayerSchema) {
  const { isValid, error, data } = validateSchema<ReleaseTeamPlayerSchema>(
    releaseTeamPlayerSchema,
    values
  );
  if (!isValid) return error;

  const userId = await getUserId();
  const isAdmin = userId && (await isLeagueAdmin(userId, data.leagueId));
  if (!isAdmin) return createError(TEAM_PLAYERS_MESSAGES.ADMIN_REQUIRED);

  const teamCredits = await getTeamCredits(data.memberTeamId);
  const credits = teamCredits + data.releaseCost;

  await db.transaction(async (tx) => {
    deleteTeamsPlayers(
      data.leagueId,
      {
        membersTeamsIds: [data.memberTeamId],
        playersIds: [data.playerId],
      },
      tx
    ),
      updateLeagueTeams([data.memberTeamId], data.leagueId, { credits }, tx);
  });

  return createSuccess(TEAM_PLAYERS_MESSAGES.RELEASED, null);
}
