import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/drizzle/db";
import LeagueSidebar from "@/features/(league)/leagues/components/Sidebar";
import { Topbar } from "@/features/(league)/leagues/components/TopBar";
import { getLeagueNameTag } from "@/features/(league)/leagues/db/cache/league";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { LeagueNav } from "../../../../features/(league)/leagues/components/LeagueNav";

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
      <div className="relative w-full pt-[calc(60px+20px)] pb-[calc(73px+20px)] lg:pt-0">
        <LeagueNav leagueId={leagueId} />
        <main className="p-4 pt-0 lg:pt-[calc(60px+16px)]">{children}</main>
      </div>
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
