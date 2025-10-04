"use client";

import { Split } from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import { groupMatches } from "@/features/league/overview/utils/match";
import UserMatches from "./UserMatches";
import { useIsMobile } from "@/hooks/useMobile";

type Props = {
  leagueId: string;
  userTeam?: LeagueTeam;
  calendar?: Match[];
  matches?: ReturnType<typeof groupMatches>;
  lastSplit?: Split;
};

export default function LeagueWidget(props: Props) {
  const isMobile = useIsMobile();
  const content = isMobile ? <div /> : <UserMatches {...props} />;

  return (
    <div className="league-widget">
      <div className="size-full backdrop-blur-2xl flex justify-center items-center">
        {content}
      </div>
    </div>
  );
}
