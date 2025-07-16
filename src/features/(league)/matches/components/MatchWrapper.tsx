import { SplitMatchday } from "@/features/splits/queries/split";
import { getBenchLineups, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import MyLineupProvider from "@/contexts/MyLineupProvider";
import { Suspense } from "react";
import CalendarMatchCard from "../../(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "./FootballFieldBg";
import StarterLineups from "./StarterLineups";
import BenchLineup from "./BenchLineup";
import { LineupTeam } from "../utils/match";

type Props = {
  matchInfo: MatchInfo;
  leagueId: string;
  matchId: string;
  myTeam?: LineupTeam;
  currentMatchday?: SplitMatchday;
  showLineups?: boolean;
};

export default function MatchWrapper({
  matchInfo,
  myTeam,
  currentMatchday,
  showLineups = false,
  ...ids
}: Props) {
  const benchLineupsPromise = showLineups
    ? getBenchLineups(ids.matchId, matchInfo.splitMatchday.id)
    : undefined;

  const isMatchdayClosed =
    matchInfo.splitMatchday.id !== currentMatchday?.id ||
    currentMatchday?.status !== "upcoming";

  return (
    <MyLineupProvider defaultTacticalModule={myTeam?.lineup?.tacticalModule}>
      <Container
        {...ids}
        headerLabel="Partita"
        showHeader={false}
        className="xl:max-w-[800px] 2xl:max-w-[1100px]"
      >
        <div className="2xl:grid gap-5 xl:grid-cols-[150px_1fr_150px]">
          <div>
            {/*Se canEidtLineup=true metter ModulesSelect insieme al possibilie switch (feature futura), mentre se e' false metter statistiche da scegliere piu avanti*/}
          </div>
          <CalendarMatchCard
            className="!rounded-4xl"
            homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
            awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
            isLink={false}
            {...ids}
            {...matchInfo}
          />
          <div>
            {/*Se canEidtLineup=true metter ModulesSelect insieme al possibilie switch (feature futura), mentre se e' false metter statistiche da scegliere piu avanti*/}
          </div>
        </div>
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
      </Container>
    </MyLineupProvider>
  );
}
