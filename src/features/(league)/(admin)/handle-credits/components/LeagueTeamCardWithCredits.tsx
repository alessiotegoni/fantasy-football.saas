import Slider from "@/components/Slider";
import { useTeamCredits } from "@/contexts/TeamsCreditsProvider";
import LeagueTeamCard from "@/features/(league)/teams/components/LeagueTeamCard";
import { ComponentPropsWithoutRef } from "react";

export default function LeagueTeamCardWithCredits(
  teamCardProps: Omit<
    ComponentPropsWithoutRef<typeof LeagueTeamCard>,
    "renderTeamPpr" | "className"
  >
) {
  const { updateTeamCredits } = useTeamCredits();

  return (
    <div className="space-y-4">
      <LeagueTeamCard {...teamCardProps} />

      <div className="bg-background rounded-3xl border border-border p-4">
        <Slider
          value={teamCardProps.team.credits}
          onChange={(value) => updateTeamCredits(teamCardProps.team.id, value)}
          min={0}
          max={1000}
          step={10}
          unit="crediti"
        />
      </div>
    </div>
  );
}
