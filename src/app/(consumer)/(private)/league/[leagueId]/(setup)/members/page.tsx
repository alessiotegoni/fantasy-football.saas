import { Suspense } from "react";
import { getUserId } from "@/features/dashboard/user/utils/user";
import Container from "@/components/Container";
import { isLeagueAdmin } from "@/features/league/members/permissions/leagueMember";
import {
  getLeagueMembers,
  LeagueMember,
} from "@/features/league/members/queries/leagueMember";
import { getLeague } from "@/features/league/leagues/queries/league";
import MembersWrapper from "@/features/league/members/components/MembersWrapper";

export default async function LeagueMembersPage({
  params,
}: PageProps<"/league/[leagueId]/members">) {
  const { leagueId } = await params;
  const members = await getLeagueMembers(leagueId);

  return (
    <Container leagueId={leagueId} headerLabel="Membri della lega">
      <Suspense
        fallback={<MembersWrapper leagueId={leagueId} members={members} />}
      >
        <SuspenseBoundary leagueId={leagueId} members={members} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  members,
}: {
  leagueId: string;
  members: LeagueMember[];
}) {
  const userId = await getUserId();
  if (!userId) return;

  const [isAdmin, league] = await Promise.all([
    isLeagueAdmin(userId, leagueId),
    getLeague(leagueId),
  ]);

  return (
    <MembersWrapper
      league={league}
      leagueId={leagueId}
      members={members}
      userId={userId}
      isAdmin={isAdmin}
    />
  );
}
