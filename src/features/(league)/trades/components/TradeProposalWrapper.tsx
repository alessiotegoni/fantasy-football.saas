import { PlayersProvider } from "@/contexts/PlayersProvider";
import { getTeamsPlayers } from "../../teamsPlayers/queries/teamsPlayer";
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

  const teamsIds = [proposerTeamId, receiverTeamId];

  const teamsPlayers = teamsIds.every((teamId) => typeof teamId === "string")
    ? await getTeamsPlayers(teamsIds)
    : [];

  return (
    <TradePlayersProvider
      proposerTeamId={proposerTeamId}
      receiverTeamId={receiverTeamId}
      teamsPlayers={teamsPlayers}
    >
      <TradeProposalForm {...props} />
    </TradePlayersProvider>
  );
}
