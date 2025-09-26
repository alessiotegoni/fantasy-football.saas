import {
  Split,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import TeamsCarousel from "../../teams/components/TeamsCarousel";
import { StandingData } from "../../standing/queries/standing";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import StandingTable from "../../standing/components/StandingTable";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  standingData: StandingData[];
  calendar?: Match[];
  lastEndedMatchday?: SplitMatchday;
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWrapper({
  lastSplit,
  standingData,
  ...restProps
}: Props) {
  //   console.dir(props.calendar);

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="basis-2/3">
        <div className="bg-input/30 e-full h-70 rounded-3xl"></div>
      </div>
      <div className="basis-1/3">
        <TeamsCarousel {...restProps} />
        <StandingTable
          data={standingData}
          isExtended={false}
          isSplitEnded={lastSplit?.status === "ended"}
          finalPhaseAccess={{}}
          isDefaultStanding={false}
          className="mt-4"
        />
      </div>
    </div>
  );
}
