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
import { useCallback, useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import ActionButton from "@/components/ActionButton";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../../../../components/ui/alert-dialog";
import { banMember, kickMember, MemberActionArgs, setMemberRole } from "../actions/memberActions";
import { LeagueMemberRoleType } from "@/drizzle/schema";
import Avatar from "@/components/Avatar";

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
  leagueId: string;
  isAdmin: boolean;
  userId: string;
};

export function MemberCard({ member, leagueId, isAdmin, userId }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/20 transition-colors">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <Avatar
          imageUrl={member.team?.imageUrl}
          name={member.team?.name || "Team"}
          size={12}
          renderFallback={() => (
            <div className="size-full flex items-center justify-center">
              <User className="size-6 text-muted-foreground" />
            </div>
          )}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-foreground truncate">
              {member.team?.name || "Squadra non ancora creata"}
            </h3>
            {member.role === "admin" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Shield className="size-3 mr-1" />
                Admin
              </span>
            )}
          </div>

          {member.team?.managerName && (
            <p className="text-sm text-muted-foreground mb-1">
              Manager: {member.team.managerName}
            </p>
          )}

          {!member.team && (
            <p className="text-sm text-muted-foreground truncate">
              {member.user?.email}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1">
            Iscritto il {member.joinedAt.toLocaleDateString("it-IT")}
          </p>
        </div>
      </div>

      {isAdmin && userId !== member.user.id && (
        <div className="flex-shrink-0 ml-2">
          <MemberActionsDropdown member={member} leagueId={leagueId} />
        </div>
      )}
    </div>
  );
}

export function MemberActionsDropdown({
  member,
  leagueId,
}: Pick<Props, "member" | "leagueId">) {
  const [isLoading, setIsLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    ReturnType<typeof getMemberActions>[number] | null
  >(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const actions = useMemo(
    () =>
      getMemberActions({
        leagueId,
        memberId: member.id,
        role: member.role,
        userId: member.user.id,
      }),
    [leagueId, member]
  );

  const handleItemClick = useCallback(
    (action: ReturnType<typeof getMemberActions>[number]) => {
      setSelectedAction(action);
      setIsDialogOpen(true);
      setMenuOpen(false);
    },
    []
  );

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Apri menu azioni</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          {actions.map((a) => (
            <DropdownMenuItem
              key={a.name}
              className="flex items-center gap-2"
              onClick={handleItemClick.bind(null, a)}
            >
              <a.icon className="size-4" />
              {a.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedAction && (
        <AlertDialog
          open={isLoading ? true : isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedAction?.description ||
                  "Questa azione non può essere annullata."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel> Annulla </AlertDialogCancel>
              <ActionButton
                action={selectedAction.action}
                onPendingChange={setIsLoading}
                loadingText={selectedAction.loadingText}
                variant="destructive"
                toastData={{ position: "bottom-right" }}
              >
                <selectedAction.icon />
                {selectedAction.name}
              </ActionButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

function getMemberActions({
  role,
  ...args
}: MemberActionArgs & { role: LeagueMemberRoleType }) {
  const memberRoleAction =
    role === "admin"
      ? {
          name: "Setta come membro",
          action: setMemberRole.bind(null, { ...args, role: "member" }),
          icon: ShieldXmark,
          loadingText: "Setto ruolo membro",
          description:
            "Tutti i privilegi da admin di questo utente verranno rimossi",
        }
      : {
          name: "Setta come admin",
          action: setMemberRole.bind(null, { ...args, role: "admin" }),
          icon: Shield,
          loadingText: "Setto ruolo admin",
          description:
            "L'utente potra' accedere a tutti i privilegi della lega, ovvero: Sezione gestione campionato, cambiare le impostazioni, cambiare il profilo della lega, espellere, bannare, settare admin e settare membri tutti gli utenti che ne fanno parte della lega escluso il creatore ",
        };

  return [
    {
      name: "Espelli membro",
      action: kickMember.bind(null, args),
      icon: UserXmark,
      loadingText: "Espello membro",
      description:
        "Il membro verra' espulso perdendo il proprio team ed i propri giocatori ma potra comunque rientrare",
    },
    {
      name: "Banna membro",
      action: banMember.bind(null, args),
      icon: UserBadgeCheck,
      loadingText: "Banno membro",
      description:
        "Il membro verra' bannato perdendo il proprio team ed i propri giocatori ma NON potra rientrare a meno che venga sbannato",
    },
    memberRoleAction,
  ];
}
