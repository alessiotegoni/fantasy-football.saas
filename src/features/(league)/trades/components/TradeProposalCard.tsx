import { UseFieldArrayRemove } from "react-hook-form";
import LeagueTeamCard from "../../teams/components/LeagueTeamCard";
import { getLeagueTeams } from "../../teams/queries/leagueTeam";
import { TradePlayersCarousel } from "./TradePlayersCarousel";

type Props = {
  leagueId: string;
  team: Awaited<ReturnType<typeof getLeagueTeams>>[number];
  isProposer?: boolean;
  players?: {
    index: number;
    id: number;
    displayName: string;
    roleId: number;
    teamId: number;
    avatarUrl: string | null;
    offeredByProposer: boolean;
  }[];
  removePlayer: UseFieldArrayRemove;
  renderCreditsSlider: () => React.ReactNode;
  renderSelectPlayers: () => React.ReactNode;
};

export default function TradeProposalCard({
  isProposer = true,
  leagueId,
  team,
  players,
  removePlayer,
  renderCreditsSlider,
  renderSelectPlayers,
}: Props) {
  return (
    <div className="bg-sidebar p-4 rounded-3xl grow">
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
          <TradePlayersCarousel
            players={players}
            onRemovePlayer={removePlayer}
          />
        </div>
      )}
      {renderSelectPlayers()}
    </div>
  );
}
