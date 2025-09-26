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
import LeagueMatches from "./LeagueMatches";
import EmptyState from "@/components/EmptyState";
import { CalendarXmark } from "iconoir-react";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  standingData: StandingData[];
  isDefaultStanding?: boolean;
  calendar?: Match[];
  firstUpcomingMatchday?: SplitMatchday;
  liveMatchday?: SplitMatchday;
  lastEndedMatchday?: SplitMatchday;
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWrapper({
  lastSplit,
  firstUpcomingMatchday,
  liveMatchday,
  lastEndedMatchday,
  calendar,
  standingData,
  isDefaultStanding = true,
  ...restProps
}: Props) {
  const finalPhaseAccess = getFinalPhaseAccess(standingData);

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="basis-10/12">
        <div className="bg-input/30 w-full h-80 rounded-3xl"></div>
        <div className="mt-4">
          {calendar ? (
            calendar.length > 0 ? (
              <LeagueMatches
                calendar={calendar}
                liveMatchday={liveMatchday}
                firstUpcomingMatchday={firstUpcomingMatchday}
                lastEndedMatchday={lastEndedMatchday}
              />
            ) : (
              <EmptyState
                icon={CalendarXmark}
                title="Calendario non disponibile"
                description="Il calendario per questa lega non è stato ancora generato, contatta un admin della lega per generarlo"
              />
            )
          ) : // TODO: Skeleton for MatchCard will go here
          null}
        </div>
      </div>
      <div className="basis-1/12 max-w-70 xl:max-w-80 2xl:max-w-90">
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
