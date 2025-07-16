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

// TODO: mostralo solo se isMatchClosed e' false
// TODO: al trigger di onModuleChange setta nel context di MyLineupProvider il modulo
// TODO:  Crea un'altro client componente col drower su mobile e dialog su desktop che includa LeagueModules aggiungedogli LeagueModules passandogli come prop handleSetModule dall'hook (da creare)

// TODO: creare client componente col drower su mobile e dialog su desktop  che fetchi i giocatori di myTeam solo al click, e che mostri solo i giocatori che non ci sono a seconda del contesto (bench, starter)
