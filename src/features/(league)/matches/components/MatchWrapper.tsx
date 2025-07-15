import { SplitMatchday } from "@/features/splits/queries/split";
import { getBenchLineups, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import MyLineupProvider from "@/contexts/MyLineupProvider";
import { Suspense } from "react";
import CalendarMatchCard from "../../(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "./FootballFieldBg";
import StarterLineupsWrapper from "./StarterLineupsWrapper";
import BenchLineup from "./BenchLineup";
import { LineupTeam } from "../utils/match";

type Props = {
  matchInfo: MatchInfo;
  leagueId: string;
  matchId: string;
  myTeam?: LineupTeam;
  currentMatchday?: SplitMatchday;
  canEditLineup?: boolean;
  showLineups?: boolean;
};

export default function MatchWrapper({
  matchInfo,
  myTeam,
  currentMatchday,
  canEditLineup,
  showLineups = false,
  ...ids
}: Props) {
  const benchLineupsPromise =
    showLineups && currentMatchday
      ? getBenchLineups(ids.matchId, currentMatchday.id)
      : undefined;

  return (
    <MyLineupProvider>
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
          <div>
            <CalendarMatchCard
              className="!rounded-4xl"
              homeModule={
                matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null
              }
              awayModule={
                matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null
              }
              isLink={false}
              {...ids}
              {...matchInfo}
            />
          </div>
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
                  (matchInfo.homeTeam?.id === myTeam?.id && canEditLineup) ??
                  false
                }
                className="2xl:border-r"
              />
            </Suspense>
          )}
          <FootballFieldBg>
            {showLineups && currentMatchday && (
              <Suspense>
                <StarterLineupsWrapper
                  {...ids}
                  {...matchInfo}
                  myTeam={myTeam}
                  canEditLineup={canEditLineup ?? false}
                  currentMatchday={currentMatchday}
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
                  (matchInfo.awayTeam?.id === myTeam?.id && canEditLineup) ??
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
