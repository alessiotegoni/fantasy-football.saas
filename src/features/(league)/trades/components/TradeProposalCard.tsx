import { UseFieldArrayRemove } from "react-hook-form";
import LeagueTeamCard from "../../teams/components/LeagueTeamCard";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import { TradePlayersList } from "./TradePlayersList";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";

type Props = {
  leagueId: string;
  team: LeagueTeam;
  isProposer?: boolean;
  players?: (TeamPlayer & { index: number })[]
  removePlayer: UseFieldArrayRemove;
  renderCreditsSlider: () => React.ReactNode;
  renderDialog: () => React.ReactNode;
};

export default function TradeProposalCard({
  isProposer = true,
  leagueId,
  team,
  players,
  removePlayer,
  renderCreditsSlider,
  renderDialog,
}: Props) {
  return (
    <div className="bg-sidebar p-4 rounded-3xl">
      <div className="mb-8">
        <LeagueTeamCard
          leagueId={leagueId}
          team={team}
          className="hover:border-border"
          showIsUserTeam={isProposer}
          showTeamCredits={false}
        />
      </div>

      {renderCreditsSlider()}

      {!!players?.length && (
        <div className="mt-8">
          <h3 className="font-medium mb-3">
            {isProposer ? "Calciatori offerti" : "Calciatori richiesti"}
          </h3>
          <TradePlayersList
            tradePlayers={players}
            onRemovePlayer={removePlayer}
          />
        </div>
      )}
      {renderDialog()}
    </div>
  );
}
