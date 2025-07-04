"use client"

import { createContext, useCallback, useContext, useState } from "react";

type TeamCreditsChange = {
  teamId: string;
  credits: number;
};

type TeamCreditsContextType = {
  changes: TeamCreditsChange[];
  updateTeamCredits: (teamId: string, credits: number) => void;
  resetChanges: () => void;
};

const TeamCreditsContext = createContext<TeamCreditsContextType | null>(null);

export default function TeamsCreditsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [changes, setChanges] = useState<TeamCreditsChange[]>([]);

  const updateTeamCredits = useCallback((teamId: string, credits: number) => {
    const existingIndex = changes.findIndex(
      (change) => change.teamId === teamId
    );

    if (existingIndex === -1) {
      setChanges([...changes, { teamId, credits }]);
      return;
    }

    setChanges(changes.with(existingIndex, { teamId, credits }));
  }, [changes]);

  const resetChanges = useCallback(() => {
    setChanges([]);
  }, []);

  return (
    <TeamCreditsContext.Provider
      value={{
        changes,
        updateTeamCredits,
        resetChanges,
      }}
    >
      {children}
    </TeamCreditsContext.Provider>
  );
}

export const useTeamsCredits = () => {
  const context = useContext(TeamCreditsContext);
  if (!context) {
    throw new Error("useTeamCredits must be used within a TeamCreditsProvider");
  }
  return context;
};
