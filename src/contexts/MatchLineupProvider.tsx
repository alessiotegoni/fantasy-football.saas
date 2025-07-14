"use client";

import { CustomBonusMalus, LineupPlayerType } from "@/drizzle/schema";
import { createContext } from "react";

type LineupPlayer = {
  id: string;
  playerId: string;
  playerType: LineupPlayerType;
  roleId: number;
  positionId: string;
  positionOrder: number;
  totalVote: number;
};

type TeamLineup = {
  id: string;
  players: LineupPlayer[];
} | null;

type MatchLineupContext = {
  lineups: {
    home: TeamLineup;
    away: TeamLineup;
  };
};

type MatchInfo = {
  id: string;
  isBye: boolean;
  leagueCustomBonusMalus: CustomBonusMalus;
};

const MatchLineupContext = createContext<MatchLineupContext | null>(null);

export default function MatchLineupProvider({
  matchInfo,
  children,
}: {
  matchInfo: MatchInfo;
  children: React.ReactNode;
}) {
  return (
    <MatchLineupContext.Provider value={{}}>
      {children}
    </MatchLineupContext.Provider>
  );
}
