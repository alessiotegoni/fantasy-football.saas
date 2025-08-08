"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMobile";
import useMyLineup from "@/hooks/useMyLineup";
import { cn } from "@/lib/utils";
import { Xmark } from "iconoir-react";

type Props = {
  playerId: number;
  className?: string;
};

// TODO: per telefono (breakpooint sm) rimuovere il bottone ed aggiungere
// che swappando verso sinistra si elimina (appare anche una scritta)
// mentre per breakpoint (2xl) vedere BenchLineup

export default function RemovePlayerButton({ playerId, className }: Props) {
  const isMobile = useIsMobile();

  const { removePlayerFromLineup } = useMyLineup();

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={removePlayerFromLineup.bind(null, playerId)}
      className={cn(
        isMobile ? "absolute flex" : "hidden group-hover:flex absolute",
        "top-1/2 -translate-y-1/2 right-1 p-1 rounded-full size-5 !bg-destructive/100",
        className
      )}
    >
      <Xmark className="size-3.5" />
    </Button>
  );
}
