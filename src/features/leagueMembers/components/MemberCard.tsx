"use client";

import Image from "next/image";
import {
  Shield,
  ShieldXmark,
  User,
  UserBadgeCheck,
  UserXmark,
} from "iconoir-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { LeagueMemberRoleType } from "@/drizzle/schema";
import ActionButton from "@/components/ActionButton";

type Props = {
  member: {
    role: "member" | "admin";
    joinedAt: Date;
    id: string;
    team: {
      imageUrl: string | null;
      name: string;
      managerName: string;
    } | null;
    user: { id: string; email: string | null };
  };
};

export function MemberCard({ member }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/20 transition-colors">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="relative size-12 rounded-full overflow-hidden bg-muted shrink-0">
          {member.team?.imageUrl ? (
            <Image
              src={member.team.imageUrl || "/placeholder.svg"}
              alt={member.team.name || "Team"}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="size-full flex items-center justify-center">
              <User className="size-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-foreground truncate">
              {member.team?.name || "Squadra non ancora creata"}
            </h3>
            {member.role === "admin" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </span>
            )}
          </div>

          {member.team?.managerName && (
            <p className="text-sm text-muted-foreground mb-1">
              Manager: {member.team.managerName}
            </p>
          )}

          <p className="text-sm text-muted-foreground truncate">
            {member.user?.email}
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            Iscritto il {member.joinedAt.toLocaleDateString("it-IT")}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 ml-2">
        <MemberActionsDropdown member={member} />
      </div>
    </div>
  );
}

export function MemberActionsDropdown({ member }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  console.log(isLoading);

  return (
    <DropdownMenu open={isLoading ? true : undefined}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Apri menu azioni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        {getMemberActions(member.role).map(({ name, action, icon: Icon }) => (
          <DropdownMenuItem key={name} asChild>
            <ActionButton
              action={action}
              variant="ghost"
              className="justify-start font-normal"
              onPendingChange={setIsLoading}
            >
              <Icon />
              {name}
            </ActionButton>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// TODO: add actions

const getMemberActions = (role: LeagueMemberRoleType) => [
  { name: "Espelli membro", action: () => "", icon: UserXmark },
  { name: "Banna membro", action: () => "", icon: UserBadgeCheck },
  role === "admin"
    ? { name: "Setta come membro", action: () => "", icon: ShieldXmark }
    : { name: "Setta come admin", action: () => "", icon: Shield },
];
