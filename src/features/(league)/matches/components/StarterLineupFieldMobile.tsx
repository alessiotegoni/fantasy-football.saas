"use client";

import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import { useMyLineup } from "@/contexts/MyLineupProvider";
import { default as RoleRow } from "./RoleGroup";

type Props = {
  team: NonNullable<LineupTeam>;
  canEdit: boolean;
  players: LineupPlayer[];
};

export default function StarterLineupFieldMobile({
  team,
  canEdit,
  players,
}: Props) {
  const { tacticalModule: myTacticalModule } = useMyLineup();

  const tacticalModule = canEdit
    ? myTacticalModule
    : team.lineup?.tacticalModule ?? null;

  return (
    <div className="flex flex-col gap-4 p-4">
      {tacticalModule &&
        tacticalModule.layout.map((role) => (
          <RoleRow
            key={role.roleId}
            role={role}
            players={players}
            canEdit={canEdit}
          />
        ))}
    </div>
  );
}
