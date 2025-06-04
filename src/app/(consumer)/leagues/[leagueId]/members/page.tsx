import { db } from "@/drizzle/db";
import {
  getLeagueMembersTag,
  getLeagueMembersTeamsTag,
} from "@/features/leagueMembers/db/cache/leagueMember";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { ArrowLeft, Community, Shield } from "iconoir-react";
import Link from "next/link";
import { InviteButton } from "@/features/leagues/components/InviteButton";
import {
  getLeagueAdmin,
  getLeagueInviteCredentials,
} from "@/features/leagues/queries/league";
import { MemberCard } from "@/features/leagueMembers/components/MemberCard";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { authUsers } from "drizzle-orm/supabase";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import BannedUsersSection from "@/features/leagueMembers/components/BannedUsersSection";
import { getUserId } from "@/features/users/utils/user";
import Disclaimer from "@/components/Disclaimer";

export default async function LeagueMembersPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-6 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Membri della lega</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Membri della lega
      </h2>
      <Suspense>
        <SuspenseBoundary leagueId={leagueId} />
      </Suspense>
      <Disclaimer />
    </div>
  );
}

async function SuspenseBoundary({ leagueId }: { leagueId: string }) {
  const userId = await getUserId();
  if (!userId) return;

  const [isAdmin, members] = await Promise.all([
    getLeagueAdmin(userId, leagueId),
    getLeagueMembers(leagueId),
  ]);

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

export async function getLeagueMembers(leagueId: string) {
  "use cache";
  cacheTag(getLeagueMembersTag(leagueId), getLeagueMembersTeamsTag(leagueId));

  const results = await db
    .select({
      id: leagueMembers.id,
      role: leagueMembers.role,
      joinedAt: leagueMembers.joinedAt,
      user: {
        id: leagueMembers.userId,
        email: authUsers.email,
      },
      team: {
        name: leagueMemberTeams.name,
        managerName: leagueMemberTeams.managerName,
        imageUrl: leagueMemberTeams.imageUrl,
      },
    })
    .from(leagueMembers)
    .leftJoin(authUsers, eq(leagueMembers.userId, authUsers.id))
    .leftJoin(
      leagueMemberTeams,
      eq(leagueMembers.id, leagueMemberTeams.leagueMemberId)
    )
    .where(eq(leagueMembers.leagueId, leagueId));

  return results;
}
