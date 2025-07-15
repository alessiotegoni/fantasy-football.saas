import { getPlayersTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import {
  leagueMemberTeamPlayers,
  leagueMemberTeams,
  players,
} from "@/drizzle/schema";
import { getLeagueAvailablePlayersTag } from "@/features/(league)/leagues/db/cache/league";
import InsertPlayerDialog from "@/features/(league)/teamsPlayers/components/InsertPlayerDialog.tsx";
import PlayersEmptyState from "@/features/(league)/teamsPlayers/components/PlayersEmptyState";
import PlayersList from "@/features/(league)/teamsPlayers/components/PlayersList";
import { eq, notInArray } from "drizzle-orm";
import { ArrowLeft } from "iconoir-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

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
      <PlayersList
        leagueId={leagueId}
        players={players}
        actionsDialog={<InsertPlayerDialog />}
        emptyState={<PlayersEmptyState />}
        virtualized
      />
    </div>
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
