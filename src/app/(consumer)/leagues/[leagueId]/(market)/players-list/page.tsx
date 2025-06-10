import { PlayersListProvider } from "@/contexts/PlayersListProvider";
import { db } from "@/drizzle/db";
import {
  leagueMemberTeamPlayers,
  leagueMemberTeams,
  players,
} from "@/drizzle/schema";
import { getLeagueAvailablePlayersTag } from "@/features/(league)/leagues/db/cache/league";
import VirtualizedPlayersList from "@/features/(league)/teamsPlayers/components/VirtualizedPlayersList";
import PlayersListSearchBar from "@/features/(league)/teamsPlayers/components/PlayersListSearchBar";
import PlayersRolesFilters from "@/features/(league)/teamsPlayers/components/PlayersRolesFilters";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/player";
import TeamsFilters from "@/features/teams/components/TeamsFilters";
import { getTeams } from "@/features/teams/queries/team";
import { eq, notInArray } from "drizzle-orm";
import { ArrowLeft } from "iconoir-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Suspense } from "react";
import PlayersEmptyState from "@/features/(league)/teamsPlayers/components/PlayersEmptyState";
import { PlayerSelectionProvider } from "@/contexts/PlayerSelectionProvider";
import PlayerSelection from "@/features/(league)/teamsPlayers/components/PlayerSelection";
import { getLeagueTeams } from "@/features/(league)/leagueTeams/queries/leagueTeam";
import InsertPlayerDialog from "@/features/(league)/teamsPlayers/components/InsertPlayerDialog.tsx";

export default async function LeaguePlayersListPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const players = await getLeagueAvailablePlayers(leagueId);

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Listone giocatori</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Listone giocatori
      </h2>
      <PlayersListProvider players={players}>
        <PlayersListSearchBar />
        <Suspense>
          <TeamsFilters teamsPromise={getTeams()} />
          <PlayersRolesFilters playersRolesPromise={getPlayersRoles()} />
        </Suspense>
        <PlayerSelectionProvider
          leagueTeamsPromise={getLeagueTeams(leagueId).then((team) =>
            team.map(({ id, name }) => ({ id, name }))
          )}
        >
          <div className="flex items-center mb-3.5">
            <h2 className="text-xl grow">Giocatori</h2>
            <Suspense>
              <PlayerSelection leagueId={leagueId} />
            </Suspense>
          </div>
          <VirtualizedPlayersList
            emptyState={<PlayersEmptyState label="giocatore" />}
            actionsDialog={<InsertPlayerDialog />}
          />
        </PlayerSelectionProvider>
      </PlayersListProvider>
    </div>
  );
}

async function getLeagueAvailablePlayers(leagueId: string) {
  "use cache";
  cacheTag(getLeagueAvailablePlayersTag(leagueId));

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
      roleId: players.roleId,
      teamId: players.teamId,
      avatarUrl: players.avatarUrl,
    })
    .from(players)
    .where(
      notInArray(
        players.id,
        takenPlayersSubquery.map((player) => player.playerId)
      )
    );

  return availablePlayers;
}
