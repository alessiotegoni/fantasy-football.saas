import {
  Split,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import TeamsCarousel from "../../teams/components/TeamsCarousel";
import { StandingData } from "../../standing/queries/standing";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import StandingTable from "../../standing/components/StandingTable";
import { getFinalPhaseAccess } from "../../admin/calendar/final-phase/utils/calendar";
import MatchdaySection from "../../admin/calendar/regular/components/MatchdaySection";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  standingData: StandingData[];
  isDefaultStanding?: boolean;
  calendar?: Match[];
  firstUpcomingMatchday?: SplitMatchday;
  liveMatchday?: SplitMatchday;
  lastEndedMatchday?: SplitMatchday;
  splitMatchdays?: SplitMatchday[];
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWrapper({
  lastSplit,
  splitMatchdays,
  firstUpcomingMatchday,
  liveMatchday,
  lastEndedMatchday,
  calendar,
  standingData,
  isDefaultStanding = true,
  ...restProps
}: Props) {
  const upcomingMatches = calendar?.filter(
    (c) => c.splitMatchday.id === firstUpcomingMatchday?.id
  );
  const liveMatches = calendar?.filter(
    (c) => c.splitMatchday.id === liveMatchday?.id
  );
  const endedMatches = calendar?.filter(
    (c) => c.splitMatchday.id === lastEndedMatchday?.id
  );

  const finalPhaseAccess = getFinalPhaseAccess(standingData);

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="basis-2/3">
        <div className="bg-input/30 e-full h-80 rounded-3xl"></div>
        <div className="mt-4">
          {liveMatchday && !!liveMatches?.length && (
            <MatchdaySection matchday={liveMatchday} matches={liveMatches} />
          )}
          {!liveMatchday &&
            !endedMatches &&
            firstUpcomingMatchday &&
            !!upcomingMatches?.length && (
              <MatchdaySection
                title={`Prossima giornata (${firstUpcomingMatchday.number}ª)`}
                className="grow"
                matchday={firstUpcomingMatchday}
                matches={upcomingMatches}
              />
            )}
          {!liveMatchday &&
            !firstUpcomingMatchday &&
            lastEndedMatchday &&
            !!endedMatches?.length && (
              <MatchdaySection
                title={`Ultima giornata (${lastEndedMatchday.number}ª)`}
                className="grow"
                matchday={lastEndedMatchday}
                matches={endedMatches}
              />
            )}
          {!liveMatchday &&
            firstUpcomingMatchday &&
            lastEndedMatchday &&
            !!upcomingMatches?.length &&
            !!endedMatches?.length && (
              <div className="flex gap-4">
                <MatchdaySection
                  title={`Ultima giornata (${lastEndedMatchday.number}ª)`}
                  className="grow"
                  matchday={lastEndedMatchday}
                  matches={endedMatches}
                />
                <MatchdaySection
                  title={`Prossima giornata (${firstUpcomingMatchday.number}ª)`}
                  className="grow"
                  matchday={firstUpcomingMatchday}
                  matches={upcomingMatches}
                />
              </div>
            )}
        </div>
      </div>
      <div className="basis-1/3">
        <TeamsCarousel {...restProps} />
        {standingData.length > 0 && (
          <StandingTable
            className="hidden md:block mt-4"
            data={standingData}
            finalPhaseAccess={finalPhaseAccess}
            isExtended={false}
            isSplitEnded={lastSplit?.status === "ended"}
            isDefaultStanding={isDefaultStanding}
          />
        )}
      </div>
    </div>
  );
}
