import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Community, Shield } from "iconoir-react";
import { InviteButton } from "@/features/(league)/leagues/components/InviteButton";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { authUsers } from "drizzle-orm/supabase";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { getUserId } from "@/features/users/utils/user";
import Disclaimer from "@/components/Disclaimer";
import BannedUsersSection from "@/features/(league)/members/components/BannedUsersSection";
import { MemberCard } from "@/features/(league)/members/components/MemberCard";
import { getLeagueMembersTag } from "@/features/(league)/members/db/cache/leagueMember";
import {
  getLeagueTeamsTag,
  getTeamIdTag,
} from "@/features/(league)/teams/db/cache/leagueTeam";
import Container from "@/components/Container";
import { isLeagueAdmin } from "@/features/(league)/members/permissions/leagueMember";

export default async function LeagueMembersPage({
  params,
}: PageProps<"/leagues/[leagueId]/members">) {
  const { leagueId } = await params;
  const members = await getLeagueMembers(leagueId)


  return (
    <Container leagueId={leagueId} headerLabel="Membri della lega">
      <Suspense fallback={<MembersWrapper />}>
        <SuspenseBoundary leagueId={leagueId} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({ leagueId }: { leagueId: string }) {
  const userId = await getUserId();
  if (!userId) return;

  const [isAdmin, members] = await Promise.all([
    isLeagueAdmin(userId, leagueId),
    getLeagueMembers(leagueId),
  ]);


}

function MembersWrapper({}: { members:  }) {
  const groupedMembers = Object.groupBy(members, (member) => member.role);

  if (!members.length)
    return (
      <div className="flex flex-col items-center py-16">
        <div className="size-18 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Community className="size-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-heading mb-2">Nessun membro nella lega</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Invita altri giocatori per iniziare a competere insieme.
        </p>
        <div>
          <InviteButton
            leagueId={leagueId}
            leagueCredentialsPromise={getLeagueInviteCredentials(leagueId)}
          />
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      <MemberSection
        name="Amministratori"
        members={groupedMembers["admin"]}
        icon={<Shield className="size-5 text-primary" />}
        leagueId={leagueId}
        userId={userId}
        isAdmin={isAdmin}
      />

      <MemberSection
        name="Membri"
        members={groupedMembers["member"]}
        icon={<Community className="size-5 text-blue-600" />}
        leagueId={leagueId}
        userId={userId}
        isAdmin={isAdmin}
      />

      {isAdmin && (
        <Suspense>
          <BannedUsersSection leagueId={leagueId} />
        </Suspense>
      )}
    </div>
  );
}

function MemberSection({
  name,
  members,
  icon,
  leagueId,
  userId,
  isAdmin,
}: {
  members: Awaited<ReturnType<typeof getLeagueMembers>> | undefined;
  name: string;
  icon: React.ReactNode;
  leagueId: string;
  isAdmin: boolean;
  userId: string;
}) {
  if (!members?.length) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-heading text-foreground">
          {name}
          <span className="ml-2">({members.length})</span>
        </h2>
      </div>
      <div className="space-y-3">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            leagueId={leagueId}
            userId={userId}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}
