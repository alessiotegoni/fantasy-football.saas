import { getPlayersTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import {
  leagueMemberTeamPlayers,
  leagueMemberTeams,
  playerRoles,
  players,
  teams,
} from "@/drizzle/schema";
import { getLeagueAvailablePlayersTag } from "@/features/(league)/leagues/db/cache/league";
import InsertPlayerDialog from "@/features/(league)/teamsPlayers/components/InsertPlayerDialog.tsx";
import PlayersEmptyState from "@/features/(league)/teamsPlayers/components/PlayersEmptyState";
import PlayersList from "@/components/PlayersList";
import { eq, notInArray } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getPlayersRoles,
  PlayerRole,
  TeamPlayer,
} from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getTeams, Team } from "@/features/teams/queries/team";
import Container from "@/components/Container";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { Suspense } from "react";
import PlayerSelection from "@/features/(league)/teamsPlayers/components/PlayerSelection";

export default async function LeaguePlayersListPage({
  params,
}: PageProps<"/league/[leagueId]/players-list">) {
  const { leagueId } = await params;
  const [players, teams, roles] = await Promise.all([
    getLeagueAvailablePlayers(leagueId),
    getTeams(),
    getPlayersRoles(),
  ]);

  const props = {
    players,
    roles,
    teams,
    leagueId,
  };

  return (
    <Container leagueId={leagueId} headerLabel="Listone giocatori">
      <Suspense
        fallback={
          <PlayersList
            {...props}
            actionsDialog={<InsertPlayerDialog />}
            emptyState={<PlayersEmptyState />}
            virtualized
          />
        }
      >
        <SuspenseBoundary {...props} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary(props: {
  leagueId: string;
  players: TeamPlayer[];
  teams: Team[];
  roles: PlayerRole[];
}) {
  const leagueTeams = await getLeagueTeams(props.leagueId);

  return (
    <PlayersList
      {...props}
      selectionButton={
        <Suspense>
          <PlayerSelection {...props} />
        </Suspense>
      }
      leagueTeams={leagueTeams}
      actionsDialog={<InsertPlayerDialog teams={leagueTeams} />}
      emptyState={<PlayersEmptyState />}
      virtualized
    />
  );
}

async function getLeagueAvailablePlayers(leagueId: string) {
  "use cache";
  cacheTag(getPlayersTag(), getLeagueAvailablePlayersTag(leagueId));

  const takenPlayersSubquery = await db
    .select({
      playerId: leagueMemberTeamPlayers.playerId,
    })
    .from(leagueMemberTeamPlayers)
    .innerJoin(
      leagueMemberTeams,
      eq(leagueMemberTeamPlayers.memberTeamId, leagueMemberTeams.id)
    )
    .where(eq(leagueMemberTeams.leagueId, leagueId));

  const availablePlayers = await db
    .select({
      id: players.id,
      displayName: players.displayName,
      avatarUrl: players.avatarUrl,
      role: playerRoles,
      team: teams,
    })
    .from(players)
    .innerJoin(playerRoles, eq(playerRoles.id, players.roleId))
    .innerJoin(teams, eq(teams.id, players.teamId))
    .where(
      notInArray(
        players.id,
        takenPlayersSubquery.map((player) => player.playerId)
      )
    );

  return availablePlayers.map((player) => ({
    ...player,
    purchaseCost: 0,
    leagueTeamId: "",
  }));
}
