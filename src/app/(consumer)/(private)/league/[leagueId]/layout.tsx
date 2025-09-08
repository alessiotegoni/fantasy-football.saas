import { SidebarProvider } from "@/components/ui/sidebar";
import LeagueSidebar from "@/features/league/leagues/components/LeagueSidebar";
import { Topbar } from "@/features/league/leagues/components/TopBar";
import { LeagueNav } from "../../../../../features/league/leagues/components/LeagueNav";
import { getLeague, League } from "@/features/league/leagues/queries/league";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getUser } from "@/features/dashboard/user/utils/user";
import { isLeagueAdmin } from "@/features/league/members/permissions/leagueMember";
import { isPremiumUnlocked } from "@/features/league/leagues/permissions/league";
import { User } from "@supabase/supabase-js";

export default async function LeagueLayout(
  props: LayoutProps<"/league/[leagueId]">
) {
  const { leagueId } = await props.params;

  const league = await getLeague(leagueId);
  if (!leagueId) notFound();

  return (
    <Suspense fallback={<LeagueLayoutWrapper league={league} {...props} />}>
      <SuspenseBoundary league={league} {...props} />
    </Suspense>
  );
}

async function SuspenseBoundary({
  league,
  children,
}: {
  league: League;
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) return null;

  const [isAdmin, leaguePremium] = await Promise.all([
    isLeagueAdmin(user.id, league.id),
    isPremiumUnlocked(league.id),
  ]);

  return (
    <LeagueLayoutWrapper
      league={league}
      user={user}
      isAdmin={isAdmin}
      leaguePremium={leaguePremium}
    >
      {children}
    </LeagueLayoutWrapper>
  );
}

function LeagueLayoutWrapper({
  children,
  league,
  user,
  isAdmin = false,
  leaguePremium = false,
}: {
  user?: User;
  isAdmin?: boolean;
  leaguePremium?: boolean;
  league: League;
  children: React.ReactNode;
}) {
  const props = {
    user,
    league,
    isAdmin,
    leaguePremium,
  };

  return (
    <SidebarProvider>
      <LeagueSidebar {...props} />
      <Topbar {...props} />
      <div className="relative w-full pt-[calc(60px+20px)] pb-[calc(73px+20px)] lg:py-0">
        <LeagueNav {...props} />
        <main className="p-4 pt-0 lg:pt-[calc(60px+16px)]">{children}</main>
      </div>
    </SidebarProvider>
  );
}
