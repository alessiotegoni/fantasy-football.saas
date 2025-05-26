import {
  Shield,
  Settings,
  UserPlus,
  Calculator,
  Calendar,
  Database,
  Refresh,
  User,
  List,
  LotOfCash,
  ArrowSeparateVertical,
  NavArrowRight,
  Trophy,
  Copy,
} from "iconoir-react";
import { Star } from "iconoir-react/solid";

import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SidebarItem from "./SidebarItem";
import { Suspense } from "react";
import { getUserId } from "@/features/users/utils/user";
import { getUserLeagues } from "@/features/users/queries/user";
import { cn } from "@/lib/utils";
import { InviteButton } from "./InviteButton";

type Props = {
  leagueId: string;
  name: string;
  joinCode: string;
  password: string | null;
};

export default function LeagueSidebar(league: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <LeagueDropdown {...league} />
        <div className="p-3">
          <Button asChild>
            <Link href="/user/premium">
              <Star className="size-5" />
              <span className="font-medium">Passa a premium</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      {sidebarSections.map((section) => (
        <SidebarGroup key={section.title} className="p-3">
          <SidebarGroupLabel className="font-heading text-lg mb-1">
            {section.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarItem
                  key={item.name}
                  item={item}
                  leagueId={league.leagueId}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
      <SidebarFooter className="hidden sm:block"></SidebarFooter>
    </Sidebar>
  );
}

function LeagueDropdown(league: Props) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="min-w-52 bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4
              rounded-none rounded-br-xl rounded-bl-xl hover:text-white flex justify-between items-center"
          >
            <SidebarMenuButton>
              <h2 className="font-heading text-lg">{league.name}</h2>
              <ArrowSeparateVertical className="!size-5" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[18rem] rounded-xl border border-primary/20">
            <DropdownMenuLabel>Le mie leghe</DropdownMenuLabel>
            <Suspense>
              <UserLeagues leagueId={league.leagueId} />
            </Suspense>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Gestione leghe</DropdownMenuLabel>
            <DropdownMenuItem asChild className="justify-between group">
              <Link href="/leagues/create">
                Crea una lega
                <NavArrowRight className="group-hover:text-white" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="justify-between group">
              <Link href="/leagues/join">
                Entra in una lega
                <NavArrowRight className="group-hover:text-white" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <InviteButton {...league} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

async function UserLeagues({ leagueId }: Pick<Props, "leagueId">) {
  const userId = await getUserId();
  if (!userId) return;
  const userLeagues = await getUserLeagues(userId);

  const isCurrentLeague = (league: (typeof userLeagues)[number]) =>
    leagueId === league.id;

  return userLeagues.map((league) => (
    <DropdownMenuItem
      key={league.id}
      className="flex justify-between items-center gap-2 group"
      asChild
    >
      <Link key={league.id} href={`/leagues/${league.id}`}>
        <div className="flex items-center gap-2">
          {league.imageUrl ? (
            <img
              src={league.imageUrl}
              alt={league.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "flex justify-center items-center rounded-full size-10",
                isCurrentLeague(league) && "bg-primary group-hover:bg-secondary"
              )}
            >
              <Trophy
                className={cn(
                  "size-6 text-white",
                  isCurrentLeague(league) && "group-hover:text-white"
                )}
              />
            </div>
          )}
          <p>{league.name}</p>
        </div>
        {!isCurrentLeague(league) && (
          <NavArrowRight className="text-muted-foreground group-hover:text-white" />
        )}
      </Link>
    </DropdownMenuItem>
  ));
}

export const sidebarSections = [
  {
    title: "Setup lega",
    items: [
      {
        name: "Profilo lega",
        href: "/leagues/:leagueId/profile",
        icon: Shield,
      },
      {
        name: "Impostazioni lega",
        href: "/leagues/:leagueId/options",
        icon: Settings,
      },
      {
        name: "Partecipanti",
        href: "/leagues/:leagueId/participants",
        icon: User,
      },
    ],
  },
  {
    title: "Mercato",
    items: [
      {
        name: "Svincolati",
        href: "/leagues/:leagueId/free-agents",
        icon: UserPlus,
      },
      {
        name: "Listone",
        href: "/leagues/:leagueId/player-list",
        icon: List,
      },
      {
        name: "Scambi",
        href: "/leagues/:leagueId/trades",
        icon: Refresh,
      },
    ],
  },
  {
    title: "Gestione campionato",
    items: [
      {
        name: "Calcola giornate",
        href: "/leagues/:leagueId/calculate-matchday",
        icon: Calculator,
      },
      {
        name: "Genera calendario",
        href: "/leagues/:leagueId/generate-calendar",
        icon: Calendar,
      },
      {
        name: "Gestione rose",
        href: "/leagues/:leagueId/team-management",
        icon: Database,
      },
      {
        name: "Crediti",
        href: "/leagues/:leagueId/credits",
        icon: LotOfCash,
      },
    ],
  },
];
