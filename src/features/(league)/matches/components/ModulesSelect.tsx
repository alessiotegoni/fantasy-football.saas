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
import { useMyLineup } from "@/contexts/MyLineupProvider";
import { TacticalModule } from "@/drizzle/schema";

export default function ModulesSelect(
  props: ComponentProps<typeof LeagueModules>
) {
  const isMobile = useIsMobile();

  const { tacticalModule, handleSetModule } = useMyLineup();

  const [open, setOpen] = useState(false);

  const handleModuleChange = (module: TacticalModule) => {
    setOpen(false);
    handleSetModule(module);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            {tacticalModule ? tacticalModule.name : "Seleziona modulo"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Moduli disponibili</DrawerTitle>
            <DrawerDescription>
              Seleziona il modulo della tua formazione
            </DrawerDescription>
          </DrawerHeader>
          <Suspense>
            <LeagueModules
              {...props}
              defaultModule={tacticalModule}
              onModuleChange={handleModuleChange}
            />
          </Suspense>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {tacticalModule ? tacticalModule.name : "Seleziona modulo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Moduli disponibili</DialogTitle>
          <DialogDescription>
            Seleziona il modulo della tua formazione
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
      <Suspense>
        <LeagueModules
          {...props}
          defaultModule={tacticalModule}
          onModuleChange={handleModuleChange}
        />
      </Suspense>
    </Dialog>
  );
}
