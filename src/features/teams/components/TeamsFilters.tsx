"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { use, useCallback } from "react";
import { getTeams } from "@/features/teams/queries/team";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";

export default function TeamsFilters({
  teams,
}: {
  teams: Awaited<ReturnType<typeof getTeams>>;
}) {
  const { filters, handleSetFilters } = usePlayersFilters();

  const handleTeamsFilter = useCallback(
    ({ id }: TeamPlayer["team"]) => {
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
