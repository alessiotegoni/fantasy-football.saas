"use client";

import { LineupPlayerType, PositionId } from "@/drizzle/schema";
import useMyLineup from "@/hooks/useMyLineup";

type Props = {
  children: React.ReactNode;
  lineupType: LineupPlayerType;
  roleId?: number;
  positionId?: PositionId;
  className?: string;
};

export default function PlayersSelectTrigger({
  children,
  lineupType,
  roleId,
  positionId,
  className = "",
}: Props) {
  const { handleSetPlayersDialog } = useMyLineup();

  console.log(className);
  

  return (
    <button
      className={className}
      onClick={handleSetPlayersDialog.bind(null, {
        open: true,
        type: lineupType,
        roleId: roleId ?? null,
        positionId: positionId ?? null,
      })}
    >
      {children}
    </button>
  );
}
