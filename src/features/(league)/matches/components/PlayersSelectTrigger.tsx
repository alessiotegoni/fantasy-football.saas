"use client";

import { LineupPlayerType } from "@/drizzle/schema";
import useMyLineup from "@/hooks/useMyLineup";

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
  className = "",
}: Props) {
  const { handleSetPlayersDialog } = useMyLineup();

  return (
    <button
      className={className}
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
