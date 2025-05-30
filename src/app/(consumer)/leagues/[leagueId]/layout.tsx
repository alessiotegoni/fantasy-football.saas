import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/drizzle/db";
import { Bottombar } from "@/features/leagues/components/BottomBatr";
import LeagueSidebar from "@/features/leagues/components/Sidebar";
import { Topbar } from "@/features/leagues/components/TopBar";
import { getLeagueNameTag } from "@/features/leagues/db/cache/league";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

type Props = {
  children: React.ReactNode;
  params: Promise<{ leagueId: string }>;
};

export default async function LeagueLayout({ children, params }: Props) {
  const { leagueId } = await params;
  const leagueNamePromise = getLeagueName(leagueId);

  return (
    <SidebarProvider>
      <LeagueSidebar
        leagueId={leagueId}
        leagueNamePromise={leagueNamePromise}
      />
      <Topbar leagueNamePromise={leagueNamePromise} />
      <main className="w-full p-4 pt-[calc(60px+20px)] pb-[calc(73px+20px)] lg:py-4">
        {children}
      </main>
      <Bottombar leagueId={leagueId} />
    </SidebarProvider>
  );
}

async function getLeagueName(leagueId: string) {
  "use cache";
  cacheTag(getLeagueNameTag(leagueId));

  return db.query.leagues
    .findFirst({
      columns: {
        name: true,
      },
      where: (league, { eq }) => eq(league.id, leagueId),
    })
    .then((league) => league?.name ?? "");
}
