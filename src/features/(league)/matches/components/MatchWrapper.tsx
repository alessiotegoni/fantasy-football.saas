import { SplitMatchday } from "@/features/splits/queries/split";
import { getBenchLineups, LineupTeam, MatchInfo } from "../queries/match";
import Container from "@/components/Container";
import MyLineupProvider from "@/contexts/MyLineupProvider";
import { Suspense } from "react";
import CalendarMatchCard from "../../(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "./FootballFieldBg";
import StarterLineupsWrapper from "./StarterLineupsWrapper";

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
          {showLineups && (
            <Suspense>
              <div
                className="bg-input/30 rounded-3xl min-h-[500px]
              2xl:border-l border-border"
              >
               
              </div>
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
          {showLineups && (
            <Suspense>
              <div
                className="bg-input/30 rounded-3xl min-h-[500px]
              2xl:border-r border-border"
              >

              </div>
            </Suspense>
          )}
        </div>
      </Container>
    </MyLineupProvider>
  );
}
