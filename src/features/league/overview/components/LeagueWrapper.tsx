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
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="basis-2/3">
      <div className="bg-input/30 size-full rounded-3xl"></div>
      </div>
      <div className="basis-1/3">
        <TeamsCarousel teams={leagueTeams} userId={userId} />
      </div>
    </div>
  );
}
