import { SidebarProvider } from "@/components/ui/sidebar";
import LeagueSidebar from "@/features/(league)/leagues/components/LeagueSidebar";
import { Topbar } from "@/features/(league)/leagues/components/TopBar";
import { LeagueNav } from "../../../../features/(league)/leagues/components/LeagueNav";
import { getLeague } from "@/features/(league)/leagues/queries/league";
import { notFound } from "next/navigation";

export default async function LeagueLayout({
  children,
  params,
}: LayoutProps<"/leagues/[leagueId]">) {
  const { leagueId } = await params;

  const league = await getLeague(leagueId);
  if (!leagueId) notFound();

  return (
    <SidebarProvider>
      <LeagueSidebar league={league} />
      <Topbar league={league} />
      <div className="relative w-full pt-[calc(60px+20px)] pb-[calc(73px+20px)] lg:py-0">
        <LeagueNav leagueId={leagueId} />
        <main className="p-4 pt-0 lg:pt-[calc(60px+16px)]">{children}</main>
      </div>
    </SidebarProvider>
  );
}
