import { getUserTeamId } from "@/features/users/queries/user";
import { MatchLineupSchema } from "../schema/match";
import { getMatchInfo } from "../queries/match";
import { getTeamsPlayers } from "../../teamsPlayers/queries/teamsPlayer";
import { createError, createSuccess } from "@/utils/helpers";

enum LINEUP_ERRORS {
  MATCH_NOT_FOUND = "Partita non trovata",
  USER_TEAM_NOT_FOUND = "La tua squadra non e' stata trovata",
  INVALID_TEAM = "Non partecipa a questa partita",
  INVALID_PLAYERS = "Alcuni giocatori scelti nella formazione non fanno parte della tua squadra",
}

export async function canSaveLineup({
  leagueId,
  userId,
  matchId,
  lineupPlayers,
}: MatchLineupSchema & { userId: string }) {
  const [matchInfo, userTeamId] = await Promise.all([
    getMatchInfo({ leagueId, matchId }),
    getUserTeamId(userId, leagueId),
  ]);

  if (!matchInfo) return createError(LINEUP_ERRORS.MATCH_NOT_FOUND);
  if (!userTeamId) return createError(LINEUP_ERRORS.USER_TEAM_NOT_FOUND);

  const { homeTeam, awayTeam } = matchInfo;

  const userTeam = [homeTeam, awayTeam].find((team) => team.id === userTeamId);
  if (!userTeam) return createError(LINEUP_ERRORS.INVALID_TEAM);

  const teamPlayers = await getTeamsPlayers([userTeamId]);
  const teamPlayersIds = new Set(teamPlayers.map((player) => player.id));

  const areInvalidPlayers = lineupPlayers.some(
    (player) => !teamPlayersIds.has(player.id)
  );
  if (areInvalidPlayers) return createError(LINEUP_ERRORS.INVALID_PLAYERS);

  return createSuccess("", {
    lineupId: userTeam.lineup?.id ?? null,
    userTeamId,
  });
}
