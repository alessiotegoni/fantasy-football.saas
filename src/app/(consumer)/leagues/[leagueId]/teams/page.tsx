import { Button } from "@/components/ui/button";
import TeamsList from "@/features/(league)/leagueTeams/components/TeamsList";
import { getLeagueTeams } from "@/features/(league)/leagueTeams/queries/leagueTeam";
import { getUserId } from "@/features/users/utils/user";
import { ArrowLeft, NavArrowRight, Search } from "iconoir-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function LeagueTeamsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const leagueTeams = await getLeagueTeams(leagueId);

  return (
    <div className="max-w-[900px] mx-auto md:p-4">
      <div className="flex items-center mb-6 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Squadre</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">Squadre</h2>

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
            <Link href={`/leagues/${leagueId}/teams/create`}>
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
    </div>
  );
}

async function SuspendedComponent(props: {
  teams: Awaited<ReturnType<typeof getLeagueTeams>>;
  leagueId: string;
}) {
  const userId = await getUserId();

  return <TeamsList {...props} teamUserId={userId} />;
}
