import Container from "@/components/Container";
import CalendarMatchCard from "@/features/(league)/(admin)/calendar/components/CalendarMatchCard";
import { getMatchInfo } from "@/features/(league)/matches/queries/match";
import { getBonusMalusesOptions } from "@/features/(league)/options/queries/leagueOptions";
import { validateUUIds } from "@/schema/helpers";
import { notFound } from "next/navigation";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ leagueId: string; matchId: string }>;
}) {
  const { success, leagueId, matchId } = validateUUIds(await params);
  if (!success) notFound();

  const [matchInfo, { bonusMalusOptions }] = await Promise.all([
    getMatchInfo(leagueId, matchId),
    getBonusMalusesOptions(leagueId),
  ]);
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

    </Container>
  );
}
