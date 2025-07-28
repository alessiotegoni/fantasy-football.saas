import { SplitMatchday } from "@/features/splits/queries/split";
import { LineupPlayer, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import { Suspense } from "react";
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
import BenchSkeleton from "./skeletons/BenchSkeleton";

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
      <div className="grid grid-cols-2 gap-5 2xl:grid-cols-[180px_1fr_180px]">
        <div className="mt-5 2xl:mt-0 row-start-2 2xl:row-start-auto flex flex-col justify-between gap-5">
          {showLineups ? (
            <>
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
            </>
          ) : (
            <BenchSkeleton className="2xl:border-r" />
          )}
        </div>
        <div className="col-span-2 2xl:col-auto">
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
        <div className="mt-5 2xl:mt-0 row-start-2 2xl:row-start-auto flex flex-col justify-between gap-5">
          {showLineups ? (
            <>
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
            </>
          ) : (
            <BenchSkeleton className="2xl:border-l" />
          )}
        </div>
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
