"use client";

import { LineupPlayerType } from "@/drizzle/schema";
import useMyLineup from "@/hooks/useMyLineup";

type Props = {
  children: React.ReactNode;
  lineupType: LineupPlayerType;
  className?: string;
};

export default function PlayersSelectTrigger({
  children,
  lineupType,
  className = "",
}: Props) {
  const { handleSetPlayersDialog } = useMyLineup();

  return (
    <button
      className={className}
      onClick={handleSetPlayersDialog.bind(null, {
        open: true,
        type: lineupType,
      })}
    >
      {children}
    </button>
  );
}
