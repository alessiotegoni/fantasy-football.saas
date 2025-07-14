import Container from "@/components/Container";
import MyLineupProvider from "@/contexts/MyLineupProvider";
import CalendarMatchCard from "@/features/(league)/(admin)/calendar/components/CalendarMatchCard";
import FootballFieldBg from "@/features/(league)/matches/components/FootballFieldBg";
import StarterLineupsWrapper from "@/features/(league)/matches/components/StarterLineupsWrapper";
import { getMatchInfo } from "@/features/(league)/matches/queries/match";
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
    <Container headerLabel="Partita" {...ids}>
      <MyLineupProvider>
        <CalendarMatchCard
          className="!rounded-4xl sm:-mt-4"
          homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
          awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
          isLink={false}
          {...ids}
          {...matchInfo}
        />
        <FootballFieldBg>
          <Suspense>
            <StarterLineupsWrapper {...ids} {...matchInfo} />
          </Suspense>
        </FootballFieldBg>
      </MyLineupProvider>
    </Container>
  );
}
