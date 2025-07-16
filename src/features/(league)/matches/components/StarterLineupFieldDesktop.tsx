"use client";

import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import { useMyLineup } from "@/contexts/MyLineupProvider";
import PositionSlot from "./PositionSlot";

type Props = {
  team: NonNullable<LineupTeam>;
  canEdit: boolean;
  players: LineupPlayer[];
};

export default function StarterLineupFieldDesktop({
  team,
  canEdit,
  players,
}: Props) {
  const { tacticalModule: myTacticalModule } = useMyLineup();

  const tacticalModule = canEdit
    ? myTacticalModule
    : team.lineup?.tacticalModule ?? null;

  if (!tacticalModule) return null;

  return (
    <div className="grid grid-cols-5 gap-4 justify-center p-6">
      {tacticalModule.layout.map((role) =>
        role.positionsIds.map((posId) => {
          const player = players.find((p) => p.positionId === posId);
          return (
            <PositionSlot
              key={posId}
              positionId={posId}
              player={player}
              canEdit={canEdit}
            />
          );
        })
      )}
    </div>
  );
}
