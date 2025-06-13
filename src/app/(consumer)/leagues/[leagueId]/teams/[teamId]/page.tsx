import { db } from "@/drizzle/db";
import { leagueMemberTeamPlayers, players } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getTeamIdTag } from "@/features/(league)/leagueTeams/db/cache/leagueTeam";
import { notFound } from "next/navigation";
import { getTeamPlayersTag } from "@/features/(league)/teamsPlayers/db/cache/teamsPlayer";
import { Suspense } from "react";
import PlayersList from "@/features/(league)/teamsPlayers/components/PlayersList";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, NavArrowRight } from "iconoir-react";
import ReleasePlayerDialog from "@/features/(league)/teamsPlayers/components/ReleasePlayerDialog";
import {
  getPlayersRoles,
  getTeamPlayerPerRoles,
} from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getLeaguePlayersPerRole } from "@/features/(league)/leagues/queries/league";
import LeagueTeamCard from "@/features/(league)/leagueTeams/components/LeagueTeamCard";
import { cn } from "@/lib/utils";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";

export default async function LeagueTeamPage({
  params,
}: {
  params: Promise<{ leagueId: string; teamId: string }>;
}) {
  const { leagueId, teamId } = await params;

  const team = await getLeagueTeam({ leagueId, teamId });
  if (!team) notFound();

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}/teams`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Squadra</h2>
      </div>
      <h2 className="hidden md:block text-2xl font-heading mb-4">Squadra</h2>
      <LeagueTeamCard
        team={team}
        leagueId={leagueId}
        className="bg-sidebar hover:border-border rounded-3xl flex-col md:flex-row items-center"
        showIsUserTeam={false}
        renderTeamPpr={() => (
          <Suspense>
            <TeamPlayerPerRole leagueId={leagueId} teamId={teamId} />
          </Suspense>
        )}
      />
      <SuspendedComponent leagueId={leagueId} teamId={teamId} />
    </div>
  );
}

type Props = { leagueId: string; teamId: string };

async function TeamPlayerPerRole({ leagueId, teamId }: Props) {
  const [playerRoles, teamPlayerRolesCount, leaguePlayerRoles] =
    await Promise.all([
      getPlayersRoles(),
      getTeamPlayerPerRoles(teamId),
      getLeaguePlayersPerRole(leagueId),
    ]);

  return (
    <div className="flex flex-wrap justify-center md:justify-normal gap-3">
      {playerRoles.map((role) => {
        const requiredCount = leaguePlayerRoles[role.id] || 0;
        const teamCount =
          teamPlayerRolesCount.find(
            (teamPlayer) => teamPlayer.roleId === role.id
          )?.playersCount || 0;
        const isComplete = teamCount >= requiredCount;

        return (
          <div
            key={role.id}
            className={cn(
              `p-2 px-3 text-sm flex gap-2 border border-border
              justify-center items-center rounded-xl`,
              !isComplete && "border-destructive"
            )}
          >
            <PlayerRoleBadge role={role} />
            {teamCount}/{requiredCount}
          </div>
        );
      })}
    </div>
  );
}

async function SuspendedComponent({ leagueId, teamId }: Props) {
  const teamPlayers = await getTeamPlayers(teamId);

  return (
    <Suspense>
      <PlayersList
        players={teamPlayers}
        emptyState={<TeamPlayersEmptyState leagueId={leagueId} />}
        actionsDialog={<ReleasePlayerDialog />}
        leagueId={leagueId}
        enabledFilters={[]}
      />
    </Suspense>
  );
}

function TeamPlayersEmptyState({ leagueId }: Pick<Props, "leagueId">) {
  return (
    <EmptyState
      title="Nessun giocatore acquistato"
      description="Se l'asta e' conclusa ed hai gai acquistato giocatori chiedi agli admin della lega di aggiungerteli"
      renderButton={() => (
        <Button asChild>
          <Link href={`/leagues/${leagueId}/players-list`}>
            Listone giocatori
            <NavArrowRight className="size-5" />
          </Link>
        </Button>
      )}
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

async function getLeagueTeam({ leagueId, teamId }: Props) {
  "use cache";
  cacheTag(getTeamIdTag(teamId));

  return db.query.leagueMemberTeams.findFirst({
    columns: {
      leagueId: false,
      leagueMemberId: false,
    },
    where: (team, { and, eq }) =>
      and(eq(team.leagueId, leagueId), eq(team.id, teamId)),
  });
}
