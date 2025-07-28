import { SplitMatchday } from "@/features/splits/queries/split";
import { LineupPlayer, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import { Suspense } from "react";
import MatchCard from "./MatchCard";
import FootballFieldBg from "./FootballFieldBg";
import StarterLineups from "./StarterLineups";
import BenchLineup from "./BenchLineup";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import ModulesSelect from "./ModulesSelect";
import { getTacticalModules } from "../../options/queries/leagueOptions";
import { getLeagueModules } from "../../leagues/queries/league";
import Disclaimer from "@/components/Disclaimer";
import { getTeamsPlayers } from "../../teamsPlayers/queries/teamsPlayer";
import { getPresident, LineupTeam } from "../utils/match";
import SaveLineupButton from "./SaveLineupButton";
import PresidentSlot from "./PresidentSlot";
import PlayersDialog from "./PlayersDialog";
import { groupLineupsPlayers } from "../utils/LineupPlayers";
import LineupMatchCard from "./LineupMatchCard";

type Props = {
  matchInfo: MatchInfo;
  leagueId: string;
  matchId: string;
  myTeamId?: string | null;
  lineupsPlayers?: LineupPlayer[];
  currentMatchday?: SplitMatchday;
  showLineups?: boolean;
};

export default function MatchWrapper({
  matchInfo,
  myTeamId,
  currentMatchday,
  lineupsPlayers = [],
  showLineups,
  ...ids
}: Props) {
  const isMatchdayClosed =
    matchInfo.splitMatchday.id !== currentMatchday?.id ||
    currentMatchday?.status !== "upcoming";

  const groupedPlayers = groupLineupsPlayers(lineupsPlayers);

  function getCanEditLineup(team: LineupTeam) {
    if (!myTeamId) return false;
    return !isMatchdayClosed && team.id === myTeamId;
  }

  function getBenchPlayers(teamId: string | null) {
    const players = groupedPlayers["bench"] ?? [];
    return players.filter((player) => player.leagueTeamId === teamId);
  }

  return (
    <Container
      {...ids}
      headerLabel="Partita"
      showHeader={false}
      className="xl:max-w-[800px] 2xl:max-w-[1200px]"
    >
      <div className="2xl:grid gap-5 xl:grid-cols-[180px_1fr_180px]">
        {showLineups && (
          <div className="flex flex-col justify-between gap-5">
            <PresidentSlot
              starterPresident={getPresident(
                groupedPlayers["starter"] ?? [],
                matchInfo.homeTeam.id
              )}
              canEditLineup={getCanEditLineup(matchInfo.homeTeam)}
            />
            <BenchLineup
              players={getBenchPlayers(matchInfo.homeTeam.id)}
              canEditLineup={getCanEditLineup(matchInfo.homeTeam)}
              className="2xl:border-r"
            />
          </div>
        )}
        <div>
          <LineupMatchCard
            players={lineupsPlayers}
            currentMatchday={currentMatchday}
            {...matchInfo}
            {...ids}
          />
          <FootballFieldBg>
            {!isMatchdayClosed && myTeamId && (
              <MobileButtonsContainer className="sm:size-0">
                <ModulesSelect
                  allowedModulesPromise={getLeagueModules(ids.leagueId)}
                  tacticalModulesPromise={getTacticalModules()}
                />
                <SaveLineupButton {...ids} />
              </MobileButtonsContainer>
            )}
            {showLineups && (
              <Suspense>
                <StarterLineups
                  players={groupedPlayers["starter"] ?? []}
                  match={matchInfo}
                  currentMatchday={currentMatchday}
                  isMatchdayClosed={isMatchdayClosed}
                />
              </Suspense>
            )}
          </FootballFieldBg>
        </div>
        {showLineups && (
          <div className="flex flex-col justify-between gap-5">
            <PresidentSlot
              starterPresident={getPresident(
                groupedPlayers["starter"] ?? [],
                matchInfo.awayTeam.id
              )}
              canEditLineup={getCanEditLineup(matchInfo.awayTeam)}
            />
            <BenchLineup
              players={getBenchPlayers(matchInfo.awayTeam.id)}
              canEditLineup={getCanEditLineup(matchInfo.awayTeam)}
              className="2xl:border-l"
            />
          </div>
        )}
      </div>
      {showLineups && myTeamId && (
        <Suspense>
          <PlayersDialog playersPromise={getTeamsPlayers([myTeamId])} />
        </Suspense>
      )}
      <Disclaimer />
    </Container>
  );
}
