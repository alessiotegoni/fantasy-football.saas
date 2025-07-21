import { SplitMatchday } from "@/features/splits/queries/split";
import { LineupPlayer, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import MyLineupProvider from "@/contexts/MyLineupProvider";
import { Suspense } from "react";
import CalendarMatchCard from "../../(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "./FootballFieldBg";
import StarterLineups from "./StarterLineups";
import BenchLineup from "./BenchLineup";
import { LineupTeam } from "../utils/match";
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
  myTeam?: LineupTeam;
  starters?: LineupPlayer[];
  bench?: LineupPlayer[];
  currentMatchday?: SplitMatchday;
  showLineups?: boolean;
};

export default function MatchWrapper({
  matchInfo,
  matchId,
  myTeam,
  currentMatchday,
  starters,
  bench,
  ...ids
}: Props) {
  

  const isMatchdayClosed =
    matchInfo.splitMatchday.id !== currentMatchday?.id ||
    currentMatchday?.status !== "upcoming";

  return (
    <MyLineupProvider myTeam={myTeam}>
      <Container
        {...ids}
        headerLabel="Partita"
        showHeader={false}
        className="xl:max-w-[800px] 2xl:max-w-[1100px]"
      >
        <div className="2xl:grid gap-5 xl:grid-cols-[150px_1fr_150px]">
          <div>{/*Presidente home*/}</div>
          <CalendarMatchCard
            className="!rounded-4xl"
            homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
            awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
            isLink={false}
            {...ids}
            {...matchInfo}
          />
          <div>{/*Presidente away*/}</div>
        </div>
        {showLineups && myTeam?.id && (
          <Suspense>
            <PlayersSelect
              matchId={matchId}
              myTeam={myTeam}
              playersPromise={getTeamsPlayers([myTeam.id]).then((players) =>
                players.map(
                  ({ purchaseCost, leagueTeamId, ...player }) => player
                )
              )}
            />
          </Suspense>
        )}
        <div className="grid grid-cols-2 gap-5 2xl:grid-cols-[150px_1fr_150px] mt-5">
          {showLineups && benchLineupsPromise && (
            <Suspense>
              <BenchLineup
                benchLineupsPromise={benchLineupsPromise}
                team={matchInfo.homeTeam}
                canEditLineup={
                  //   (matchInfo.homeTeam?.id === myTeam?.id && canEditLineup) ??
                  false
                }
                className="2xl:border-r"
              />
            </Suspense>
          )}
          <FootballFieldBg>
            {!isMatchdayClosed && myTeam && (
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
                  match={matchInfo}
                  myTeam={myTeam}
                  currentMatchday={currentMatchday}
                  isMatchdayClosed={isMatchdayClosed}
                />
              </Suspense>
            )}
          </FootballFieldBg>
          {showLineups && benchLineupsPromise && (
            <Suspense>
              <BenchLineup
                benchLineupsPromise={benchLineupsPromise}
                team={matchInfo.awayTeam}
                canEditLineup={
                  //   (matchInfo.awayTeam?.id === myTeam?.id && canEditLineup) ??
                  false
                }
                className="2xl:border-l"
              />
            </Suspense>
          )}
        </div>
        <Disclaimer />
      </Container>
    </MyLineupProvider>
  );
}
