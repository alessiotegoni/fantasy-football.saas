import { WarningTriangle } from "iconoir-react";
import { LineupTeam } from "../utils/match";
import { SplitMatchday } from "@/features/splits/queries/split";

export default function LineupEmptyState({
  myTeam,
  team,
  matchMatchday,
}: {
  team: NonNullable<LineupTeam>;
  myTeam: LineupTeam | undefined;
  matchMatchday: SplitMatchday;
}) {
  const isMatchdayEnded = matchMatchday.status === "ended";
  const text =
    myTeam?.id !== team.id
      ? "Formazione non inserita"
      : `Non puoi ${isMatchdayEnded ? "piu'" : "ancora"} mettere la formazione`;

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-40 bg-muted rounded-3xl text-sm text-center flex flex-col justify-center items-center p-4 border border-border">
        <WarningTriangle className="size-12 mb-3" />
        {text}
      </div>
    </div>
  );
}
