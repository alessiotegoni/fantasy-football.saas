import Container from "@/components/Container";
import CalendarMatchCard from "@/features/(league)/(admin)/calendar/components/CalendarMatchCard";
import { getMatchInfo } from "@/features/(league)/matches/queries/match";
import { getBonusMalusesOptions } from "@/features/(league)/options/queries/leagueOptions";
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
  const { success, leagueId, matchId } = validateUUIds(await params);
  if (!success) notFound();

  const matchInfo = await getMatchInfo(leagueId, matchId);
  if (!matchInfo) notFound();

  console.log(matchInfo);

  return (
    <Container headerLabel="Partita" leagueId={leagueId}>
      <CalendarMatchCard
        className="!rounded-4xl sm:-mt-4"
        leagueId={leagueId}
        homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
        awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
        isLink={false}
        {...matchInfo}
      />
      <Suspense>
        <SuspenseBoundary
          leagueId={leagueId}
          isBye={matchInfo.isBye}
          matchTeamsIds={[
            matchInfo.homeTeam?.id || null,
            matchInfo.awayTeam?.id || null,
          ]}
          splitMatchday={matchInfo.splitMatchday}
        />
      </Suspense>
    </Container>
  );
}

