import { SplitMatchday } from "@/features/splits/queries/split";
import { LineupPlayer, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import { Suspense } from "react";
import CalendarMatchCard from "../../(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "./FootballFieldBg";
import StarterLineups from "./StarterLineups";
import BenchLineup from "./BenchLineup";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import ModulesSelect from "./ModulesSelect";
import { getTacticalModules } from "../../options/queries/leagueOptions";
import { getLeagueModules } from "../../leagues/queries/league";
import Disclaimer from "@/components/Disclaimer";
import PlayersSelect from "./PlayersSelect";
import { getTeamsPlayers } from "../../teamsPlayers/queries/teamsPlayer";

type Props = {
  matchInfo: MatchInfo;
  leagueId: string;
  matchId: string;
  myTeamId?: string;
  lineupsPlayers?: LineupPlayer[];
  currentMatchday?: SplitMatchday;
  showLineups?: boolean;
};

export default function MatchWrapper({
  matchInfo,
  matchId,
  myTeamId,
  currentMatchday,
  lineupsPlayers = [],
  showLineups,
  ...ids
}: Props) {
  const isMatchdayClosed =
    matchInfo.splitMatchday.id !== currentMatchday?.id ||
    currentMatchday?.status !== "upcoming";

  const groupedPlayers = Object.groupBy(
    lineupsPlayers,
    (player) => player.lineupPlayerType
  );

  return (
    <Container
      {...ids}
      headerLabel="Partita"
      showHeader={false}
      className="xl:max-w-[800px] 2xl:max-w-[1100px]"
    >
      <div className="2xl:grid gap-5 xl:grid-cols-[150px_1fr_150px]">
        {showLineups && (
          <div>
            <div>{/*Presidente home*/}</div>
            <BenchLineup
              players={groupedPlayers["bench"] ?? []}
              team={matchInfo.homeTeam}
              canEditLineup={
                !isMatchdayClosed && matchInfo.homeTeam.id === myTeamId
              }
              className="2xl:border-r"
            />
          </div>
        )}
        <div>
          <CalendarMatchCard
            className="!rounded-4xl"
            homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
            awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
            isLink={false}
            {...ids}
            {...matchInfo}
          />
          <FootballFieldBg>
            {!isMatchdayClosed && myTeamId && (
              <MobileButtonsContainer className="sm:absolute sm:-translate-1/2 sm:bottom-auto sm:top-5">
                <ModulesSelect
                  allowedModulesPromise={getLeagueModules(ids.leagueId)}
                  tacticalModulesPromise={getTacticalModules()}
                />
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
        <div>
          <div>{/*Presidente away*/}</div>
          {showLineups && (
            <Suspense>
              <BenchLineup
                players={groupedPlayers["bench"] ?? []}
                team={matchInfo.awayTeam}
                canEditLineup={
                  !isMatchdayClosed && matchInfo.awayTeam.id === myTeamId
                }
                className="2xl:border-l"
              />
            </Suspense>
          )}
        </div>
      </div>
      {showLineups && myTeamId && (
        <Suspense>
          <PlayersSelect
            matchId={matchId}
            playersPromise={getTeamsPlayers([myTeamId]).then((players) =>
              players.map(({ purchaseCost, leagueTeamId, ...player }) => player)
            )}
          />
        </Suspense>
      )}
      <Disclaimer />
    </Container>
  );
}
