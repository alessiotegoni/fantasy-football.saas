import {
  Shield,
  Settings,
  Calculator,
  Calendar,
  Refresh,
  User as UserIcon,
  Community,
  CoinsSwap,
  Coins,
  Hammer,
  DatabaseScriptPlus,
} from "iconoir-react";
import { Star } from "iconoir-react/solid";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SidebarItem from "./SidebarItem";
import LeagueDropdown from "./LeagueDropdown";
import UserDropdown from "@/features/dashboard/user/components/userDropdown";
import { League } from "../queries/league";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { Suspense } from "react";

type Props = {
  user?: User;
  league: League;
  isAdmin: boolean;
  leaguePremium: boolean;
};

export default function LeagueSidebar({
  user,
  league,
  isAdmin,
  leaguePremium,
}: Props) {
  const visibleSections = sidebarSections.filter(
    (section) => !(section.type === "private" && !isAdmin)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <LeagueDropdown user={user} league={league} />
        <div className="p-3">
          <Button asChild>
            <Link href="/dashboard/user/premium">
              <Star className="size-5" />
              <span className="font-medium">Passa a premium</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="custom-scrollbar">
        {visibleSections.map((section) => (
          <LeagueSidebarSection
            key={section.title}
            section={section}
            leagueId={league.id}
            leaguePremium={leaguePremium}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="hidden lg:block lg:border lg:border-border">
        <Suspense>
          <UserDropdown user={user} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

function LeagueSidebarSection({
  section,
  leagueId,
  leaguePremium,
}: {
  section: SidebarSectionConfig;
  leagueId: string;
  leaguePremium: boolean;
}) {
  const isLocked = section.type === "premium" && !leaguePremium;

  return (
    <SidebarGroup className="p-3">
      <SidebarGroupLabel
        className={cn(
          "font-heading text-lg mb-1",
          isLocked &&
            "mb-0 bg-background rounded-2xl rounded-bl-none rounded-br-none px-5 flex-col items-start h-fit pt-4"
        )}
      >
        {isLocked && (
          <div className="flex items-center gap-2 text-primary font-semibold mb-3">
            <Star className="size-5" />
            <p className="text-base">Premium</p>
          </div>
        )}
        {section.title}
      </SidebarGroupLabel>
      <SidebarGroupContent
        className={cn(
          isLocked &&
            "p-2 bg-background rounded-2xl rounded-tl-none rounded-tr-none"
        )}
      >
        <SidebarMenu className={cn(isLocked && "pointer-events-none")}>
          {section.items.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              leagueId={leagueId}
              showLink={!isLocked}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
  basePath?: string;
  exact?: boolean;
};

export type SidebarSectionConfig = {
  title: string;
  items: SidebarLink[];
  type: "public" | "private" | "premium";
};

const sidebarSections: SidebarSectionConfig[] = [
  {
    title: "Setup lega",
    type: "public",
    items: [
      {
        name: "Profilo lega",
        href: "/league/:leagueId/profile",
        icon: Shield,
      },
      {
        name: "Impostazioni lega",
        href: "/league/:leagueId/settings/general",
        icon: Settings,
        basePath: "/league/:leagueId/",
      },
      {
        name: "Partecipanti",
        href: "/league/:leagueId/members",
        icon: UserIcon,
      },
    ],
  },
  {
    title: "Mercato",
    type: "public",
    items: [
      {
        name: "Listone giocatori",
        href: "/league/:leagueId/players-list",
        icon: Community,
      },
      {
        name: "I miei scambi",
        href: "/league/:leagueId/my-trades",
        icon: CoinsSwap,
      },
      {
        name: "Scambi della lega",
        href: "/league/:leagueId/trades",
        icon: Refresh,
      },
    ],
  },
  {
    title: "Gestione campionato",
    type: "private",
    items: [
      {
        name: "Calcola giornate",
        href: "/league/:leagueId/admin/calculate-matchday",
        icon: Calculator,
      },
      {
        name: "Genera calendario",
        href: "/league/:leagueId/admin/generate-calendar",
        icon: Calendar,
      },
      {
        name: "Gestisci Crediti",
        href: "/league/:leagueId/admin/handle-credits",
        icon: Coins,
      },
    ],
  },
  {
    title: "Gestione aste",
    type: "premium",
    items: [
      {
        name: "Crea asta",
        href: "/league/:leagueId/premium/auctions/create",
        icon: DatabaseScriptPlus,
      },
      {
        name: "Aste della lega",
        href: "/league/:leagueId/premium/auctions",
        icon: Hammer,
        exact: true,
      },
    ],
  },
];
