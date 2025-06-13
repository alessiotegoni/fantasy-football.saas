"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { use, useCallback, useEffect } from "react";
import { getTeams } from "@/features/teams/queries/team";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import { usePlayersEnrichment } from "@/contexts/PlayersEnrichmentProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Team } from "@/contexts/PlayersProvider";

export default function TeamsFilters({
  teamsPromise,
}: {
  teamsPromise: ReturnType<typeof getTeams>;
}) {
  const teams = use(teamsPromise);
  const { setTeams } = usePlayersEnrichment();
  const { filters, handleSetFilters, isFilterEnabled } = usePlayersFilters();

  useEffect(() => {
    setTeams(teams);
  }, [teams, setTeams]);

  if (!isFilterEnabled("teams")) return null

  const handleTeamsFilter = useCallback(
    ({ id }: Team) => {
      const currentTeams = filters.teams;
      const updatedTeams = currentTeams.includes(id)
        ? currentTeams.filter((teamId) => teamId !== id)
        : [...currentTeams, id];
      handleSetFilters({ teams: updatedTeams });
    },
    [filters.teams, handleSetFilters]
  );

  return (
    <Carousel>
      <div className="flex items-center gap-3">
        <h2>Squadre:</h2>
        <CarouselContent className="my-1">
          {teams.map((team) => (
            <CarouselItem key={team.id} className="basis-auto first:pl-4 pl-2">
              <Button
                variant="outline"
                className={cn(
                  "w-fit rounded-full text-sm",
                  filters.teams.includes(team.id) &&
                    "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                )}
                size="sm"
                onClick={() => handleTeamsFilter(team)}
              >
                {team.displayName}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
}
