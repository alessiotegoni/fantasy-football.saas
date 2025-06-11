"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { use, useCallback, useEffect } from "react";
import { getTeams } from "../queries/team";
import usePlayersList from "@/hooks/usePlayersList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Team } from "@/contexts/PlayersListProvider";

export default function TeamsFilters({
  teamsPromise,
}: {
  teamsPromise: ReturnType<typeof getTeams>;
}) {
  const teams = use(teamsPromise);

  useEffect(() => {
    setTeams(teams);
  }, [teams]);

  const { filters, handleSetFilters, setTeams } = usePlayersList();

  const handleTeamsFilter = useCallback(
    ({ id }: Team) => {
      const teams = filters.teams;
      const updatedTeams = teams.includes(id)
        ? teams.filter((teamId) => teamId !== id)
        : [...teams, id];
      handleSetFilters({ teams: updatedTeams });
    },
    [filters.teams]
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
                onClick={handleTeamsFilter.bind(null, team)}
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
