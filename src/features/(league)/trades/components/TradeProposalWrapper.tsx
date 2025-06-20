import { PlayersProvider } from "@/contexts/PlayersProvider";
import {
  getPlayersRoles,
  getTeamPlayers,
} from "../../teamsPlayers/queries/teamsPlayer";
import { getTeams } from "@/features/teams/queries/team";
import { PlayersEnrichmentProvider } from "@/contexts/PlayersEnrichmentProvider";
import TradeProposalForm from "./TradeProposalForm";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import TradePlayersProvider from "@/contexts/TradePlayersProvider";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  proposerTeam: LeagueTeam | undefined;
  receiverTeam: LeagueTeam | undefined;
};

export default async function TradeProposalWrapper(props: Props) {
  const proposerTeamId = props.proposerTeam?.id;
  const receiverTeamId = props.receiverTeam?.id;

  const teamsIds = [proposerTeamId ?? "", receiverTeamId ?? ""];

  const [leagueTeamsPlayers, teams, roles] = await Promise.all(
    teamsIds.every(Boolean)
      ? [getTeamPlayers(teamsIds), getTeams(), getPlayersRoles()]
      : []
  );

  return (
    <PlayersProvider players={leagueTeamsPlayers ?? []}>
      <PlayersEnrichmentProvider defaultTeams={teams} defaultRoles={roles}>
        <TradePlayersProvider
          proposerTeamId={proposerTeamId}
          receiverTeamId={receiverTeamId}
        >
          <TradeProposalForm {...props} />
        </TradePlayersProvider>
      </PlayersEnrichmentProvider>
    </PlayersProvider>
  );
}
