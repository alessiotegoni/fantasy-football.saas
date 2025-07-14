import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getMatchStartersLineupTag } from "../db/cache/match";
import { db } from "@/drizzle/db";
import {
  bonusMalusTypes,
  leagueMatches,
  leagueMatchLineupPlayers,
  leagueMatchTeamLineup,
  matchdayBonusMalus,
  matchdayVotes,
  playerRoles,
  players,
  teams,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getTeamsTag } from "@/cache/global";

export async function getStarterLineups(
  matchId: string,
  currentMatchdayId: number
) {
  "use cache";
  cacheTag(getMatchStartersLineupTag(matchId), getTeamsTag());

  const results = await db
    .select({
      lineupPlayerId: leagueMatchLineupPlayers.id,
      playerId: leagueMatchLineupPlayers.playerId,
      role: playerRoles,
      team: {
        displayName: teams.displayName,
      },
      positionId: leagueMatchLineupPlayers.positionId,
      positionOrder: leagueMatchLineupPlayers.positionOrder,
      vote: matchdayVotes.vote,
      bonusMaluses: {
        id: matchdayBonusMalus.bonusMalusTypeId,
        count: matchdayBonusMalus.count,
        imageUrl: bonusMalusTypes.imageUrl,
      },
    })
    .from(leagueMatchLineupPlayers)
    .innerJoin(
      leagueMatchTeamLineup,
      eq(leagueMatchTeamLineup.id, leagueMatchLineupPlayers.lineupId)
    )
    .innerJoin(
      leagueMatches,
      eq(leagueMatches.id, leagueMatchTeamLineup.matchId)
    )
    .innerJoin(players, eq(players.id, leagueMatchLineupPlayers.playerId))
    .innerJoin(teams, eq(teams.id, players.teamId))
    .innerJoin(playerRoles, eq(playerRoles.id, players.roleId))
    .innerJoin(
      matchdayVotes,
      and(
        eq(matchdayVotes.playerId, players.id),
        eq(matchdayVotes.matchdayId, leagueMatches.splitMatchdayId)
      )
    )
    .innerJoin(
      matchdayBonusMalus,
      and(
        eq(matchdayBonusMalus.playerId, players.id),
        eq(matchdayBonusMalus.matchdayId, leagueMatches.splitMatchdayId)
      )
    )
    .innerJoin(
      bonusMalusTypes,
      eq(bonusMalusTypes.id, matchdayBonusMalus.bonusMalusTypeId)
    )
    .where(
      and(
        eq(leagueMatches.id, matchId),
        eq(leagueMatches.splitMatchdayId, currentMatchdayId)
      )
    );

  return results;
}
