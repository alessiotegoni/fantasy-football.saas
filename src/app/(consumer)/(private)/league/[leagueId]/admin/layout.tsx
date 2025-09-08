import { isLeagueAdmin } from "@/features/league/members/permissions/leagueMember";
import { getUserId } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import { PropsWithChildren, Suspense } from "react";

export default async function LeagueAdminLayout({
  children,
  params,
}: LayoutProps<"/league/[leagueId]/admin">) {
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
    redirect(`/league/${leagueId}`);
  }

  return children;
}
