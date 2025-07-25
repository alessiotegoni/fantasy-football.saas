import MyLineupProvider from "@/contexts/MyLineupProvider";
import MatchWrapper from "@/features/(league)/matches/components/MatchWrapper";
import {
  getLineupsPlayers,
  getMatchInfo,
  MatchInfo,
} from "@/features/(league)/matches/queries/match";
import { getMyTeam } from "@/features/(league)/matches/utils/match";
import { getCurrentMatchday } from "@/features/splits/queries/split";
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

  const [myTeamId, currentMatchday, lineupsPlayers] = await Promise.all([
    getUserTeamId(userId, ids.leagueId),
    getCurrentMatchday(matchInfo.splitMatchday.splitId),
    getLineupsPlayers(ids.matchId, matchInfo.splitMatchday.id),
  ]);

  const myTeam = getMyTeam(myTeamId, matchInfo, lineupsPlayers);


  return (
    <MyLineupProvider myTeam={myTeam}>
      <MatchWrapper
        matchInfo={matchInfo}
        currentMatchday={currentMatchday}
        lineupsPlayers={lineupsPlayers}
        myTeamId={myTeam?.id ?? null}
        showLineups
        {...ids}
      />
    </MyLineupProvider>
  );
}
