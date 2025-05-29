import { default as LeagueHeader } from "@/features/leagues/components/Header";
import Logo from "@/components/ui/logo";
import Disclaimer from "@/components/Disclaimer";
import BackButton from "@/components/BackButton";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueGlobalTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { leagueMembers, leagueOptions, leagues } from "@/drizzle/schema";
import { count, eq, sql } from "drizzle-orm";
import { getLeagueMembersTag } from "@/features/leagueMembers/db/cache/leagueMember";
import { VirtualizedLeaguesList } from "@/features/leagues/components/VirtualizedLeagueList";

export default async function PublicLeaguesPage() {
  const publicLeagues = await getPublicLeagues();

  return (
    <>
      <LeagueHeader className="relative">
        <BackButton />
        <div className="flex flex-col items-center pt-5 pb-7">
          <Logo withText={false} className="mt-5" />
          <h1 className="text-3xl font-heading text-center text-primary-foreground leading-11 sm:hidden">
            Leghe <br /> Pubbliche
          </h1>
          <h1 className="hidden sm:block text-3xl font-heading text-center text-primary-foreground my-2">
            Leghe Pubbliche
          </h1>
          <p className="text-center text-primary-foreground/80 mt-2 text-sm">
            Scegli una lega e inizia subito a giocare
          </p>
        </div>
      </LeagueHeader>

      <main className="px-6 pb-8">
        <VirtualizedLeaguesList leagues={publicLeagues} />
      </main>

      <footer>
        <Disclaimer />
      </footer>
    </>
  );
}

async function getPublicLeagues() {
  "use cache";
  cacheTag(getLeagueGlobalTag());

  const publicLeagues = await db
    .select({
      id: leagues.id,
      name: leagues.name,
      description: leagues.description,
      maxMembers: leagueOptions.maxMembers,
      currentMembers: count(leagueMembers),
    })
    .from(leagues)
    .leftJoin(leagueOptions, eq(leagueOptions.leagueId, leagues.id))
    .leftJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .where(eq(leagues.visibility, "public"))
    .groupBy(leagues.id, leagueOptions.maxMembers)
    .having(sql`COUNT(${leagueMembers.userId}) < ${leagueOptions.maxMembers}`);

  cacheTag(...publicLeagues.map((league) => getLeagueMembersTag(league.id)));

  return publicLeagues;
}
