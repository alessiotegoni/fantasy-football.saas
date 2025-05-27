import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/drizzle/db";
import { Bottombar } from "@/features/leagues/components/BottomBatr";
import LeagueSidebar from "@/features/leagues/components/Sidebar";
import { Topbar } from "@/features/leagues/components/TopBar";
import { getLeagueLeagueTag } from "@/features/leagues/db/cache/league";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ leagueId: string }>;
};

export default function LeagueLayout({ children, params }: Props) {
  return (
    <Suspense>
      <SuspenseBoundary leagueIdPromise={params.then((p) => p.leagueId)}>
        {children}
      </SuspenseBoundary>
    </Suspense>
  );
}

async function SuspenseBoundary({
  leagueIdPromise,
  children,
}: {
  children: React.ReactNode;
  leagueIdPromise: Promise<string>;
}) {
  const league = await getLeagueExist(await leagueIdPromise);
  if (!league.exist) redirect("/");

  return (
    <SidebarProvider>
      <LeagueSidebar {...league} />
      <Topbar {...league} />
      <main className="w-full p-4 pt-[calc(60px+20px)] pb-[calc(73px+20px)] lg:py-4">
        {children}
      </main>
      <Bottombar {...league} />
    </SidebarProvider>
  );
}

async function getLeagueExist(leagueId: string) {
  "use cache";

  const league = await db.query.leagues.findFirst({
    columns: {
      name: true,
      joinCode: true,
      password: true,
    },
    where: ({ id }, { eq }) => eq(id, leagueId),
  });

  if (!league) return { exist: false } as const;

  cacheTag(getLeagueLeagueTag(leagueId));

  return {
    exist: true,
    leagueId,
    ...league,
  } as const;
}
