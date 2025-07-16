"use client";

import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import { useMyLineup } from "@/contexts/MyLineupProvider";
import { default as RoleColumn } from "./RoleGroup";

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

  return (
    <div className="ml-3 flex items-center gap-3">
      {tacticalModule &&
        tacticalModule.layout.map((role) => (
          <RoleColumn
            key={role.roleId}
            role={role}
            players={players}
            canEdit={canEdit}
          />
        ))}
    </div>
  );
}
