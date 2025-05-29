import { notFound } from "next/navigation";
import { default as LeagueHeader } from "@/features/leagues/components/Header";
import Logo from "@/components/ui/logo";
import BackButton from "@/components/BackButton";
import Disclaimer from "@/components/Disclaimer";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueIdTag } from "@/features/leagues/db/cache/league";
import { getLeagueMembersTag } from "@/features/leagueMembers/db/cache/leagueMember";
import { db } from "@/drizzle/db";
import { leagueMembers, leagueOptions, leagues } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import ActionButton from "@/components/ActionButton";
import { joinPublicLeague } from "@/features/leagueMembers/actions/leagueMember";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authUsers } from "drizzle-orm/supabase";
import { Suspense } from "react";
import LeagueModules from "@/features/leagues/components/LeagueModules";
import { getLeagueOptionsTag } from "@/features/leagueOptions/db/cache/leagueOption";
import LeaguePlayersPerRole from "@/features/leagues/components/LeaguePlayersPerRole";

export default async function LeagueDetailPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const league = await getPublicLeague(leagueId);
  if (!league) notFound();

  const occupancyPercentage =
    (league.currentMembers / (league.maxMembers ?? 20)) * 100;

  return (
    <>
      <LeagueHeader className="relative">
        <BackButton />
        <div className="flex flex-col items-center pt-5 pb-7">
          <Logo withText={false} className="mt-5" />
          <h1 className="text-2xl font-heading text-center text-primary-foreground my-2">
            {league.name}
          </h1>
        </div>
      </LeagueHeader>

      <main className="px-4 md:px-6 pb-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-background rounded-2xl border border-border p-4 md:p-6">
                <h3 className="font-heading text-lg mb-3">Dettagli lega</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <span className="font-medium text-foreground">
                      Creatore:
                    </span>{" "}
                    {league.creatorName ?? "Sconosciuto"}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Data creazione:
                    </span>{" "}
                    {new Date(league.createdAt).toLocaleDateString("it-IT")}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">
                      Crediti iniziali:
                    </span>{" "}
                    {league.initialCredits}
                  </p>
                </div>
              </div>

              <div className="bg-background rounded-2xl border border-border p-4 md:p-6">
                <h3 className="font-heading text-lg mb-3">Moduli tattici</h3>
                <Suspense>
                  <LeagueModules leagueId={leagueId} />
                </Suspense>
              </div>
            </div>

            <div className="bg-background rounded-2xl border border-border p-4 md:p-6">
              <h3 className="font-heading text-lg mb-3">Giocatori per ruolo</h3>
              <Suspense>
                <LeaguePlayersPerRole leagueId={leagueId} />
              </Suspense>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-4 md:p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Posti occupati</span>
                <span>{Math.round(occupancyPercentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </div>

            <ActionButton
              loadingText="Entrando nella lega"
              disabled={occupancyPercentage === 100}
              action={joinPublicLeague.bind(null, league.id)}
            >
              Unisciti a {league.name}
            </ActionButton>
          </div>
        </div>
      </main>

      <footer>
        <Disclaimer />
      </footer>
    </>
  );
}

// TODO: add league description and image
// FIXME: leagueHeader on mobile


async function getPublicLeague(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueIdTag(leagueId),
    getLeagueMembersTag(leagueId),
    getLeagueOptionsTag(leagueId)
  );

  const [league] = await db
    .select({
      id: leagues.id,
      name: leagues.name,
      description: leagues.description,
      imageUrl: leagues.imageUrl,
      maxMembers: leagueOptions.maxMembers,
      currentMembers: count(leagueMembers),
      createdAt: leagues.createdAt,
      initialCredits: leagueOptions.initialCredits,
      creatorName: authUsers.email,
    })
    .from(leagues)
    .leftJoin(leagueOptions, eq(leagueOptions.leagueId, leagues.id))
    .leftJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .leftJoin(authUsers, eq(authUsers.id, leagueMembers.userId))
    .where(and(eq(leagues.id, leagueId), eq(leagues.visibility, "public")))
    .groupBy(
      leagues.id,
      leagueOptions.maxMembers,
      leagueOptions.initialCredits,
      authUsers.email
    );

  return league;
}
