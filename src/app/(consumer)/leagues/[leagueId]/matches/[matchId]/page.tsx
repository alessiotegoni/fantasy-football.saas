import Container from "@/components/Container";
import MyLineupProvider from "@/contexts/MyLineupProvider";
import CalendarMatchCard from "@/features/(league)/(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "@/features/(league)/matches/components/FootballFieldBg";
import MatchWrapper from "@/features/(league)/matches/components/MatchWrapper";
import StarterLineupsWrapper from "@/features/(league)/matches/components/StarterLineupsWrapper";
import {
  formatTeamData,
  getBenchLineups,
  getMatchInfo,
  MatchInfo,
} from "@/features/(league)/matches/queries/match";
import {
  getCurrentMatchday,
  SplitMatchday,
} from "@/features/splits/queries/split";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { validateUUIds } from "@/schema/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ leagueId: string; matchId: string }>;
}) {
  const { success, ...ids } = validateUUIds(await params);
  if (!success) notFound();

  const matchInfo = await getMatchInfo(ids);
  if (!matchInfo) notFound();

  console.log(matchInfo);

  return (
    <Suspense fallback={<MatchWrapper matchInfo={matchInfo} {...ids} />}>
      <SuspenseBoundary matchInfo={matchInfo} {...ids} />
    </Suspense>
  );
}

async function SuspenseBoundary({
  matchInfo,
  ...ids
}: {
  matchId: string;
  leagueId: string;
  matchInfo: MatchInfo;
}) {
  const userId = await getUserId();
  if (!userId) return;

  const [userTeamId, currentMatchday] = await Promise.all([
    getUserTeamId(userId, ids.leagueId),
    getCurrentMatchday(matchInfo.splitMatchday.splitId),
  ]);
  const myTeam = [matchInfo.homeTeam, matchInfo.awayTeam].find(
    (team) => team?.id === userTeamId
  );

  const canEditLineup =
    !!myTeam &&
    !matchInfo.isBye &&
    matchInfo.splitMatchday.id === currentMatchday?.id &&
    currentMatchday?.status === "upcoming";

  return (
    <MatchWrapper
      matchInfo={matchInfo}
      {...ids}
      myTeam={myTeam}
      currentMatchday={currentMatchday}
      canEditLineup={canEditLineup}
      showLineups
    />
  );
}
