import { UseFieldArrayRemove } from "react-hook-form";
import LeagueTeamCard from "../../teams/components/LeagueTeamCard";
import { getLeagueTeams } from "../../teams/queries/leagueTeam";
import { Button } from "@/components/ui/button";
import { TradePlayersCarousel } from "./TradePlayersCarousel";

type Props = {
  leagueId: string;
  team: Awaited<ReturnType<typeof getLeagueTeams>>[number];
  players?: {
    id: number;
    index: number;
    offeredByProposer: boolean;
  }[];
  removePlayer: UseFieldArrayRemove;
  renderCreditsSlider: () => React.ReactNode;
  renderActionButton?: () => React.ReactNode;
};

export default function TradeProposalCard({
  leagueId,
  team,
  players,
  removePlayer,
  renderCreditsSlider,
}: Props) {
  return (
    <div className="bg-sidebar p-4 rounded-3xl space-y-8">
      <div>
        <LeagueTeamCard
          leagueId={leagueId}
          team={team}
          className="rounded-2xl hover:border-border"
        />
      </div>

      {renderCreditsSlider()}

      <div className="flex justify-between items-center">
        {!!players?.length && (
          <>
            <h3 className="font-medium mb-3">Calciatori offerti</h3>
            <TradePlayersCarousel
              players={players}
              onRemovePlayer={removePlayer}
            />
          </>
        )}
        <Button>Offri calciatori</Button>
        {/* <MultiSelect
                    options={getPlayerOptions(currentUserTeam.players)}
                    selected={getOfferedPlayerIds()}
                    onChange={(selected) =>
                      handlePlayerSelection(selected, true)
                    }
                    placeholder="Seleziona calciatori"
                  /> */}
      </div>
    </div>
  );
}
