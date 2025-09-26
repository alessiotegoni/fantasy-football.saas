"use client";

import { League } from "@/features/league/leagues/queries/league";
import { User } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext } from "react";

type Props = {
  league: League;
  user?: User;
  isAdmin?: boolean;
  leaguePremium?: boolean;
};

type LeagueContext = Props;

const LeagueContext = createContext<LeagueContext | null>(null);

export default function LeagueProvider({
  children,
  isAdmin = false,
  leaguePremium = false,
  ...restProps
}: PropsWithChildren<Props>) {
  return (
    <LeagueContext.Provider value={{ isAdmin, leaguePremium, ...restProps }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error("useLeague must be used within LeagueProvider");
  }

  return context;
}
