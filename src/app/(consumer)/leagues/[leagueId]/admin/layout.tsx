import { isLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserId } from "@/features/users/utils/user";
import { redirect } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";

export default async function LeagueAdminLayout({
  children,
  params,
}: LayoutProps<"/leagues/[leagueId]/admin">) {
  const { leagueId } = await params;

  return (
    <Suspense>
      <SuspenseBoundary leagueId={leagueId}>{children}</SuspenseBoundary>
    </Suspense>
  );
}

async function SuspenseBoundary({
  leagueId,
  children,
}: PropsWithChildren<{ leagueId: string }>) {
  const userId = await getUserId();
  if (!userId || !(await isLeagueAdmin(userId, leagueId))) {
    redirect(`/leagues/${leagueId}`);
  }

  return children;
}
