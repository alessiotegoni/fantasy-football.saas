import { db } from "@/drizzle/db";
import {
  getLeagueMembersTag,
  getLeagueMembersTeamsTag,
} from "@/features/leagueMembers/db/cache/leagueMember";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { ArrowLeft, Community, Shield } from "iconoir-react";
import Link from "next/link";
import { InviteButton } from "@/features/leagues/components/InviteButton";
import { getLeagueInviteCredentials } from "@/features/leagues/queries/league";
import { MemberCard } from "@/features/leagueMembers/components/MemberCard";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { authUsers } from "drizzle-orm/supabase";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import BannedUsersSection from "@/features/leagueMembers/components/BannedUsersSection";

export default async function LeagueMembersPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const members = await getLeagueMembers(leagueId);
  const groupedMembers = Object.groupBy(members, (member) => member.role);

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Membri della lega</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Membri della lega
      </h2>

      {!members.length ? (
        <div className="flex flex-col items-center py-16">
          <div className="size-18 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Community className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-heading mb-2">
            Nessun membro nella lega
          </h2>
          <p className="text-muted-foreground mb-6 text-center">
            Invita altri giocatori per iniziare a competere insieme.
          </p>
          <div>
            <InviteButton
              leagueCredentialsPromise={getLeagueInviteCredentials(leagueId)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <MemberSection
            name="Amministratori"
            members={groupedMembers["admin"]}
            icon={<Shield className="size-5 text-primary" />}
          />

          <MemberSection
            name="Membri"
            members={groupedMembers["member"]}
            icon={<Community className="size-5 text-blue-600" />}
          />

          <Suspense>
            <BannedUsersSection leagueId={leagueId} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

function MemberSection({
  name,
  members,
  icon,
}: {
  members: Awaited<ReturnType<typeof getLeagueMembers>> | undefined;
  name: string;
  icon: React.ReactNode;
}) {
  if (!members?.length) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-lg font-heading text-foreground">
          {name}
          <span className="ml-2">({members.length})</span>
        </h2>
      </div>
      <div className="space-y-3">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
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
