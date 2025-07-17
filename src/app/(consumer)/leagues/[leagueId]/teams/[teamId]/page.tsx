import { db } from "@/drizzle/db";
import { leagueOptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
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
  getTeamsPlayers,
} from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getLeaguePlayersPerRole } from "@/features/(league)/leagues/queries/league";
import { cn } from "@/lib/utils";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import LeagueTeamCard from "@/features/(league)/teams/components/LeagueTeamCard";
import { getLeagueTeam } from "@/features/(league)/teams/queries/leagueTeam";

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
      <Suspense>
        <SuspendedPlayersList leagueId={leagueId} teamId={teamId} />
      </Suspense>
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

async function SuspendedPlayersList({ leagueId, teamId }: Props) {
  const teamPlayers = await getTeamsPlayers([teamId]);

  return (
    <PlayersList
      players={teamPlayers}
      emptyState={<TeamPlayersEmptyState leagueId={leagueId} />}
      actionsDialog={
        <ReleasePlayerDialog
          releasePercentagePromise={getLeagueReleasePercentage(leagueId)}
        />
      }
      leagueId={leagueId}
      enabledFilters={[]}
    />
  );
}

function TeamPlayersEmptyState({ leagueId }: Pick<Props, "leagueId">) {
  return (
    <EmptyState
      title="Nessun giocatore acquistato"
      description="Se l'asta è conclusa ed hai gia acquistato giocatori chiedi agli admin della lega di aggiungerteli"
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

async function getLeagueReleasePercentage(leagueId: string) {
  const [res] = await db
    .select({ releasePercentage: leagueOptions.releasePercentage })
    .from(leagueOptions)
    .where(eq(leagueOptions.leagueId, leagueId));

  return res.releasePercentage;
}
