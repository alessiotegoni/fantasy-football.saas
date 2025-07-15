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
        className="xl:max-w-[900px]"
        renderHeaderRight={() => canEditLineup && null /* ModuleSelect */}
      >
        <div className="grid xl:grid-cols-[150px_1fr_150px]">
          {showLineups && <Suspense>{/* Home bech lineup */}</Suspense>}
          <div></div>
          <CalendarMatchCard
            className="!rounded-4xl sm:-mt-4"
            homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
            awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
            isLink={false}
            {...ids}
            {...matchInfo}
          />
          <div></div>
          {showLineups && <Suspense>{/* Away bech lineup */}</Suspense>}
        </div>
        <FootballFieldBg>
          {showLineups && (
            <Suspense>
              <StarterLineupsWrapper {...ids} {...matchInfo} />
            </Suspense>
          )}
        </FootballFieldBg>
      </Container>
    </MyLineupProvider>
  );
}
