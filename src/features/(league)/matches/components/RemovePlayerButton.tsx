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
        "top-1 right-1 p-1 rounded-full size-5",
        className
      )}
    >
      <Xmark className="size-3" />
    </Button>
  );
}
