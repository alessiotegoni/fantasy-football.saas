import { Community, Shield } from "iconoir-react";
import { Suspense } from "react";
import BannedUsersSection from "@/features/(league)/members/components/BannedUsersSection";
import { MemberCard } from "@/features/(league)/members/components/MemberCard";
import { LeagueMember } from "@/features/(league)/members/queries/leagueMember";
import EmptyState from "@/components/EmptyState";
import { League } from "../../leagues/queries/league";
import { InviteButton } from "../../leagues/components/InviteButton";
import { SkeletonButton } from "@/components/Skeleton";

type Props = {
  league?: League;
  userId?: string;
  isAdmin?: boolean;
  leagueId: string;
  members: LeagueMember[];
};

export default function MembersWrapper({
  league,
  userId,
  isAdmin = false,
  leagueId,
  members,
}: Props) {
  const groupedMembers = Object.groupBy(members, (member) => member.role);

  if (!members.length)
    return (
      <EmptyState
        icon={Community}
        title="Nessun membro nella lega"
        description=" Invita altri giocatori per iniziare a competere insieme."
        renderButton={() => (league ? <InviteButton league={league} /> : <SkeletonButton />)}
      />
    );

  return (
    <div className="space-y-8">
      <MemberSection
        name="Amministratori"
        members={groupedMembers["admin"] ?? []}
        icon={<Shield className="size-5 text-primary" />}
        leagueId={leagueId}
        userId={userId}
        isAdmin={isAdmin}
      />

      <MemberSection
        name="Membri"
        members={groupedMembers["member"] ?? []}
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
  members: LeagueMember[];
  name: string;
  icon: React.ReactNode;
  leagueId: string;
  isAdmin: boolean;
  userId?: string;
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
