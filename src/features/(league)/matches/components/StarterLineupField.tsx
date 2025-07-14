import { TacticalModule } from "@/drizzle/schema";
import { LineupPlayer } from "../queries/match";

type Props = {
  matchId: string;
  currentMatchdayId: number;
  tacticalModule: TacticalModule;
  canEdit: boolean;
  starterPlayers: LineupPlayer[]
};

export default function StarterLineupField({
  matchId,
  currentMatchdayId,
  tacticalModule,
  canEdit,
  starterPlayers,
}: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {tacticalModule.layout.map((role) => (
        <RoleRow
          key={role.roleId}
          role={role}
          players={starterPlayers}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}
