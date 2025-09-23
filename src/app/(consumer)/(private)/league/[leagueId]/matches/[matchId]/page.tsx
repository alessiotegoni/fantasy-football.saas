import MyLineupProvider from "@/contexts/MyLineupProvider";
import MatchWrapper from "@/features/league/matches/components/MatchWrapper";
import {
  getLineupsPlayers,
  getMatchInfo,
  MatchInfo,
} from "@/features/league/matches/queries/match";
import { getMyTeam } from "@/features/league/matches/utils/match";
import { enrichLineupPlayers } from "@/features/league/matches/utils/LineupPlayers";
import { getPlayersMatchdayBonusMaluses } from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalus";
import { getUserTeamId } from "@/features/dashboard/user/queries/user";
import { getUserId } from "@/features/dashboard/user/utils/user";
import { validateUUIds } from "@/schema/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import MyLineupDndProvider from "@/contexts/MyLineupDndProvider";
import { getCurrentMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { getBonusMalusesSettings } from "@/features/league/settings/queries/setting";
import { CustomBonusMalus } from "@/drizzle/schema";

// React instrumentation encountered an error: RangeError: Maximum call stack size exceeded
//     at unmountInstanceRecursively (renderer.js:2757:12)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)
//     at unmountInstanceRecursively (renderer.js:2773:7)
//     at unmountRemainingChildren (renderer.js:2427:7)

export default async function MatchPage({
  params,
}: PageProps<"/league/[leagueId]/matches/[matchId]">) {
  const { success, ...ids } = validateUUIds(await params);
  if (!success) notFound();

  const [matchInfo, { bonusMalusSettings }] = await Promise.all([
    getMatchInfo(ids),
    getBonusMalusesSettings(ids.leagueId),
  ]);
  if (!matchInfo) notFound();

  return (
    <Suspense fallback={<MatchWrapper matchInfo={matchInfo} {...ids} />}>
      <SuspenseBoundary
        matchInfo={matchInfo}
        leagueBonusMalus={bonusMalusSettings}
        {...ids}
      />
    </Suspense>
  );
}

async function SuspenseBoundary({
  matchInfo,
  leagueBonusMalus,
  ...ids
}: {
  matchId: string;
  leagueId: string;
  matchInfo: MatchInfo;
  leagueBonusMalus: CustomBonusMalus;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const [myTeamId, currentMatchday, lineupsPlayers] = await Promise.all([
    getUserTeamId(userId, ids.leagueId),
    getCurrentMatchday(matchInfo.splitMatchday.splitId),
    getLineupsPlayers([ids.matchId], matchInfo.splitMatchday.id),
  ]);

  const playersBonusMaluses = await getPlayersMatchdayBonusMaluses({
    matchdayId: matchInfo.splitMatchday.id,
    playersIds: lineupsPlayers.map((player) => player.id),
  });

  const enrichedLineupPlayers = enrichLineupPlayers({
    lineupsPlayers,
    playersBonusMaluses,
    leagueBonusMalus,
    ...matchInfo,
  });

  const myTeam = getMyTeam(myTeamId, matchInfo, enrichedLineupPlayers);

  return (
    <MyLineupProvider myTeam={myTeam} leagueBonusMalus={leagueBonusMalus}>
      <MyLineupDndProvider>
        <MatchWrapper
          matchInfo={matchInfo}
          currentMatchday={currentMatchday}
          lineupsPlayers={enrichedLineupPlayers}
          myTeamId={myTeam?.id ?? null}
          showLineups
          {...ids}
        />
      </MyLineupDndProvider>
    </MyLineupProvider>
  );
}
