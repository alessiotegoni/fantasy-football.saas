"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { use, useCallback, useEffect } from "react";
import { getPlayersRoles } from "../queries/player";
import usePlayersList from "@/hooks/usePlayersList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Role } from "@/contexts/PlayersListProvider";

export default function PlayersRolesFilters({
  playersRolesPromise,
}: {
  playersRolesPromise: ReturnType<typeof getPlayersRoles>;
}) {
  const roles = use(playersRolesPromise);

  useEffect(() => {
    setRoles(roles);
  }, [roles]);

  const { filters, handleSetFilters, setRoles } = usePlayersList();

  const handleRolesFilter = useCallback(
    ({ id }: Role) => {
      const roles = filters.roles;
      const updatedRoles = roles.includes(id)
        ? roles.filter((roleId) => roleId !== id)
        : [...roles, id];
      handleSetFilters({ roles: updatedRoles });
    },
    [filters.roles]
  );

  return (
    <Carousel>
      <div className="flex items-center gap-3">
        <h2>Ruoli:</h2>
        <CarouselContent className="my-1">
          {roles.map((role) => (
            <CarouselItem key={role.id} className="">
              <Button
                variant="outline"
                className={cn(
                  "w-fit rounded-full text-sm",
                  filters.roles.includes(role.id) &&
                    "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                )}
                size="sm"
                onClick={handleRolesFilter.bind(null, role)}
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
