import { db } from "@/drizzle/db";
import { leagueSettings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PlayersList from "@/components/PlayersList";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";
import ReleasePlayerDialog from "@/features/(league)/teamsPlayers/components/ReleasePlayerDialog";
import {
  getPlayersRoles,
  getTeamPlayerPerRoles,
  getTeamsPlayers,
  PlayerRole,
} from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { cn } from "@/lib/utils";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import LeagueTeamCard from "@/features/(league)/teams/components/LeagueTeamCard";
import {
  getLeagueTeam,
  getLeagueTeams,
} from "@/features/(league)/teams/queries/leagueTeam";
import Container from "@/components/Container";
import { getTeams, Team } from "@/features/teams/queries/team";
import PlayerSelection from "@/features/(league)/teamsPlayers/components/PlayerSelection";
import { getLeaguePlayersPerRole } from "@/features/(league)/settings/queries/setting";

export default async function LeagueTeamPage({
  params,
}: PageProps<"/leagues/[leagueId]/teams/[teamId]">) {
  const ids = await params;

  const [leagueTeam, teams, roles] = await Promise.all([
    getLeagueTeam(ids),
    getTeams(),
    getPlayersRoles(),
  ]);
  if (!leagueTeam) notFound();

  const props = {
    ...ids,
    teams,
    roles,
  };

  return (
    <Container {...ids} headerLabel="Squadra">
      <LeagueTeamCard
        team={leagueTeam}
        {...ids}
        className="bg-sidebar hover:border-border rounded-3xl flex-col md:flex-row items-center"
        showIsUserTeam={false}
        renderTeamPpr={() => (
          <Suspense>
            <TeamPlayerPerRole {...props} />
          </Suspense>
        )}
      />
      <Suspense>
        <SuspenseBoundary {...props} />
      </Suspense>
    </Container>
  );
}

type Props = {
  leagueId: string;
  teamId: string;
  teams: Team[];
  roles: PlayerRole[];
};

async function SuspenseBoundary({ leagueId, teamId, ...props }: Props) {
  const [teamPlayers, leagueTeams] = await Promise.all([
    getTeamsPlayers([teamId]),
    getLeagueTeams(leagueId),
  ]);

  return (
    <PlayersList
      {...props}
      players={teamPlayers}
      leagueTeams={leagueTeams}
      emptyState={<TeamPlayersEmptyState leagueId={leagueId} />}
      selectionButton={
        <Suspense>
          <PlayerSelection leagueId={leagueId} />
        </Suspense>
      }
      actionsDialog={
        <ReleasePlayerDialog
          releasePercentagePromise={getLeagueReleasePercentage(leagueId)}
        />
      }
      enabledFilters={[]}
    />
  );
}

async function TeamPlayerPerRole({
  leagueId,
  teamId,
  roles,
}: Omit<Props, "teams">) {
  const [teamPlayerRolesCount, leaguePlayerRoles] = await Promise.all([
    getTeamPlayerPerRoles(teamId),
    getLeaguePlayersPerRole(leagueId),
  ]);

  return (
    <div className="flex flex-wrap justify-center md:justify-normal gap-3">
      {roles.map((role) => {
        const requiredCount = leaguePlayerRoles[role.id] || 1;

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
    .select({ releasePercentage: leagueSettings.releasePercentage })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return res.releasePercentage;
}
