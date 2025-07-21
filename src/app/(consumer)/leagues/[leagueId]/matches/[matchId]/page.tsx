import MatchWrapper from "@/features/(league)/matches/components/MatchWrapper";
import {
  getLineupsPlayers,
  getMatchInfo,
  MatchInfo,
} from "@/features/(league)/matches/queries/match";
import { getCurrentMatchday } from "@/features/splits/queries/split";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { validateUUIds } from "@/schema/helpers";
import { notFound } from "next/navigation";
import { getLineupsPlayers } from "@/features/(league)/matches/queries/match";
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

  const [userTeamId, currentMatchday, lineups] = await Promise.all([
    getUserTeamId(userId, ids.leagueId),
    getCurrentMatchday(matchInfo.splitMatchday.splitId),
    getLineupsPlayers(ids.matchId, matchInfo.splitMatchday.id),
  ]);
  const myTeam = [matchInfo.homeTeam, matchInfo.awayTeam].find(
    (team) => team?.id === userTeamId
  );
  const myTeamLineup = myTeam ? lineups.filter(lineup => lineup.)

  return (
    <MatchWrapper
      matchInfo={matchInfo}
      myTeam={myTeam}
      currentMatchday={currentMatchday}
      lineups={lineups}
      showLineups
      {...ids}
    />
  );
}
