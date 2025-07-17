import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserId } from "@/features/users/utils/user";
import { redirect } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";

export default async function LeagueAdminLayout({
  children,
  params,
}: PropsWithChildren<{
  params: Promise<{ leagueId: string }>;
}>) {
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
  if (!userId || !(await getLeagueAdmin(userId, leagueId))) {
    redirect(`/leagues/${leagueId}`);
  }

  return children;
}
