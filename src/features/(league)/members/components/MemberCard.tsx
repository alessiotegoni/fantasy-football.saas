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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { banMember, kickMember, setMemberRole } from "../actions/memberActions";
import Avatar from "@/components/Avatar";
import { SetRoleMemberSchema } from "../schema/leagueMember";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import MemberActionDialog from "./MemberActionDialog";

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
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-background rounded-3xl border border-border hover:border-primary/20 transition-colors",
        member.user.id === userId && "border-primary"
      )}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <Avatar
          imageUrl={member.team?.imageUrl}
          name={member.team?.name || "Team"}
          className="size-12"
          renderFallback={() => (
            <div className="size-full flex items-center justify-center">
              <User className="size-6 text-muted-foreground" />
            </div>
          )}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-1">
            <h3 className="font-medium text-foreground truncate">
              {member.team?.name || "Squadra non ancora creata"}
            </h3>
            {member.role === "admin" && (
              <Badge className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                <Shield className="!size-4" />
                Admin
              </Badge>
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
  const actions = getMemberActions({
    leagueId,
    memberId: member.id,
    role: member.role,
    userId: member.user.id,
  });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreVertical className="size-4" />
          <span className="sr-only">Apri menu azioni</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl flex flex-col">
        {actions.map((action) => (
          <MemberActionDialog key={action.name} action={action} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// TODO: add logic to allow user add reason to ban

function getMemberActions({ role, ...args }: SetRoleMemberSchema) {
  const memberRoleAction =
    role === "admin"
      ? {
          name: "Setta come membro",
          fn: setMemberRole.bind(null, { ...args, role: "member" }),
          icon: ShieldXmark,
          loadingText: "Setto ruolo membro",
          description:
            "Tutti i privilegi da admin di questo utente verranno rimossi",
        }
      : {
          name: "Setta come admin",
          fn: setMemberRole.bind(null, { ...args, role: "admin" }),
          icon: Shield,
          loadingText: "Setto ruolo admin",
          description:
            "L'utente potra' accedere a tutti i privilegi della lega, ovvero: Sezione gestione campionato, cambiare le impostazioni, cambiare il profilo della lega, espellere, bannare, settare admin e settare membri tutti gli utenti che ne fanno parte della lega escluso il creatore ",
        };

  return [
    {
      name: "Espelli membro",
      fn: kickMember.bind(null, args),
      icon: UserXmark,
      loadingText: "Espello membro",
      description:
        "Il membro verra' espulso perdendo il proprio team ed i propri giocatori ma potra comunque rientrare",
    },
    {
      name: "Banna membro",
      fn: banMember.bind(null, { ...args, reason: null }),
      icon: UserBadgeCheck,
      loadingText: "Banno membro",
      description:
        "Il membro verra' bannato perdendo il proprio team ed i propri giocatori ma NON potra rientrare a meno che venga sbannato",
    },
    memberRoleAction,
  ];
}
