import { Suspense } from "react";
import {
  SplitMatchday,
  Split,
} from "@/features/dashboard/admin/splits/queries/split";
import { LeagueTeam } from "@/features/league/teams/queries/leagueTeam";
import InviteMembersBanner from "@/features/league/members/components/InviteMembersBanner";
import GenerateCalendarBanner from "@/features/league/admin/calendar/regular/components/GenerateCalendarBanner";
import { hasGeneratedCalendar } from "@/features/league/admin/calendar/regular/permissions/calendar";
import { isMatchdayCalculable } from "@/features/league/admin/calculate-matchday/utils/calculate-matchday";
import { isAlreadyCalculated } from "@/features/league/admin/calculate-matchday/permissions/calculate-matchday";
import { getCalculation } from "@/features/league/admin/calculate-matchday/queries/calculate-matchday";
import CalculateMatchdayBanner from "../../admin/calculate-matchday/components/CalculateMatchdayBanner";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";
import CreateTeamBanner from "../../teams/components/CreateTeamBanner";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  splitMatchdays?: SplitMatchday[];
  lastSplit?: Split;
  userId: string;
};

export default async function LeagueBanners({
  leagueId,
  leagueTeams,
  splitMatchdays,
  lastSplit,
  userId,
}: Props) {
  const isAdmin = await isLeagueAdmin(userId, leagueId);

  const lastEndedMatchday = splitMatchdays?.findLast(
    (matchday) => matchday.status === "ended"
  );

  const showCreateTeamBanner = !leagueTeams.some(
    (team) => team.userId === userId
  );

  const showInviteMembersBanner = leagueTeams.length < 4;

  const showCalculateMatchdayBanner =
    isAdmin &&
    lastEndedMatchday?.status === "ended" &&
    isMatchdayCalculable(lastEndedMatchday) &&
    !(await isAlreadyCalculated(leagueId, lastEndedMatchday.id));

  const showGenerateCalendarBanner =
    isAdmin &&
    lastSplit?.status === "upcoming" &&
    !(await hasGeneratedCalendar(leagueId, lastSplit.id));

  if (
    !showInviteMembersBanner &&
    !showCalculateMatchdayBanner &&
    !showGenerateCalendarBanner
  ) {
    return null;
  }

  let calculation: { id: string } | undefined;
  if (showCalculateMatchdayBanner && lastEndedMatchday) {
    calculation = await getCalculation(leagueId, lastEndedMatchday.id);
  }

  return (
    <div className="space-y-4">
      {showCreateTeamBanner && <CreateTeamBanner />}
      {showInviteMembersBanner && <InviteMembersBanner />}
      {showCalculateMatchdayBanner && (
        <CalculateMatchdayBanner
          calculation={calculation}
          matchday={lastEndedMatchday}
        />
      )}
      {showGenerateCalendarBanner && <GenerateCalendarBanner />}
    </div>
  );
}
