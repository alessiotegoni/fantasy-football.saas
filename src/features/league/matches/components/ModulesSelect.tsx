"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useMobile";
import LeagueModules from "../../leagues/components/LeagueModules";
import { ComponentProps, Suspense, useState } from "react";
import { TacticalModule } from "@/drizzle/schema";
import useMyLineup from "@/hooks/useMyLineup";
import { cn } from "@/lib/utils";

export default function ModulesSelect(
  props: ComponentProps<typeof LeagueModules>
) {
  const isMobile = useIsMobile();

  const {
    myLineup: { tacticalModule, starterPlayers },
    handleSetModule,
    handleSetLineup,
  } = useMyLineup();

  const [open, setOpen] = useState(false);

  function handleModuleChange(module: TacticalModule) {
    setOpen(false);
    handleSetModule(module);

    if (starterPlayers.length) adjustStarterPlayers(module);
  }

  function adjustStarterPlayers(module: TacticalModule) {
    const modulePositionsIds = new Set(
      module.layout.flatMap((slot) => slot.positionsIds)
    );
    const newStarterPlayers = starterPlayers.filter(
      (player) => player.positionId && modulePositionsIds.has(player.positionId)
    );

    handleSetLineup({ starterPlayers: newStarterPlayers });
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="!bg-input !p-3.5 text-sm sm:rounded-t-none sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-0 sm:z-50 sm:h-10 xl:h-11 sm:w-32"
          >
            {tacticalModule
              ? `Modulo: ${tacticalModule.name}`
              : "Seleziona modulo"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Moduli disponibili</DrawerTitle>
            <DrawerDescription>
              Seleziona il modulo della tua formazione
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 pt-2">
            <Suspense>
              <LeagueModules
                {...props}
                defaultModule={tacticalModule}
                onModuleChange={handleModuleChange}
              />
            </Suspense>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `!bg-input !p-3.5 text-xs sm:rounded-t-none
          absolute left-1/2 -translate-x-1/2 top-0 z-50 h-10 xl:h-11 w-32`,
            tacticalModule && "xl:text-sm"
          )}
        >
          {tacticalModule
            ? `Modulo: ${tacticalModule.name}`
            : "Seleziona modulo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Moduli disponibili</DialogTitle>
          <DialogDescription>
            Seleziona il modulo della tua formazione
          </DialogDescription>
        </DialogHeader>
        <Suspense>
          <LeagueModules
            {...props}
            defaultModule={tacticalModule}
            onModuleChange={handleModuleChange}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
