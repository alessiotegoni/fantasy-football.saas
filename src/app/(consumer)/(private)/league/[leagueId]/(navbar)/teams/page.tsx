import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import TeamsList from "@/features/(league)/teams/components/TeamsList";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { getUserId } from "@/features/dashboard/user/utils/user";
import { NavArrowRight, Search } from "iconoir-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function LeagueTeamsPage({
  params,
}: PageProps<"/league/[leagueId]/teams">) {
  const { leagueId } = await params;
  const leagueTeams = await getLeagueTeams(leagueId);

  return (
    <Container
      headerLabel="Squadre"
      leagueId={leagueId}
      className="max-w-[900px]"
    >
      {!leagueTeams.length ? (
        <div className="flex flex-col justify-center items-center py-8 sm:py-12 bg-muted/30 rounded-2xl">
          <div className="size-16 shrink-0 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-heading mb-2">Nessuna squadra trovata</h3>
          <p className="text-muted-foreground">
            Prova a riaggiornare la pagina
          </p>
          <Button variant="gradient" asChild className="w-fit mt-7 gap-4 !px-4">
            <Link href={`/league/${leagueId}/teams/create`}>
              Oppure crea la tua prima squadra
              <NavArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      ) : (
        <Suspense
          fallback={<TeamsList teams={leagueTeams} leagueId={leagueId} />}
        >
          <SuspendedComponent teams={leagueTeams} leagueId={leagueId} />
        </Suspense>
      )}
    </Container>
  );
}

async function SuspendedComponent(props: {
  teams: Awaited<ReturnType<typeof getLeagueTeams>>;
  leagueId: string;
}) {
  const userId = await getUserId();

  return <TeamsList {...props} teamUserId={userId} />;
}
