"use client";

import { League } from "@/features/league/leagues/queries/league";
import { createContext, PropsWithChildren, useContext } from "react";

type Props = {
  league: League;
};

type LeagueContext = Props;

const LeagueContext = createContext<LeagueContext | null>(null);

export default function LeagueProvider({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <LeagueContext.Provider value={props}>{children}</LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error("useLeague must be used within LeagueProvider");
  }
  
  return context;
}
