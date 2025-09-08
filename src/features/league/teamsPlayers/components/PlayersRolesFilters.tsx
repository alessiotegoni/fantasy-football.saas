"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCallback } from "react";
import { TeamPlayer } from "@/features/league/teamsPlayers/queries/teamsPlayer";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PlayersRolesFilters() {
  const { roles, filters, handleSetFilters } = usePlayersFilters();

  const handleRolesFilter = useCallback(
    ({ id }: TeamPlayer["role"]) => {
      const currentRoles = filters.roles;
      const updatedRoles = currentRoles.includes(id)
        ? currentRoles.filter((roleId) => roleId !== id)
        : [...currentRoles, id];
      handleSetFilters({ roles: updatedRoles });
    },
    [filters.roles, handleSetFilters]
  );

  return (
    <Carousel>
      <div className="flex items-center gap-3">
        <h2>Ruoli:</h2>
        <CarouselContent className="my-1">
          {roles.map((role) => (
            <CarouselItem key={role.id} className="basis-auto first:pl-4 pl-2">
              <Button
                variant="outline"
                className={cn(
                  "w-fit rounded-full text-sm",
                  filters.roles.includes(role.id) &&
                    "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                )}
                size="sm"
                onClick={() => handleRolesFilter(role)}
              >
                {role.name}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
}
