import Avatar from "@/components/Avatar";
import Link from "next/link";
import { getLeagueTeams } from "../queries/leagueTeam";
import { NavArrowRight, Search } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TeamsList({
  teams,
  leagueId,
  teamUserId,
}: {
  teams: Awaited<ReturnType<typeof getLeagueTeams>>;
  leagueId: string;
  teamUserId?: string;
}) {
  const hasTeam = teams.some((team) => team.userId === teamUserId);
  const sortedTeams = sortTeams(teams, teamUserId);

  return (
    <>
      {teamUserId !== undefined && !hasTeam && (
        <CreateTeamBanner leagueId={leagueId} />
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {sortedTeams.map((team) => (
          <div
            key={team.id}
            className={cn(
              "bg-background rounded-xl border border-border hover:border-primary/20 transition-colors",
              team.userId === teamUserId && "border-primary"
            )}
          >
            <div className="flex p-4 gap-4 h-full justify-between">
              {/* Left side: Info */}
              <Link
                href={`/leagues/${leagueId}/teams/${team.id}`}
                className="flex items-center gap-4 grow"
              >
                <Avatar
                  imageUrl={team.imageUrl}
                  name={team.name}
                  size={16}
                  renderFallback={() => team.name.charAt(0).toUpperCase()}
                />
                <div className="grow min-w-0">
                  <h3 className="text-lg font-semibold truncate">
                    {team.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {team.managerName}
                  </p>
                </div>
              </Link>

              {/* Right side: Credits + Edit */}
              <div className="flex flex-col justify-between items-end">
                <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {team.credits} crediti
                </p>
                {team.userId === teamUserId && (
                  <Button variant="gradient" size="sm" className="mt-2">
                    <Link
                      href={`/leagues/${leagueId}/teams/${team.id}/edit`}
                      className="text-xs"
                    >
                      Modifica
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
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

function sortTeams(
  teams: Awaited<ReturnType<typeof getLeagueTeams>>,
  teamUserId?: string
) {
  return teamUserId
    ? teams.toSorted((a, b) => {
        if (a.userId === teamUserId) return -1;
        if (b.userId === teamUserId) return 1;
        return 0;
      })
    : teams;
}
