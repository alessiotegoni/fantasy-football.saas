import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/drizzle/db";
import { Bottombar } from "@/features/leagues/components/BottomBatr";
import LeagueSidebar from "@/features/leagues/components/Sidebar";
import { Topbar } from "@/features/leagues/components/TopBar";
import { getLeagueLeagueTag } from "@/features/leagues/db/cache/league";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";

export default async function LeagueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const { exist, leagueName } = await getLeagueExist(leagueId);
  if (!exist) redirect("/");

  return (
    <SidebarProvider>
      <LeagueSidebar leagueId={leagueId} leagueName={leagueName} />
      <Topbar leagueName={leagueName} />
      <main>{children}</main>
      <Bottombar leagueId={leagueId} />
    </SidebarProvider>
  );
}

async function getLeagueExist(
  leagueId: string
): Promise<
  { exist: false; leagueName: undefined } | { exist: true; leagueName: string }
> {
  "use cache";

  const league = await db.query.leagues.findFirst({
    columns: {
      name: true,
    },
    where: ({ id }, { eq }) => eq(id, leagueId),
  });

  if (!league) return { exist: false, leagueName: undefined };

  cacheTag(getLeagueLeagueTag(leagueId));

  return { exist: true, leagueName: league.name };
}
