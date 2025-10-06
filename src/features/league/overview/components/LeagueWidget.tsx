"use client";

import { Split } from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import { groupMatches } from "@/features/league/overview/utils/match";
import UserMatches from "./UserMatches";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import UserStats from "./UserStats";

type Props = {
  leagueId: string;
  userTeam?: LeagueTeam;
  calendar?: Match[];
  matches?: ReturnType<typeof groupMatches>;
  lastSplit?: Split;
};

export default function LeagueWidget(props: Props) {
  const isMobile = useMediaQuery(768);
  const Comp = isMobile ? UserStats : UserMatches;

  return (
    <div className="league-widget">
      <div className="size-full backdrop-blur-2xl flex justify-center items-center">
        <Comp {...props} />
      </div>
    </div>
  );
}
