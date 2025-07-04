"use client";

import Slider from "@/components/Slider";
import NumberInput from "@/components/ui/number-input";
import { useTeamCredits } from "@/contexts/TeamsCreditsProvider";
import LeagueTeamCard from "@/features/(league)/teams/components/LeagueTeamCard";
import { ComponentPropsWithoutRef, useMemo } from "react";

export default function LeagueTeamCardWithCredits({
  team,
  ...restProps
}: Omit<
  ComponentPropsWithoutRef<typeof LeagueTeamCard>,
  "renderTeamPpr" | "className"
>) {
  const { changes, updateTeamCredits } = useTeamCredits();

  const value = useMemo(() => {
    const updatedCredits = changes.find((change) => change.teamId === team.id);
    return updatedCredits?.credits ?? team.credits;
  }, [changes, team]);

  return (
    <div className="space-y-4 border border-border rounded-3xl">
      <LeagueTeamCard
        team={team}
        showIsUserTeam={false}
        className="border-0"
        {...restProps}
      />

      <div className="p-4">
        <Slider
          value={value}
          onChange={(value) => updateTeamCredits(team.id, value)}
          min={0}
          max={5000}
          step={10}
          unit="crediti"
          renderNumberInput={(props) => (
            <div className="flex items-center gap-2">
              <NumberInput {...props} />
              Crediti
            </div>
          )}
        />
      </div>
    </div>
  );
}
