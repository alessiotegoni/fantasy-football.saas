import { TacticalModule } from "@/drizzle/schema";
import { getStarterLineups } from "../queries/match";


type Props = {
  tacticalModule: TacticalModule
  canEdit: boolean;
};

export default async function StarterLineupField({
  tacticalModule,
  canEdit,
}: Props) {

    const starterPlayers = await getStarterLineups()

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
