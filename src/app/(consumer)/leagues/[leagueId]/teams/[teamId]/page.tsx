import { db } from "@/drizzle/db";
import { leagueMemberTeamPlayers, players } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "iconoir-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Suspense } from "react";
import PlayersEmptyState from "@/features/(league)/teamsPlayers/components/PlayersEmptyState";
import InsertPlayerDialog from "@/features/(league)/teamsPlayers/components/InsertPlayerDialog.tsx";
import { getTeamIdTag } from "@/features/(league)/leagueTeams/db/cache/leagueTeam";
import PlayerListWrapper from "@/features/(league)/teamsPlayers/components/PlayerListWrapper";
import { notFound } from "next/navigation";
import { getTeamPlayersTag } from "@/features/(league)/teamsPlayers/db/cache/teamsPlayer";

export default async function LeagueTeamPage({
  params,
}: {
  params: Promise<{ leagueId: string; teamId: string }>;
}) {
  const { leagueId, teamId } = await params;

  const team = await getLeagueTeam(leagueId, teamId);
  if (!team) notFound();

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}/teams`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Listone giocatori</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Listone giocatori
      </h2>
      <Suspense>
        <PlayerList leagueId={leagueId} teamId={teamId} />
      </Suspense>
    </div>
  );
}

async function PlayerList({
  leagueId,
  teamId,
}: {
  leagueId: string;
  teamId: string;
}) {
  const teamPlayers = await getTeamPlayers(teamId);

  return (
    <PlayerListWrapper
      players={teamPlayers}
      emptyState={
        <PlayersEmptyState description="Il giocatore e' probabilmente in un'altra squadra o non e' ancora stato acquistato" />
      }
      actionsDialog={<InsertPlayerDialog />}
      leagueId={leagueId}
    />
  );
}

async function getTeamPlayers(teamId: string) {
  "use cache";
  cacheTag(getTeamPlayersTag(teamId));

  return db
    .select({
      id: players.id,
      displayName: players.displayName,
      roleId: players.roleId,
      teamId: players.teamId,
      avatarUrl: players.avatarUrl,
    })
    .from(leagueMemberTeamPlayers)
    .innerJoin(players, eq(players.id, leagueMemberTeamPlayers.playerId))
    .where(eq(leagueMemberTeamPlayers.memberTeamId, teamId));
}

async function getLeagueTeam(leagueId: string, teamId: string) {
  "use cache";
  cacheTag(getTeamIdTag(teamId));

  return db.query.leagueMemberTeams.findFirst({
    where: (team, { and, eq }) =>
      and(eq(team.leagueId, leagueId), eq(team.leagueId, leagueId)),
  });
}
