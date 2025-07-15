import { LineupPlayer } from "../queries/match";
import RoleRow from "./RoleRow";
import { LineupTeam } from "../utils/match";

type Props = {
  team: NonNullable<LineupTeam>;
  canEdit: boolean;
  players: LineupPlayer[];
};

export default function StarterLineupField({ team, canEdit, players }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {team.lineup?.tacticalModule?.layout?.map((role) => (
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
