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

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  standingData: StandingData[];
  isDefaultStanding?: boolean;
  calendar?: Match[];
  splitMatchdays?: SplitMatchday[];
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWrapper({
  lastSplit,
  calendar,
  standingData,
  isDefaultStanding = true,
  ...restProps
}: Props) {
  const endedMatches = calendar?.filter(
    (c) => c.splitMatchday.status === "ended"
  );
  const upcomingMatches = calendar?.filter(
    (c) => c.splitMatchday.status === "upcoming"
  );

  const finalPhaseAccess = getFinalPhaseAccess(standingData);

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="basis-2/3">
        <div className="bg-input/30 e-full h-70 rounded-3xl"></div>
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
