import {
  Split,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import TeamsCarousel from "../../teams/components/TeamsCarousel";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  lastEndedMatchday?: SplitMatchday;
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWrapper({
  leagueId,
  leagueTeams,
  lastEndedMatchday,
  lastSplit,
  userId,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="basis-2/3">dwdw</div>
      <div className="basis-1/3">
        <TeamsCarousel teams={leagueTeams} />
      </div>
    </div>
  );
}
