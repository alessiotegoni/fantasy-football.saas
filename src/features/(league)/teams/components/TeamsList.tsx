import Link from "next/link";
import { getLeagueTeams } from "../queries/leagueTeam";
import { NavArrowRight, Search } from "iconoir-react";
import { Button } from "@/components/ui/button";
import LeagueTeamCard from "./LeagueTeamCard";

type Props = {
  teams: Awaited<ReturnType<typeof getLeagueTeams>>;
  leagueId: string;
  teamUserId?: string;
};

export default function TeamsList({ teams, leagueId, teamUserId }: Props) {
  const hasTeam = teams.some((team) => team.userId === teamUserId);
  const sortedTeams = sortTeams({ teams, teamUserId });

  return (
    <>
      {teamUserId !== undefined && !hasTeam && (
        <CreateTeamBanner leagueId={leagueId} />
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {sortedTeams.map((team) => (
          <LeagueTeamCard
            key={team.id}
            team={team}
            teamUserId={teamUserId}
            leagueId={leagueId}
            className="min-h-[110px]"
          />
        ))}
      </div>
    </>
  );
}

function CreateTeamBanner({ leagueId }: { leagueId: string }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-4 bg-muted/30 rounded-2xl mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <div className="size-16 bg-muted rounded-full flex items-center justify-center">
          <Search className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center md:text-start">
          <h3 className="text-lg md:text-xl font-heading">
            Non hai ancora una squadra
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Crea la tua squadra per partecipare alla Lega
          </p>
        </div>
      </div>
      <Button
        variant="gradient"
        asChild
        className="w-fit mt-6 md:mt-0 gap-4 p-2.5 md:py-3.5 md:px-4"
      >
        <Link href={`/leagues/${leagueId}/teams/create`}>
          Crea la tua squadra
          <NavArrowRight className="size-5" />
        </Link>
      </Button>
    </div>
  );
}

function sortTeams({ teams, teamUserId }: Omit<Props, "leagueId">) {
  return teamUserId
    ? teams.toSorted((a, b) => {
        if (a.userId === teamUserId) return -1;
        if (b.userId === teamUserId) return 1;
        return 0;
      })
    : teams;
}
