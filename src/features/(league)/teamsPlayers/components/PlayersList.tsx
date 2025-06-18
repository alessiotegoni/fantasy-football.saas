import { BasePlayer, PlayersProvider } from "@/contexts/PlayersProvider";
import { PlayersFiltersProvider } from "@/contexts/PlayersFiltersProvider";
import { PlayerSelectionProvider } from "@/contexts/PlayerSelectionProvider";
import { getTeams } from "@/features/teams/queries/team";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { PlayersEnrichmentProvider } from "@/contexts/PlayersEnrichmentProvider";
import PlayersListContent from "./PlayerListContent";
import { Suspense } from "react";
import { default as PlayerSelectionButton } from "./PlayerSelection";
import { getLeagueTeams } from "../../teams/queries/leagueTeam";

type FilterType = "search" | "teams" | "roles";

interface PlayersListProps {
  players: BasePlayer[];
  leagueId: string;
  title?: string;
  enabledFilters?: FilterType[];
  virtualized?: boolean;
  showSelection?: boolean;
  showSelectionButton?: boolean;
  actionsDialog?: React.ReactNode;
  emptyState?: React.ReactNode;
}

export default function PlayersList({
  players,
  leagueId,
  title = "Giocatori",
  enabledFilters = ["search", "teams", "roles"],
  virtualized = false,
  showSelectionButton = true,
  actionsDialog,
  emptyState,
}: PlayersListProps) {
  return (
    <PlayersProvider players={players}>
      <PlayersEnrichmentProvider>
        <PlayersFiltersProvider
          enabledFilters={enabledFilters}
          teamsPromise={getTeams()}
          rolesPromise={getPlayersRoles()}
        >
          <PlayerSelectionProvider
            leagueTeamsPromise={getLeagueTeams(leagueId).then((team) =>
              team.map(({ id, name }) => ({ id, name }))
            )}
          >
            <div>
              <div className="flex items-center mb-3.5">
                <h2 className="text-xl grow">{title}</h2>
                {showSelectionButton && (
                  <Suspense>
                    <PlayerSelectionButton leagueId={leagueId} />
                  </Suspense>
                )}
              </div>

              <PlayersListContent
                virtualized={virtualized}
                actionsDialog={actionsDialog}
                emptyState={emptyState}
              />
            </div>{" "}
          </PlayerSelectionProvider>
        </PlayersFiltersProvider>
      </PlayersEnrichmentProvider>
    </PlayersProvider>
  );
}
