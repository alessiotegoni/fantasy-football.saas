import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";

type Props = {
  team: LineupTeam;
  players: LineupPlayer[]
  canEditLineup: boolean;
  className?: string;
};

export default function BenchLineup({
  team,
  canEditLineup,
  className,
}: Props) {

  return (
    <div
      className={cn(
        `bg-input/30 rounded-3xl min-h-[500px] border-border`,
        className
      )}
    ></div>
  );
}
