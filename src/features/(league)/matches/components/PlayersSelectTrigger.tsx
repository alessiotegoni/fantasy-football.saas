"use client";

import { LineupPlayerType, PositionId } from "@/drizzle/schema";
import useMyLineup from "@/hooks/useMyLineup";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  lineupType: LineupPlayerType;
  roleId?: number;
  className?: string;
};

export default function PlayersSelectTrigger({
  children,
  lineupType,
  roleId,
  className,
}: Props) {
  const { handleSetPlayersDialog } = useMyLineup();

  return (
    <button
      className={cn(
        "flex items-center justify-center text-muted-foreground transition-colors hover:text-white cursor-pointer",
        className
      )}
      onClick={handleSetPlayersDialog.bind(null, {
        open: true,
        type: lineupType,
        roleId: roleId ?? null,
      })}
    >
      {children}
    </button>
  );
}
