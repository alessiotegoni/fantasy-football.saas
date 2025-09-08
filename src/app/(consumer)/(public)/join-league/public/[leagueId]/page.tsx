import { notFound } from "next/navigation";
import { default as LeagueHeader } from "@/features/(league)/leagues/components/Header";
import BackButton from "@/components/BackButton";
import Disclaimer from "@/components/Disclaimer";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueIdTag } from "@/features/(league)/leagues/db/cache/league";
import { db } from "@/drizzle/db";
import { leagueMembers, leagueSettings, leagues } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import ActionButton from "@/components/ActionButton";
import { authUsers } from "drizzle-orm/supabase";
import { Suspense } from "react";
import LeagueModules from "@/features/(league)/leagues/components/LeagueModules";
import { getLeagueSettingsTag } from "@/features/(league)/settings/db/cache/setting";
import LeaguePlayersPerRole from "@/features/(league)/leagues/components/LeaguePlayersPerRole";
import { Trophy } from "iconoir-react";
import Avatar from "@/components/Avatar";
import { getLeagueMembersTag } from "@/features/(league)/members/db/cache/leagueMember";
import { joinPublicLeague } from "@/features/(league)/members/actions/leagueMember";
import { getLeagueModules } from "@/features/(league)/settings/queries/setting";
import { getTacticalModules } from "@/features/tacticalModules/queries/tacticalModule";
import { getUser } from "@/features/users/utils/user";
import LinkButton from "@/components/LinkButton";

// FIXME: migliorare fcp

export default async function LeagueDetailPage({
  params,
}: PageProps<"/join-league/public/[leagueId]">) {
  return (
    <Suspense>
      <SuspenseBoundary leagueIdPromise={params.then((p) => p.leagueId)} />
    </Suspense>
  );
}

async function SuspenseBoundary({
  leagueIdPromise,
}: {
  leagueIdPromise: Promise<string>;
}) {
  const leagueId = await leagueIdPromise;
  const league = await getPublicLeague(leagueId);
  if (!league) notFound();

  const occupancyPercentage =
    (league.currentMembers / (league.maxMembers ?? 20)) * 100;

  return (
    <>
      <LeagueHeader className="relative">
        <BackButton />
        <div className="flex items-start md:flex-col md:items-center md:text-center pt-16 pb-6">
          <Avatar
            imageUrl={league.imageUrl}
            name={league.name}
            renderFallback={() => (
              <Trophy className="size-10 text-primary border border-primary/20 bg-primary/10" />
            )}
          />

          <div>
            <h1 className="text-2xl font-heading text-primary-foreground md:mt-2 mb-2 px-4">
              {league.name}
            </h1>
            {league.description && (
              <p className="text-sm md:text-base text-primary-foreground opacity-90 max-w-xl px-4">
                {league.description}
              </p>
            )}
          </div>
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
                  <LeagueModules
                    allowedModulesPromise={getLeagueModules(leagueId)}
                    tacticalModulesPromise={getTacticalModules()}
                  />
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

            <Suspense
              fallback={
                <LinkButton
                  disabled={occupancyPercentage === 100}
                  href="/auth/login"
                >
                  Unisciti a {league.name}
                </LinkButton>
              }
            >
              <JoinPublicLeagueButton
                league={league}
                occupancyPercentage={occupancyPercentage}
              />
            </Suspense>
          </div>
        </div>
      </main>

      <footer>
        <Disclaimer />
      </footer>
    </>
  );
}

async function JoinPublicLeagueButton({
  league,
  occupancyPercentage,
}: {
  league: { id: string; name: string };
  occupancyPercentage: number;
}) {
  const user = await getUser();

  if (!user) {
    return (
      <LinkButton disabled={occupancyPercentage === 100} href="/auth/login">
        Unisciti a {league.name}
      </LinkButton>
    );
  }

  return (
    <ActionButton
      loadingText="Entrando nella lega"
      disabled={occupancyPercentage === 100}
      action={joinPublicLeague.bind(null, league.id)}
    >
      Unisciti a {league.name}
    </ActionButton>
  );
}

async function getPublicLeague(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueIdTag(leagueId),
    getLeagueMembersTag(leagueId),
    getLeagueSettingsTag(leagueId)
  );

  const [league] = await db
    .select({
      id: leagues.id,
      name: leagues.name,
      description: leagues.description,
      imageUrl: leagues.imageUrl,
      maxMembers: leagueSettings.maxMembers,
      currentMembers: count(leagueMembers),
      createdAt: leagues.createdAt,
      initialCredits: leagueSettings.initialCredits,
      creatorName: authUsers.email,
    })
    .from(leagues)
    .leftJoin(leagueSettings, eq(leagueSettings.leagueId, leagues.id))
    .leftJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .leftJoin(authUsers, eq(authUsers.id, leagueMembers.userId))
    .where(and(eq(leagues.id, leagueId), eq(leagues.visibility, "public")))
    .groupBy(
      leagues.id,
      leagueSettings.maxMembers,
      leagueSettings.initialCredits,
      authUsers.email
    );

  return league;
}
