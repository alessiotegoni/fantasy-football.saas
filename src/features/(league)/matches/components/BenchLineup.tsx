import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";

type Props = {
  team: LineupTeam;
  canEditLineup: boolean;
  benchLineupsPromise: Promise<LineupPlayer[]>;
  className?: string;
};

export default async function BenchLineup({
  team,
  canEditLineup,
  benchLineupsPromise,
  className,
}: Props) {
  const benchLineups = await benchLineupsPromise;
  const teamLineupPlayers = benchLineups.filter(
    (player) => player.leagueTeamId === team?.id
  );

  return (
    <div
      className={cn(
        `bg-input/30 rounded-3xl min-h-[500px] border-border`,
        className
      )}
    ></div>
  );
}
